import { ChevronRight, CornerUpLeft, Wrench } from 'lucide-react';
import { DataTable, EmptyState, StatusBadge, Tag } from '@/components/ui';
import { colors, status, text } from '@/theme/theme';
import { daysSince, formatDate, formatINR, formatNumber } from '@/utils/format';
import { ASSIGNMENT_TONE, RFQ_STATUS_TONE } from '../data/constants';
import BuyerCell from './BuyerCell';
import PriorityPill from './PriorityPill';

const clamp = { display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' };

const COLUMNS = {
  priority: { key: 'priority', label: 'Priority', sortable: true, width: 84, render: (l) => <PriorityPill priority={l.priority} /> },
  pr: {
    key: 'pr', label: 'PR / Line', sortable: true, sortValue: (l) => l.id,
    render: (l) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 150 }}>
        <span style={{ fontWeight: 600, color: colors.navy, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
          {l.prNumber}<span style={{ color: colors.textDisabled, fontWeight: 500 }}> / {l.lineItem}</span>
        </span>
        <span style={{ ...text.caption, whiteSpace: 'nowrap' }}>{formatDate(l.prDate)} · {l.docType}</span>
        {l.sendBack && (
          <span style={{ marginTop: 2 }}>
            <Tag tone="error" size="sm" icon={<CornerUpLeft size={11} />}>Issue in PR</Tag>
          </span>
        )}
      </div>
    ),
  },
  material: {
    key: 'material', label: 'Material / Service', sortable: true, sortValue: (l) => l.materialDesc,
    render: (l) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 180, maxWidth: 260 }}>
        <span style={{ ...clamp, fontWeight: 500, color: colors.textPrimary }} title={l.materialDesc}>
          {l.prType === 'Service' && <Wrench size={13} color={colors.steel} style={{ marginRight: 6, verticalAlign: -2 }} />}
          {l.materialDesc}
        </span>
        <span style={{ ...text.caption, whiteSpace: 'nowrap' }}>{l.materialCode} · Grp {l.materialGroup} · {l.opexCapex}</span>
      </div>
    ),
  },
  requisitioner: {
    key: 'requisitioner', label: 'Requisitioner', sortable: true,
    render: (l) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ whiteSpace: 'nowrap' }}>{l.requisitioner}</span>
        <span style={{ ...text.caption, whiteSpace: 'nowrap' }}>{l.plantCode} · {l.city}</span>
      </div>
    ),
  },
  qty: {
    key: 'qty', label: 'Qty', align: 'right', sortable: true,
    render: (l) => (
      <span style={{ whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
        {formatNumber(l.qty)} <span style={{ color: colors.textSecondary, fontSize: 12 }}>{l.uom}</span>
      </span>
    ),
  },
  value: {
    key: 'value', label: 'Value', align: 'right', sortable: true, sortValue: (l) => l.totalValue,
    render: (l) => <span style={{ fontWeight: 600, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{formatINR(l.totalValue)}</span>,
  },
  buyer: { key: 'buyer', label: 'Active buyer', sortable: true, sortValue: (l) => l.activeBuyer || 'zzz', render: (l) => <BuyerCell line={l} /> },
  age: {
    key: 'age', label: 'Age', align: 'right', sortable: true, sortValue: (l) => (l.firstRelease ? daysSince(l.firstRelease) : -1),
    render: (l) => {
      if (!l.firstRelease) return <span style={{ color: colors.textDisabled }}>—</span>;
      const d = daysSince(l.firstRelease);
      const tone = d > 14 ? status.error.color : d > 7 ? status.warning.color : colors.textSecondary;
      return <span style={{ color: tone, fontWeight: 600, whiteSpace: 'nowrap' }}>{d}d</span>;
    },
  },
  assignment: {
    key: 'assignment', label: 'Assignment', sortable: true, sortValue: (l) => l.assignmentStatus,
    render: (l) => <StatusBadge status={ASSIGNMENT_TONE[l.assignmentStatus]}>{l.assignmentStatus}</StatusBadge>,
  },
  rfq: {
    key: 'rfq', label: 'PR → RFQ', sortable: true, sortValue: (l) => l.rfqStatus,
    render: (l) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start' }}>
        <StatusBadge status={RFQ_STATUS_TONE[l.rfqStatus]}>{l.rfqStatus}</StatusBadge>
        {l.rfqEventId && <span style={{ ...text.caption, whiteSpace: 'nowrap' }}>Event {l.rfqEventId.replace(/^0+/, '')}</span>}
      </div>
    ),
  },
  lastPo: {
    key: 'lastPo', label: 'Last PO', sortable: true, sortValue: (l) => l.lastPoNo,
    render: (l) =>
      l.lastPoNo ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{l.lastPoNo}<span style={{ color: colors.textDisabled }}> / {l.lastPoLine}</span></span>
          <span style={{ ...text.caption, whiteSpace: 'nowrap' }}>Vendor {l.lastPoVendor}</span>
        </div>
      ) : (
        <span style={{ ...text.caption }}>No history</span>
      ),
  },
  chevron: { key: 'chevron', label: '', width: 36, render: () => <ChevronRight size={18} color={colors.textDisabled} /> },
};

const LAYOUTS = {
  admin: ['priority', 'pr', 'material', 'requisitioner', 'value', 'buyer', 'rfq', 'chevron'],
  buyer: ['priority', 'pr', 'material', 'requisitioner', 'qty', 'value', 'age', 'rfq', 'lastPo', 'chevron'],
};

/** Compact PR line table. Full field list lives in the detail drawer. */
export default function PRTable({ rows, variant = 'admin', selected, onSelectionChange, onRowClick }) {
  return (
    <DataTable
      columns={LAYOUTS[variant].map((k) => COLUMNS[k])}
      rows={rows}
      selectable
      selected={selected}
      onSelectionChange={onSelectionChange}
      onRowClick={onRowClick}
      pageSize={10}
      minWidth={1000}
      empty={<EmptyState title="No PR lines match" description="Try clearing a quick filter or widening the date range." />}
    />
  );
}
