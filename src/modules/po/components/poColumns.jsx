import { AlertTriangle, CalendarClock, ChevronRight, MessageSquareText } from 'lucide-react';
import { Avatar, StatusBadge, Tag } from '@/components/ui';
import { colors, radius, status, text } from '@/theme/theme';
import { formatCompactINR, formatDate, formatINR } from '@/utils/format';
import { PO_STATUS_TONE, STATUS_SHORT } from '../data/constants';
import { vendor } from '../data/mockData';
import { pendingChanges, poDeliveredPct, poOverdueItems, poPendingValue, poTotal } from '../data/poMath';

function RemarksButton({ po, onClick }) {
  const n = po.remarks.length;
  return (
    <button
      type="button"
      aria-label={`Remarks for PO ${po.poNumber}`}
      onClick={(e) => { e.stopPropagation(); onClick(po); }}
      style={{
        position: 'relative', width: 34, height: 34, borderRadius: radius.md, cursor: 'pointer', display: 'grid', placeItems: 'center',
        border: `1px solid ${colors.border}`, background: colors.bgCard, color: n ? colors.steel : colors.textDisabled,
      }}
    >
      <MessageSquareText size={16} />
      {n > 0 && (
        <span style={{ position: 'absolute', top: -6, right: -6, minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999, background: colors.steel, color: colors.white, fontSize: 11, fontWeight: 600, display: 'grid', placeItems: 'center' }}>{n}</span>
      )}
    </button>
  );
}

/** Columns for the PO dashboard table. */
export const poColumns = ({ onRemarks }) => [
  {
    key: 'po', label: 'PO number', sortable: true, sortValue: (p) => p.poNumber,
    render: (p) => {
      const changes = pendingChanges(p).length;
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontWeight: 600, color: colors.navy, fontVariantNumeric: 'tabular-nums' }}>{p.poNumber}</span>
          <span style={{ ...text.caption, whiteSpace: 'nowrap' }}>{formatDate(p.createdOn)} · {p.docType}</span>
          {changes > 0 && <span><Tag size="sm" tone="warning" icon={<CalendarClock size={11} />}>{changes} date request{changes > 1 ? 's' : ''}</Tag></span>}
        </div>
      );
    },
  },
  {
    key: 'vendor', label: 'Vendor', sortable: true, sortValue: (p) => vendor(p.vendorCode).name,
    render: (p) => {
      const v = vendor(p.vendorCode);
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minWidth: 180 }}>
          <Avatar name={v.name} size={30} />
          <span>
            <span style={{ display: 'block', fontWeight: 500, color: colors.textPrimary }}>{v.name}</span>
            <span style={{ ...text.caption, whiteSpace: 'nowrap' }}>{v.code} · {v.city}</span>
          </span>
        </span>
      );
    },
  },
  {
    key: 'delivery', label: 'Lines · delivery', sortable: true, sortValue: poDeliveredPct,
    render: (p) => {
      const pct = poDeliveredPct(p);
      const overdue = poOverdueItems(p).length;
      return (
        <div style={{ width: 140 }}>
          <div style={{ ...text.caption, display: 'flex', justifyContent: 'space-between' }}>
            <span><strong style={{ color: colors.textPrimary }}>{p.items.length}</strong> line{p.items.length > 1 ? 's' : ''}</span>
            <span>{Math.round(pct)}% delivered</span>
          </div>
          <div style={{ height: 5, borderRadius: 999, background: colors.bgPage, overflow: 'hidden', margin: '5px 0 3px' }}>
            <span style={{ display: 'block', height: '100%', width: `${pct}%`, borderRadius: 999, background: pct >= 100 ? status.success.color : `linear-gradient(90deg, ${colors.navy}, ${colors.steel})` }} />
          </div>
          {overdue > 0 && (
            <span style={{ ...text.caption, color: status.error.color, display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
              <AlertTriangle size={12} /> {overdue} overdue
            </span>
          )}
        </div>
      );
    },
  },
  {
    key: 'value', label: 'PO value', align: 'right', sortable: true, sortValue: poTotal,
    render: (p) => (
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 600, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{formatINR(poTotal(p), 2)}</div>
        <div style={{ ...text.caption, whiteSpace: 'nowrap' }}>{formatCompactINR(poPendingValue(p))} pending</div>
      </div>
    ),
  },
  {
    key: 'plant', label: 'Plant · pur. group', sortable: true, sortValue: (p) => p.plant.code,
    render: (p) => (
      <div>
        <div style={{ whiteSpace: 'nowrap' }}>{p.plant.code} · {p.unitNo}</div>
        <div style={{ ...text.caption, whiteSpace: 'nowrap' }}>{p.purGroup.code} · {p.purGroup.name}</div>
      </div>
    ),
  },
  { key: 'status', label: 'Status', sortable: true, sortValue: (p) => p.status, render: (p) => <span title={p.status}><StatusBadge status={PO_STATUS_TONE[p.status]}>{STATUS_SHORT[p.status] ?? p.status}</StatusBadge></span> },
  { key: 'remarks', label: '', width: 50, render: (p) => <RemarksButton po={p} onClick={onRemarks} /> },
  { key: 'chev', label: '', width: 30, render: () => <ChevronRight size={18} color={colors.textDisabled} /> },
];
