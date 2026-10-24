import { Truck } from 'lucide-react';
import { Button, DataTable, EmptyState, StatusBadge } from '@/components/ui';
import { colors, text } from '@/theme/theme';
import { formatDate, formatDateTime, formatINR, formatNumber } from '@/utils/format';
import { ASN_STATUS_TONE } from '../../data/constants';

export default function ASNsTab({ po, onCreate }) {
  if (!po.asns.length) {
    return (
      <div style={{ padding: 24 }}>
        <EmptyState icon={Truck} title="No ASNs yet" description="Create an advance shipping notice when goods are dispatched against this PO." />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}><Button icon={<Truck size={16} />} onClick={onCreate}>Create ASN</Button></div>
      </div>
    );
  }
  const columns = [
    { key: 'asnNo', label: 'ASN no.', render: (a) => <strong style={{ color: colors.navy }}>{a.asnNo}</strong> },
    { key: 'invoice', label: 'Invoice', render: (a) => <div><div>{a.invoiceNo}</div><div style={text.caption}>{formatDate(a.invoiceDate)}</div></div> },
    { key: 'lines', label: 'Items shipped', render: (a) => <span style={text.body}>{a.lines.map((l) => `Item ${l.itemNo} × ${formatNumber(l.qty)}`).join(', ')}</span> },
    { key: 'value', label: 'Invoice value', align: 'right', render: (a) => <strong style={{ whiteSpace: 'nowrap' }}>{formatINR(a.value, 2)}</strong> },
    { key: 'status', label: 'Status', render: (a) => <StatusBadge status={ASN_STATUS_TONE[a.status]}>{a.status}</StatusBadge> },
    { key: 'createdAt', label: 'Created', render: (a) => <span style={{ ...text.caption, whiteSpace: 'nowrap' }}>{formatDateTime(a.createdAt)}</span> },
  ];
  return <DataTable columns={columns} rows={[...po.asns].reverse()} rowKey="asnNo" minWidth={820} />;
}
