import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, IndianRupee, Search, Truck, Warehouse } from 'lucide-react';
import { Avatar, Card, DataTable, Input, KpiCard, PageHeader, StatusBadge, Tabs } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors, text } from '@/theme/theme';
import { formatCompactINR, formatDate, formatDateTime, formatINR, formatNumber } from '@/utils/format';
import { ASN_STATUS_TONE } from '../data/constants';
import { vendor } from '../data/mockData';
import { poStore } from '../data/poStore';

/**
 * PO › ASN Register
 * Route: /po/asns
 * Every advance shipping notice across purchase orders.
 */
export default function ASNRegister() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery(bp.mobile);
  const isLaptop = useMediaQuery(bp.laptop);
  const { pos } = poStore.useStore();
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const all = useMemo(() => pos.flatMap((p) => p.asns.map((a) => ({ ...a, po: p, id: a.asnNo }))).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [pos]);
  const rows = all
    .filter((a) => tab === 'all' || a.status === tab)
    .filter((a) => !q || [a.asnNo, a.invoiceNo, a.po.poNumber, vendor(a.po.vendorCode).name].some((x) => x.toLowerCase().includes(q.trim().toLowerCase())));
  const n = (s) => all.filter((a) => a.status === s).length;

  const columns = [
    { key: 'asnNo', label: 'ASN no.', sortable: true, render: (a) => <strong style={{ color: colors.navy }}>{a.asnNo}</strong> },
    { key: 'po', label: 'PO', sortable: true, sortValue: (a) => a.po.poNumber, render: (a) => <span style={{ color: colors.steel, fontWeight: 500 }}>{a.po.poNumber}</span> },
    {
      key: 'vendor', label: 'Vendor', render: (a) => {
        const v = vendor(a.po.vendorCode);
        return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Avatar name={v.name} size={26} /><span style={{ whiteSpace: 'nowrap' }}>{v.name}</span></span>;
      },
    },
    { key: 'invoice', label: 'Invoice', render: (a) => <div><div style={{ whiteSpace: 'nowrap' }}>{a.invoiceNo}</div><div style={text.caption}>{formatDate(a.invoiceDate)}</div></div> },
    { key: 'lines', label: 'Items', render: (a) => <span style={{ ...text.caption, color: colors.textPrimary }}>{a.lines.map((l) => `${l.itemNo} × ${formatNumber(l.qty)}`).join(', ')}</span> },
    { key: 'value', label: 'Value', align: 'right', sortable: true, render: (a) => <strong style={{ whiteSpace: 'nowrap' }}>{formatINR(a.value, 2)}</strong> },
    { key: 'status', label: 'Status', render: (a) => <StatusBadge status={ASN_STATUS_TONE[a.status]}>{a.status}</StatusBadge> },
    { key: 'createdAt', label: 'Created', sortable: true, render: (a) => <span style={{ ...text.caption, whiteSpace: 'nowrap' }}>{formatDateTime(a.createdAt)}</span> },
  ];

  return (
    <>
      <PageHeader crumbs={[{ label: 'Applications', to: '/' }, { label: 'PO', to: '/po' }, { label: 'ASN Register' }]} title="ASN Register" subtitle="Advance shipping notices raised against purchase orders." />
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 1 : isLaptop ? 2 : 4}, 1fr)`, gap: 16, marginBottom: 20 }}>
        <KpiCard label="Total ASNs" value={all.length} icon={Warehouse} caption={`${new Set(all.map((a) => a.po.poNumber)).size} purchase orders`} />
        <KpiCard label="In transit" value={n('In Transit')} icon={Truck} caption="Expected at gate" />
        <KpiCard label="Received" value={n('Received')} icon={CheckCircle2} caption="GRN posted" />
        <KpiCard label="Shipped value" value={formatCompactINR(all.reduce((s, a) => s + a.value, 0))} icon={IndianRupee} caption="Incl. GST" />
      </div>
      <Card flush>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '4px 20px 0', flexWrap: 'wrap', borderBottom: `1px solid ${colors.border}` }}>
          <Tabs value={tab} onChange={setTab} style={{ borderBottom: 0 }} items={[{ key: 'all', label: 'All', count: all.length }, { key: 'In Transit', label: 'In transit', count: n('In Transit') }, { key: 'Received', label: 'Received', count: n('Received') }]} />
          <Input value={q} onChange={setQ} size="sm" icon={<Search size={15} />} placeholder="Search ASN, invoice, PO, vendor…" style={{ width: isMobile ? '100%' : 280, paddingBottom: isMobile ? 12 : 0 }} />
        </div>
        <DataTable columns={columns} rows={rows} onRowClick={(a) => navigate(`/po/${a.po.poNumber}`)} minWidth={960} pageSize={10} />
      </Card>
    </>
  );
}
