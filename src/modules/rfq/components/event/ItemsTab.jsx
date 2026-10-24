import { DataTable, Tag } from '@/components/ui';
import { colors, text } from '@/theme/theme';
import { formatDate, formatINR, formatNumber } from '@/utils/format';

export const itemColumns = [
  { key: 'lineItem', label: 'RFQ line', render: (i) => <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{i.lineItem}</span> },
  {
    key: 'material', label: 'Material / service',
    render: (i) => (
      <div style={{ minWidth: 200 }}>
        <div style={{ fontWeight: 500 }}>{i.description}</div>
        <div style={{ ...text.caption, display: 'flex', gap: 6, alignItems: 'center' }}>{i.materialCode} <Tag size="sm" tone={i.type === 'Service' ? 'steel' : 'neutral'}>{i.type}</Tag></div>
      </div>
    ),
  },
  { key: 'qty', label: 'RFQ qty', align: 'right', render: (i) => <span style={{ whiteSpace: 'nowrap' }}>{formatNumber(i.qty, 3)} <span style={{ color: colors.textSecondary, fontSize: 12 }}>{i.uom}</span></span> },
  {
    key: 'pr', label: 'PR reference',
    render: (i) => (
      <div>
        <div style={{ whiteSpace: 'nowrap', color: colors.navy, fontWeight: 500 }}>{i.prNumber} / {i.prLineItem}</div>
        <div style={text.caption}>{formatDate(i.prDate)}</div>
      </div>
    ),
  },
  { key: 'purGroup', label: 'Purchasing group', render: (i) => <span style={{ whiteSpace: 'nowrap' }}>{i.purGroup}</span> },
  { key: 'plant', label: 'Plant', render: (i) => <div><div>{i.plantCode}</div><div style={text.caption}>{i.plantAddress}</div></div> },
  { key: 'ceiling', label: 'Ceiling / unit', align: 'right', render: (i) => <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{formatINR(i.ceilingPrice)}</span> },
];

export default function ItemsTab({ event }) {
  return <DataTable columns={itemColumns} rows={event.items} />;
}
