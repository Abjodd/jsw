import { useMemo, useState } from 'react';
import { PackagePlus } from 'lucide-react';
import { Button, DataTable, Modal } from '@/components/ui';
import { colors, text } from '@/theme/theme';
import { formatDate, formatINR } from '@/utils/format';
import { prStore } from '@/modules/pr/data/prStore';
import PriorityPill from '@/modules/pr/components/PriorityPill';

/** Pick RFQ-pending PR lines (no open issue) to add to the RFQ. */
export default function PRLinePickerModal({ open, onClose, excludeIds, onAdd }) {
  const { lines } = prStore.useStore();
  const [sel, setSel] = useState([]);
  const available = useMemo(() => lines.filter((l) => l.rfqStatus === 'RFQ Pending' && !l.sendBack && l.activeBuyer && !excludeIds.includes(l.id)), [lines, excludeIds]);

  const columns = [
    { key: 'priority', label: 'Priority', render: (l) => <PriorityPill priority={l.priority} /> },
    { key: 'pr', label: 'PR / Line', render: (l) => <div><div style={{ fontWeight: 600, color: colors.navy, whiteSpace: 'nowrap' }}>{l.prNumber} / {l.lineItem}</div><div style={text.caption}>{formatDate(l.prDate)}</div></div> },
    { key: 'material', label: 'Material', render: (l) => <div><div style={{ fontWeight: 500 }}>{l.materialDesc}</div><div style={text.caption}>{l.qty} {l.uom} · {l.plantCode} {l.city}</div></div> },
    { key: 'buyer', label: 'Buyer', render: (l) => <span style={{ whiteSpace: 'nowrap' }}>{l.activeBuyer}</span> },
    { key: 'value', label: 'Value', align: 'right', render: (l) => <strong style={{ whiteSpace: 'nowrap' }}>{formatINR(l.totalValue)}</strong> },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      width={860}
      icon={<PackagePlus size={20} />}
      title="Add PR lines"
      subtitle="Released, assigned lines that are still RFQ pending."
      bodyStyle={{ padding: 0 }}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button disabled={!sel.length} onClick={() => { onAdd(lines.filter((l) => sel.includes(l.id))); setSel([]); }}>Add {sel.length || ''} line{sel.length === 1 ? '' : 's'}</Button>
        </>
      }
    >
      <DataTable columns={columns} rows={available} selectable selected={sel} onSelectionChange={setSel} onRowClick={(l) => setSel((s) => (s.includes(l.id) ? s.filter((x) => x !== l.id) : [...s, l.id]))} />
    </Modal>
  );
}
