import { useState } from 'react';
import { ArrowRight, ChevronRight, Search } from 'lucide-react';
import { DataTable, Input, StatusBadge, Tag } from '@/components/ui';
import { colors, status, text } from '@/theme/theme';
import { formatDate, formatINR, formatNumber } from '@/utils/format';
import { isOverdue, lineTax, lineTotal, toBeDelivered } from '../../data/poMath';
import { itemStatus } from './itemStatus';

function Progress({ i }) {
  const del = (i.deliveredQty / i.qty) * 100;
  const transit = ((i.asnQty - i.deliveredQty) / i.qty) * 100;
  return (
    <div style={{ width: 150, marginTop: 6 }}>
      <div style={{ display: 'flex', height: 6, borderRadius: 999, overflow: 'hidden', background: colors.bgPage }}>
        <span style={{ width: `${del}%`, background: status.success.color }} />
        <span style={{ width: `${transit}%`, background: colors.steel }} />
      </div>
      <div style={{ ...text.caption, marginTop: 4, whiteSpace: 'nowrap' }}>
        <span style={{ color: status.success.color, fontWeight: 600 }}>{formatNumber(i.deliveredQty)}</span> recd ·{' '}
        <span style={{ color: colors.steel, fontWeight: 600 }}>{formatNumber(i.asnQty - i.deliveredQty)}</span> in ASN ·{' '}
        {formatNumber(toBeDelivered(i))} open
      </div>
    </div>
  );
}

/** Items tab — condensed SAP item grid; click a row for every field. */
export default function ItemsTab({ po, onOpenItem }) {
  const [q, setQ] = useState('');
  const [dueBy, setDueBy] = useState('');
  const rows = po.items
    .filter((i) => !q || `${i.materialCode} ${i.description}`.toLowerCase().includes(q.trim().toLowerCase()))
    .filter((i) => !dueBy || i.deliveryDate <= dueBy);

  const columns = [
    { key: 'itemNo', label: 'Item', sortable: true, sortValue: (i) => Number(i.itemNo), render: (i) => <strong>{i.itemNo}</strong> },
    {
      key: 'material', label: 'Material', sortable: true, sortValue: (i) => i.materialCode,
      render: (i) => (
        <div style={{ minWidth: 190 }}>
          <div style={{ fontWeight: 500, color: colors.textPrimary }}>{i.description}</div>
          <div style={{ ...text.caption, display: 'flex', gap: 6, alignItems: 'center', whiteSpace: 'nowrap' }}>
            {i.materialCode} · {i.materialGroup.code} {i.materialGroup.name} {i.revisionNo && <Tag size="sm" tone="steel">Rev {i.revisionNo}</Tag>}
          </div>
        </div>
      ),
    },
    { key: 'status', label: 'Status', render: (i) => { const s = itemStatus(po, i); return <StatusBadge status={s.tone}>{s.label}</StatusBadge>; } },
    {
      key: 'qty', label: 'PO qty · progress', sortable: true, sortValue: (i) => i.qty,
      render: (i) => (
        <div>
          <span style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{formatNumber(i.qty)} <span style={{ fontWeight: 400, fontSize: 12, color: colors.textSecondary }}>{i.uom}</span></span>
          <Progress i={i} />
        </div>
      ),
    },
    {
      key: 'price', label: 'Net price · GST', align: 'right',
      render: (i) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          <div>{formatINR(i.netPrice, 2)}</div>
          <div style={text.caption}>{i.gstRate}% · {formatINR(lineTax(i), 2)}</div>
        </div>
      ),
    },
    { key: 'total', label: 'Total value', align: 'right', sortable: true, sortValue: lineTotal, render: (i) => <strong style={{ whiteSpace: 'nowrap' }}>{formatINR(lineTotal(i), 2)}</strong> },
    {
      key: 'delivery', label: 'Expected delivery', sortable: true, sortValue: (i) => i.deliveryDate,
      render: (i) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          <div style={{ color: isOverdue(i) ? status.error.color : colors.textPrimary, fontWeight: isOverdue(i) ? 600 : 400 }}>{formatDate(i.deliveryDate)}</div>
          {i.deliveryChange?.status === 'Pending' && (
            <Tag size="sm" tone="warning" icon={<ArrowRight size={11} />}>{formatDate(i.deliveryChange.requestedDate)} requested</Tag>
          )}
          {i.deliveryChange && i.deliveryChange.status !== 'Pending' && <span style={text.caption}>Change {i.deliveryChange.status.toLowerCase()}</span>}
        </div>
      ),
    },
    { key: 'chev', label: '', width: 30, render: () => <ChevronRight size={18} color={colors.textDisabled} /> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, padding: '14px 20px', flexWrap: 'wrap', alignItems: 'center', borderBottom: `1px solid ${colors.border}` }}>
        <Input value={q} onChange={setQ} size="sm" icon={<Search size={15} />} placeholder="Search material code or description" style={{ width: 300 }} />
        <span style={{ ...text.caption, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          Due by <Input type="date" value={dueBy} onChange={setDueBy} size="sm" style={{ width: 170 }} />
        </span>
        <span style={{ ...text.caption, marginLeft: 'auto' }}>{rows.length} of {po.items.length} items</span>
      </div>
      <DataTable columns={columns} rows={rows} rowKey="itemNo" onRowClick={onOpenItem} minWidth={980} />
    </div>
  );
}
