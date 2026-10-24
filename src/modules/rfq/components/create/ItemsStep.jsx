import { PackagePlus, Trash2 } from 'lucide-react';
import { Button, DataTable, EmptyState, IconButton, Input, Tag } from '@/components/ui';
import { colors, text } from '@/theme/theme';
import { formatDate, formatINR } from '@/utils/format';

/** Step 1 — RFQ line items taken from PR lines. Qty and ceiling price are editable. */
export default function ItemsStep({ items, setItems, onAddLines, showErrors }) {
  const set = (id, key, value) => setItems((xs) => xs.map((i) => (i.id === id ? { ...i, [key]: value === '' ? '' : Number(value) } : i)));
  const remove = (id) => setItems((xs) => xs.filter((i) => i.id !== id).map((i, n) => ({ ...i, lineItem: String((n + 1) * 10).padStart(5, '0') })));
  const total = items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.ceilingPrice) || 0), 0);

  const columns = [
    { key: 'lineItem', label: 'Line', render: (i) => <span style={{ fontWeight: 600 }}>{i.lineItem}</span> },
    {
      key: 'material', label: 'Material / service',
      render: (i) => (
        <div style={{ minWidth: 170 }}>
          <div style={{ fontWeight: 500 }}>{i.description}</div>
          <div style={{ ...text.caption, display: 'flex', gap: 6, alignItems: 'center' }}>{i.materialCode} <Tag size="sm" tone={i.type === 'Service' ? 'steel' : 'neutral'}>{i.type}</Tag></div>
        </div>
      ),
    },
    {
      key: 'pr', label: 'PR reference',
      render: (i) => (
        <div>
          <div style={{ whiteSpace: 'nowrap', color: colors.navy, fontWeight: 500 }}>{i.prNumber} / {i.prLineItem}</div>
          <div style={{ ...text.caption, whiteSpace: 'nowrap' }}>{formatDate(i.prDate)} · Plant {i.plantCode}, {i.plantAddress}</div>
        </div>
      ),
    },
    {
      key: 'qty', label: 'RFQ qty',
      render: (i) => (
        <Input type="number" min="0" size="sm" value={i.qty} onChange={(v) => set(i.id, 'qty', v)} suffix={i.uom} error={showErrors && !(i.qty > 0)} style={{ width: 108 }} />
      ),
    },
    {
      key: 'ceiling', label: 'Ceiling / unit',
      render: (i) => <Input type="number" min="0" size="sm" value={i.ceilingPrice} onChange={(v) => set(i.id, 'ceilingPrice', v)} icon={<span style={{ fontSize: 13 }}>₹</span>} style={{ width: 120 }} />,
    },
    { key: 'value', label: 'Line value', align: 'right', render: (i) => <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{formatINR((Number(i.qty) || 0) * (Number(i.ceilingPrice) || 0))}</span> },
    { key: 'x', label: '', render: (i) => <IconButton label="Remove line" tone="danger" onClick={() => remove(i.id)}><Trash2 size={16} /></IconButton> },
  ];

  if (!items.length) {
    return (
      <div style={{ padding: 24 }}>
        <EmptyState
          icon={PackagePlus}
          title="No line items yet"
          description="Pull RFQ-pending lines from your PR queue. Lines from different PRs can go into one RFQ."
        />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <Button icon={<PackagePlus size={16} />} onClick={onAddLines}>Add PR lines</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DataTable columns={columns} rows={items} minWidth={820} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 20px', borderTop: `1px solid ${colors.border}`, flexWrap: 'wrap' }}>
        <Button variant="secondary" size="sm" icon={<PackagePlus size={15} />} onClick={onAddLines}>Add more PR lines</Button>
        <span style={{ ...text.body, color: colors.textSecondary }}>
          Estimated value (ceiling) <strong style={{ ...text.cardTitle, marginLeft: 8 }}>{formatINR(total)}</strong>
        </span>
      </div>
    </div>
  );
}
