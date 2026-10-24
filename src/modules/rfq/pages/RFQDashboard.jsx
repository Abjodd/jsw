import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlarmClock, Download, FilePlus2, Inbox, Radio, Search, Users } from 'lucide-react';
import { Button, Card, EmptyState, FilterBar, Input, KpiCard, PageHeader, Tabs, useToast } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors, text } from '@/theme/theme';
import { downloadCSV, formatDateTime, toISODate } from '@/utils/format';
import { BUYERS } from '@/modules/pr/data/mockData';
import EventRow, { EVENT_GRID } from '../components/dashboard/EventRow';
import { BID_STATUSES, RFQ_STATUSES } from '../data/constants';
import { VENDORS, vendorByCode } from '../data/mockData';
import { rfqStore } from '../data/rfqStore';

/**
 * RFQ › RFQ Dashboard
 * Route: /rfq
 * All RFQ events, grouped by event, with live countdowns and per-supplier bid status.
 */
const DEFAULTS = { startFrom: '2026-06-01', endTo: toISODate(Date.now() + 60 * 86400000) };

const FIELDS = [
  { key: 'eventId', label: 'Event ID', type: 'text', placeholder: 'e.g. 10039' },
  { key: 'startFrom', label: 'RFQ start date', type: 'date', required: true },
  { key: 'endTo', label: 'RFQ end date', type: 'date', required: true },
  { key: 'supplier', label: 'Supplier', type: 'select', options: VENDORS.map((v) => ({ value: v.code, label: v.name })) },
  { key: 'buyer', label: 'Buyer', type: 'select', options: BUYERS.map((b) => b.name) },
  { key: 'status', label: 'RFQ status', type: 'select', options: RFQ_STATUSES },
  { key: 'bidStatus', label: 'Bid status', type: 'select', options: BID_STATUSES },
];

const HEAD = ['', 'Event', 'Subject', 'Buyer', 'Bid window', 'Time left', 'Bids received', 'Status'];

export default function RFQDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useMediaQuery(bp.mobile);
  const isLaptop = useMediaQuery(bp.laptop);
  const compact = useMediaQuery('(max-width: 1360px)');
  const { events } = rfqStore.useStore();
  const [filters, setFilters] = useState(DEFAULTS);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      events.filter((e) => {
        const f = filters;
        if (f.eventId && !e.eventId.includes(f.eventId.trim())) return false;
        if (f.startFrom && toISODate(e.start) < f.startFrom) return false;
        if (f.endTo && toISODate(e.end) > f.endTo) return false;
        if (f.buyer && e.buyer !== f.buyer) return false;
        if (f.status && e.status !== f.status) return false;
        if (f.supplier && !e.vendors.some((v) => v.code === f.supplier)) return false;
        if (f.bidStatus && !e.vendors.some((v) => v.bidStatus === f.bidStatus)) return false;
        return true;
      }),
    [events, filters]
  );

  const counts = useMemo(() => Object.fromEntries(['Live', 'Paused', 'Closed', 'Cancelled'].map((s) => [s, filtered.filter((e) => e.status === s).length])), [filtered]);
  const rows = filtered
    .filter((e) => tab === 'all' || e.status === tab)
    .filter((e) => {
      const q = search.trim().toLowerCase();
      return !q || [e.eventId, e.subject, e.buyer, ...e.vendors.map((v) => vendorByCode(v.code).name)].some((x) => x.toLowerCase().includes(q));
    });

  const open = events.filter((e) => e.status === 'Live' || e.status === 'Paused');
  const closingSoon = events.filter((e) => e.status === 'Live' && new Date(e.end) - Date.now() < 24 * 3600e3).length;
  const invited = open.reduce((s, e) => s + e.vendors.length, 0);
  const received = open.reduce((s, e) => s + e.vendors.filter((v) => v.bidStatus === 'Submitted' || v.bidStatus === 'Revised').length, 0);
  const allV = events.flatMap((e) => e.vendors);
  const responseRate = allV.length ? Math.round((allV.filter((v) => v.bidStatus !== 'Not Submitted').length / allV.length) * 100) : 0;

  const exportRows = () => {
    const flat = rows.flatMap((e) => e.vendors.map((v) => ({ e, v, vd: vendorByCode(v.code) })));
    downloadCSV('rfq-events.csv', [
      { label: 'Event No', value: (r) => r.e.eventId }, { label: 'RFQ Id', value: (r) => r.e.rfqId }, { label: 'RFQ Description', value: (r) => r.e.subject },
      { label: 'Supplier Reference', value: (r) => r.vd.ref }, { label: 'Supplier Code', value: (r) => r.vd.code }, { label: 'Supplier Description', value: (r) => r.vd.name },
      { label: 'Quotation Id', value: (r) => r.v.quotationId }, { label: 'RFQ Start DateTime', value: (r) => formatDateTime(r.e.start) },
      { label: 'RFQ End DateTime', value: (r) => formatDateTime(r.e.end) }, { label: 'Buyer', value: (r) => r.e.buyer }, { label: 'RFQ Status', value: (r) => r.e.status },
      { label: 'Bid Status', value: (r) => r.v.bidStatus }, { label: 'Quoted Value', value: (r) => r.v.amount ?? '' },
    ], flat);
    toast({ title: 'Export ready', description: `${flat.length} supplier rows` });
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'RFQ' }, { label: 'RFQ Dashboard' }]}
        title="RFQ Dashboard"
        subtitle="Track every quotation event — live countdowns, supplier responses and L1 at a glance."
        actions={
          <>
            <Button variant="secondary" icon={<Download size={16} />} onClick={exportRows}>Download</Button>
            <Button icon={<FilePlus2 size={16} />} onClick={() => navigate('/rfq/create')}>Create RFQ</Button>
          </>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 1 : isLaptop ? 2 : 4}, 1fr)`, gap: 16, marginBottom: 20 }}>
        <KpiCard label="Live events" value={counts.Live ?? 0} icon={Radio} caption={`${counts.Paused ?? 0} paused`} />
        <KpiCard label="Closing in 24 h" value={closingSoon} icon={AlarmClock} caption="Chase pending suppliers" />
        <KpiCard label="Bids received (open)" value={`${received}/${invited}`} icon={Inbox} caption="Across live & paused events" />
        <KpiCard label="Supplier response rate" value={`${responseRate}%`} icon={Users} caption="All events in range" />
      </div>

      <FilterBar fields={FIELDS} values={filters} defaults={DEFAULTS} onApply={setFilters} />

      <Card flush>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '4px 20px 0', flexWrap: 'wrap' }}>
          <Tabs
            value={tab}
            onChange={setTab}
            items={[
              { key: 'all', label: 'All', count: filtered.length },
              { key: 'Live', label: 'Live', count: counts.Live },
              { key: 'Paused', label: 'Paused', count: counts.Paused },
              { key: 'Closed', label: 'Closed', count: counts.Closed },
              { key: 'Cancelled', label: 'Cancelled', count: counts.Cancelled },
            ]}
            style={{ borderBottom: 0 }}
          />
          <Input value={search} onChange={setSearch} size="sm" icon={<Search size={15} />} placeholder="Search event, subject, supplier…" style={{ width: isMobile ? '100%' : 300, paddingBottom: isMobile ? 12 : 0 }} />
        </div>

        {!compact && (
          <div style={{ display: 'grid', gridTemplateColumns: EVENT_GRID, gap: 12, padding: '10px 20px', background: colors.bgSubtle, borderTop: `1px solid ${colors.border}` }}>
            {HEAD.map((h) => (
              <span key={h} style={{ ...text.tableHead, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</span>
            ))}
          </div>
        )}

        {rows.map((e) => <EventRow key={e.eventId} e={e} compact={compact} />)}
        {rows.length === 0 && (
          <div style={{ padding: 24, borderTop: `1px solid ${colors.border}` }}>
            <EmptyState title="No RFQ events match" description="Adjust the date range or clear filters." />
          </div>
        )}
      </Card>
    </>
  );
}
