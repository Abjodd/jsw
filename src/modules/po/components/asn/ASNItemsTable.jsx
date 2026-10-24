import { useState } from 'react';
import { Search, Wand2 } from 'lucide-react';
import { Button, DataTable, Input } from '@/components/ui';
import { colors, status, text } from '@/theme/theme';
import { formatDate, formatINR, formatNumber } from '@/utils/format';
import { availableForAsn } from '../../data/poMath';

/** Items to ship: enter ASN qty per PO line (≤ available). */
export default function ASNItemsTable({ po, qty, setQty, showErrors }) {
  const [q, setQ] = useState('');
  const [dueBy, setDueBy] = useState('');
  const [group, setGroup] = useState('');
  const rows = po.items
    .filter((i) => !q || `${i.materialCode} ${i.description}`.toLowerCase().includes(q.trim().toLowerCase()))
    .filter((i) => !dueBy || i.deliveryDate <= dueBy)
    .filter((i) => !group || i.materialGroup.code.toLowerCase().includes(group.trim().toLowerCase()));

  const set = (itemNo, v) => setQty((x) => ({ ...x, [itemNo]: v === '' ? '' : Math.max(0, Number(v)) }));
  const fillAll = () => setQty(Object.fromEntries(rows.filter((i) => availableForAsn(i) > 0).map((i) => [i.itemNo, availableForAsn(i)])));

  const columns = [
    { key: 'itemNo', label: 'Item', render: (i) => <strong>{i.itemNo}</strong> },
    {
      key: 'material', label: 'Material',
      render: (i) => (
        <div style={{ minWidth: 180 }}>
          <div style={{ fontWeight: 500 }}>{i.description}</div>
          <div style={{ ...text.caption, whiteSpace: 'nowrap' }}>{i.materialCode} · {i.materialGroup.code} · SLoc {i.storageLocation}</div>
          <div style={{ ...text.caption, whiteSpace: 'nowrap' }}>Due {formatDate(i.deliveryDate)}</div>
        </div>
      ),
    },
    {
      key: 'qty', label: 'PO · in ASN', align: 'right',
      render: (i) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          <div>{formatNumber(i.qty)} {i.uom}</div>
          <div style={text.caption}>{formatNumber(i.asnQty)} already in ASN</div>
        </div>
      ),
    },
    {
      key: 'avl', label: 'Available', align: 'right',
      render: (i) => <strong style={{ whiteSpace: 'nowrap', color: availableForAsn(i) ? colors.textPrimary : colors.textDisabled }}>{formatNumber(availableForAsn(i))} {i.uom}</strong>,
    },
    {
      key: 'asnQty', label: 'ASN quantity',
      render: (i) => {
        const v = qty[i.itemNo];
        const over = Number(v) > availableForAsn(i);
        return (
          <div>
            <Input type="number" min="0" size="sm" value={v ?? ''} onChange={(x) => set(i.itemNo, x)} suffix={i.uom} placeholder="0" disabled={!availableForAsn(i)} error={over} style={{ width: 120 }} />
            {over && <div style={{ ...text.caption, color: status.error.color }}>Max {formatNumber(availableForAsn(i))}</div>}
          </div>
        );
      },
    },
    {
      key: 'value', label: 'Taxable value', align: 'right',
      render: (i) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          <strong>{formatINR((Number(qty[i.itemNo]) || 0) * i.netPrice, 2)}</strong>
          <div style={text.caption}>@ {formatINR(i.netPrice, 2)}</div>
        </div>
      ),
    },
  ];

  const anyQty = Object.values(qty).some((v) => Number(v) > 0);

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, padding: '14px 20px', flexWrap: 'wrap', alignItems: 'center', borderBottom: `1px solid ${colors.border}` }}>
        <Input value={q} onChange={setQ} size="sm" icon={<Search size={15} />} placeholder="Enter material" style={{ width: 220 }} />
        <Input value={group} onChange={setGroup} size="sm" placeholder="Material group" style={{ width: 150 }} />
        <span style={{ ...text.caption, display: 'inline-flex', alignItems: 'center', gap: 8 }}>Due by <Input type="date" value={dueBy} onChange={setDueBy} size="sm" style={{ width: 160 }} /></span>
        <div style={{ flex: 1 }} />
        <Button variant="ghost" size="sm" onClick={() => setQty({})} disabled={!anyQty}>Clear</Button>
        <Button variant="secondary" size="sm" icon={<Wand2 size={14} />} onClick={fillAll}>Fill all available</Button>
      </div>
      {showErrors && !anyQty && <div style={{ ...text.body, color: status.error.color, padding: '10px 20px', background: status.error.bg }}>Enter a quantity for at least one item.</div>}
      <DataTable columns={columns} rows={rows} rowKey="itemNo" minWidth={720} />
    </div>
  );
}
