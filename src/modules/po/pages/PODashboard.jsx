import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlarmClockOff, CalendarClock, CheckCheck, Download, FileClock, Layers, PackagePlus, Search, Sparkles, Truck } from 'lucide-react';
import { BulkActionBar, Button, Card, DataTable, EmptyState, FilterBar, Input, PageHeader, QuickStats, useToast } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp } from '@/theme/theme';
import { downloadCSV, formatCompactINR, formatDate } from '@/utils/format';
import { poColumns } from '../components/poColumns';
import RemarksModal from '../components/RemarksModal';
import { PLANTS, PO_STATUSES, PO_TYPES, PURCHASE_GROUPS } from '../data/constants';
import { PO_VENDORS, vendor } from '../data/mockData';
import { pendingChanges, poDeliveredPct, poOverdueItems, poPendingValue, poTotal } from '../data/poMath';
import { acknowledgePO, poStore } from '../data/poStore';

/**
 * PO › Purchase Orders
 * Route: /po
 * All purchase orders with delivery progress, acknowledgement, date-change requests and remarks.
 */
const FIELDS = [
  { key: 'poNumber', label: 'PO number', type: 'text', placeholder: 'e.g. 1452100312' },
  { key: 'vendor', label: 'Vendor', type: 'select', options: PO_VENDORS.map((v) => ({ value: v.code, label: v.name })) },
  { key: 'status', label: 'Status', type: 'select', options: PO_STATUSES },
  { key: 'plant', label: 'Plant', type: 'select', options: PLANTS.map((p) => ({ value: p.code, label: `${p.code} · ${p.name}` })) },
  { key: 'fromDate', label: 'Created from', type: 'date' },
  { key: 'toDate', label: 'Created to', type: 'date' },
  { key: 'purchaseGroup', label: 'Purchase group', type: 'select', options: PURCHASE_GROUPS.map((g) => ({ value: g.code, label: `${g.code} · ${g.name}` })) },
  { key: 'poType', label: 'Type of PO', type: 'select', options: PO_TYPES },
  { key: 'material', label: 'Material number', type: 'text', placeholder: 'e.g. BR001985' },
  { key: 'materialGroup', label: 'Material group', type: 'text', placeholder: 'e.g. R101' },
  { key: 'costCenter', label: 'Cost center', type: 'text' },
  { key: 'assetCode', label: 'Asset code', type: 'text' },
  { key: 'createdBy', label: 'Created by', type: 'select', options: ['Karthikeyan P', 'Manish', 'Dharmik', 'Yash'] },
];

const QUICK = {
  all: () => true,
  new: (p) => p.status === 'New',
  ack: (p) => p.status === 'Pending Acknowledgement',
  changes: (p) => pendingChanges(p).length > 0,
  overdue: (p) => poOverdueItems(p).length > 0,
};

export default function PODashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useMediaQuery(bp.mobile);
  const { pos } = poStore.useStore();
  const [filters, setFilters] = useState({});
  const [quick, setQuick] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [remarksFor, setRemarksFor] = useState(null);

  const filtered = useMemo(
    () =>
      pos.filter((p) => {
        const f = filters;
        if (f.poNumber && !p.poNumber.includes(f.poNumber.trim())) return false;
        if (f.vendor && p.vendorCode !== f.vendor) return false;
        if (f.status && p.status !== f.status) return false;
        if (f.plant && p.plant.code !== f.plant) return false;
        if (f.fromDate && p.createdOn < f.fromDate) return false;
        if (f.toDate && p.createdOn > f.toDate) return false;
        if (f.purchaseGroup && p.purGroup.code !== f.purchaseGroup) return false;
        if (f.poType && p.poType !== f.poType) return false;
        if (f.material && !p.items.some((i) => i.materialCode.toLowerCase().includes(f.material.trim().toLowerCase()))) return false;
        if (f.materialGroup && !p.items.some((i) => i.materialGroup.code.toLowerCase().includes(f.materialGroup.trim().toLowerCase()))) return false;
        if (f.costCenter && !p.costCenter.includes(f.costCenter)) return false;
        if (f.assetCode && !p.assetCode.includes(f.assetCode)) return false;
        if (f.createdBy && p.createdBy !== f.createdBy) return false;
        return true;
      }),
    [pos, filters]
  );
  const count = (k) => filtered.filter(QUICK[k]).length;
  const rows = filtered.filter(QUICK[quick]).filter((p) => {
    const q = search.trim().toLowerCase();
    return !q || [p.poNumber, vendor(p.vendorCode).name, p.createdBy, ...p.items.map((i) => `${i.materialCode} ${i.description}`)].some((x) => x.toLowerCase().includes(q));
  });

  // live view of remarks for the open modal
  const remarksPo = remarksFor && pos.find((p) => p.poNumber === remarksFor);
  const selectedPos = pos.filter((p) => selected.includes(p.poNumber));
  const pendingAck = selectedPos.filter((p) => p.status === 'Pending Acknowledgement' || p.status === 'New');

  const stats = [
    { key: 'all', label: 'All purchase orders', value: count('all'), caption: `${formatCompactINR(filtered.reduce((s, p) => s + poTotal(p), 0))} total value`, icon: Layers, tone: 'navy' },
    { key: 'new', label: 'New', value: count('new'), caption: 'Released, not yet acknowledged', icon: Sparkles, tone: 'progress' },
    { key: 'ack', label: 'Pending acknowledgement', value: count('ack'), caption: 'Awaiting supplier', icon: FileClock, tone: 'warning' },
    { key: 'changes', label: 'Delivery date requests', value: count('changes'), caption: 'Need your decision', icon: CalendarClock, tone: 'warning' },
    { key: 'overdue', label: 'Overdue deliveries', value: count('overdue'), caption: 'Past expected date', icon: AlarmClockOff, tone: 'error' },
  ];

  const createAsn = (list = selectedPos) => {
    if (list.length !== 1) {
      toast({ title: 'Select exactly one PO', description: 'An ASN is created against a single purchase order.', tone: 'warning' });
      return;
    }
    navigate(`/po/${list[0].poNumber}/asn`);
  };

  const exportRows = (list) => {
    downloadCSV('purchase-orders.csv', [
      ['PO Number', (p) => p.poNumber], ['Vendor', (p) => `${p.vendorCode} ${vendor(p.vendorCode).name}`], ['PO Creation Date', (p) => formatDate(p.createdOn)],
      ['Total Line Items', (p) => p.items.length], ['Status', (p) => p.status], ['Type of PO', (p) => `${p.docType} ${p.poType}`],
      ['Purchasing Group', (p) => `${p.purGroup.code} ${p.purGroup.name}`], ['Plant', (p) => `${p.plant.code} ${p.plant.name}`], ['Unit No', (p) => p.unitNo],
      ['Created By', (p) => p.createdBy], ['PO Value', (p) => poTotal(p).toFixed(2)], ['Pending Value', (p) => poPendingValue(p).toFixed(2)],
      ['Delivered %', (p) => poDeliveredPct(p).toFixed(0)], ['Comments', (p) => p.remarks.map((r) => r.text).join(' | ')],
    ].map(([label, value]) => ({ label, value })), list);
    toast({ title: 'Export ready', description: `${list.length} purchase orders` });
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'PO' }, { label: 'Purchase Orders' }]}
        title="Purchase Orders"
        subtitle="Track acknowledgement, deliveries and ASNs for every released purchase order."
        actions={
          <>
            <Button variant="secondary" icon={<Download size={16} />} onClick={() => exportRows(rows)}>Export</Button>
            <Button icon={<PackagePlus size={16} />} onClick={() => createAsn()} title="Select one PO first">Create ASN</Button>
          </>
        }
      />

      <QuickStats items={stats} active={quick} onChange={setQuick} />

      <FilterBar fields={FIELDS} values={filters} defaults={{}} onApply={(v) => { setFilters(v); setSelected([]); }} />

      <Card
        flush
        title="Purchase orders"
        subtitle={`${rows.length} PO${rows.length !== 1 ? 's' : ''} · click a row for items, drawings and ASNs`}
        actions={<Input value={search} onChange={setSearch} size="sm" icon={<Search size={15} />} placeholder={isMobile ? 'Search' : 'Search PO, vendor, material…'} style={{ width: isMobile ? 140 : 280 }} />}
      >
        <DataTable
          columns={poColumns({ onRemarks: (p) => setRemarksFor(p.poNumber) })}
          rows={rows}
          rowKey="poNumber"
          selectable
          selected={selected}
          onSelectionChange={setSelected}
          onRowClick={(p) => navigate(`/po/${p.poNumber}`)}
          pageSize={10}
          minWidth={1000}
          empty={<EmptyState title="No purchase orders match" description="Clear a quick filter or adjust the filters above." />}
        />
      </Card>
      <div style={{ height: 96 }} />

      <BulkActionBar
        count={selected.length}
        noun="PO"
        onClear={() => setSelected([])}
        actions={[
          { label: 'Create ASN', icon: Truck, variant: 'primary', onClick: () => createAsn(), disabled: selected.length !== 1, title: selected.length !== 1 ? 'Select exactly one PO' : undefined },
          {
            label: 'Acknowledge', icon: CheckCheck, disabled: !pendingAck.length,
            onClick: () => {
              pendingAck.forEach((p) => acknowledgePO(p.poNumber, user?.name));
              toast({ title: `${pendingAck.length} PO${pendingAck.length > 1 ? 's' : ''} acknowledged` });
              setSelected([]);
            },
          },
          { label: 'Export', icon: Download, onClick: () => exportRows(selectedPos) },
        ]}
      />

      {remarksPo && <RemarksModal po={remarksPo} onClose={() => setRemarksFor(null)} />}
    </>
  );
}
