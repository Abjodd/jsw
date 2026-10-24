import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertOctagon, CornerUpLeft, Download, FileSignature, FileStack, Hourglass, Inbox, Repeat, Search, Sparkles } from 'lucide-react';
import { Avatar, BulkActionBar, Button, Card, FilterBar, Input, PageHeader, Select, useToast } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors, text } from '@/theme/theme';
import { daysSince, downloadCSV, formatCompactINR } from '@/utils/format';
import PRActionModals from '../components/PRActionModals';
import PRDetailDrawer from '../components/PRDetailDrawer';
import PRTable from '../components/PRTable';
import { QuickStats } from '@/components/ui';
import { PURCHASE_GROUPS, RFQ_STATUSES } from '../data/constants';
import { PR_EXPORT_COLUMNS } from '../data/exportColumns';
import { BUYERS } from '../data/mockData';
import { prStore } from '../data/prStore';
import usePRFilters from '../hooks/usePRFilters';

/**
 * PR › Buyer Dashboard
 * Route: /pr/buyer
 * A buyer's queue of assigned PR lines → Create RFQ / Repeat order / Direct NFA / Send back.
 */
const DEFAULTS = { fromDate: '2026-09-01', toDate: '2026-10-31' };

const FIELDS = [
  { key: 'prNumber', label: 'PR number', type: 'text', placeholder: 'e.g. 2000016173' },
  { key: 'fromDate', label: 'Release from date', type: 'date', required: true },
  { key: 'toDate', label: 'Release to date', type: 'date', required: true },
  { key: 'rfqStatus', label: 'PR → RFQ status', type: 'select', options: RFQ_STATUSES },
  { key: 'priority', label: 'Priority', type: 'select', options: ['P0', 'P1', 'P2'] },
  { key: 'purchaseGroup', label: 'Purchase group', type: 'select', options: PURCHASE_GROUPS },
];

const ready = (l) => l.rfqStatus === 'RFQ Pending' && !l.sendBack;
const QUICK = [
  { key: 'all', predicate: () => true },
  { key: 'ready', predicate: ready },
  { key: 'critical', predicate: (l) => l.priority === 'P0' && l.rfqStatus === 'RFQ Pending' },
  { key: 'ageing', predicate: (l) => l.rfqStatus === 'RFQ Pending' && l.firstRelease && daysSince(l.firstRelease) > 14 },
  { key: 'issue', predicate: (l) => !!l.sendBack },
];

export default function PRBuyerDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useMediaQuery(bp.mobile);
  const { lines } = prStore.useStore();
  const [buyer, setBuyer] = useState('Deepak Kumar Jha');
  const mine = useMemo(() => lines.filter((l) => l.activeBuyer === buyer), [lines, buyer]);

  const { filters, setFilters, quick, setQuick, search, setSearch, filtered, rows, counts } = usePRFilters(mine, {
    defaults: DEFAULTS, quickFilters: QUICK, dateField: 'firstRelease', initialQuick: 'ready',
  });

  const [selected, setSelected] = useState([]);
  const [detailId, setDetailId] = useState(null);
  const [modal, setModal] = useState(null);

  const detail = lines.find((l) => l.id === detailId);
  const selectedLines = lines.filter((l) => selected.includes(l.id));
  const readyValue = filtered.filter(ready).reduce((s, l) => s + l.totalValue, 0);

  const stats = [
    { key: 'all', label: 'My queue', value: counts.all, caption: `${formatCompactINR(filtered.reduce((s, l) => s + l.totalValue, 0))} assigned`, icon: Inbox, tone: 'navy' },
    { key: 'ready', label: 'Ready for RFQ', value: counts.ready, caption: `${formatCompactINR(readyValue)} to source`, icon: Sparkles, tone: 'progress' },
    { key: 'critical', label: 'Critical (P0)', value: counts.critical, caption: 'Pending & urgent', icon: AlertOctagon, tone: 'error' },
    { key: 'ageing', label: 'Ageing > 14 days', value: counts.ageing, caption: 'Since first release', icon: Hourglass, tone: 'warning' },
    { key: 'issue', label: 'Issue in PR', value: counts.issue, caption: 'With requisitioner', icon: CornerUpLeft, tone: 'error' },
  ];

  const createRfq = (ids = selected) => {
    const chosen = lines.filter((l) => ids.includes(l.id));
    const ok = chosen.filter(ready);
    if (!ok.length) {
      toast({ title: 'Nothing to send to RFQ', description: 'Pick lines that are RFQ pending and have no open issue.', tone: 'error' });
      return;
    }
    if (ok.length < chosen.length) toast({ title: `${chosen.length - ok.length} line(s) skipped`, description: 'Already sourced or sent back to user.', tone: 'warning' });
    navigate('/rfq/create', { state: { lineIds: ok.map((l) => l.id) } });
  };

  const open = (type, ids = selected) => setModal({ type, ids });
  const done = () => { setModal(null); setSelected([]); };

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'PR' }, { label: 'Buyer Dashboard' }]}
        title="PR Buyer Dashboard"
        subtitle="Your assigned requisition lines — source them through RFQ, repeat order or direct NFA."
        actions={
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px 0 10px', height: 40, borderRadius: 10, background: colors.bgCard, border: `1px solid ${colors.border}` }}>
              <Avatar name={buyer} size={26} />
              {!isMobile && <span style={{ ...text.caption, whiteSpace: 'nowrap' }}>Viewing as</span>}
              <Select
                value={buyer}
                onChange={(v) => { setBuyer(v); setSelected([]); }}
                options={BUYERS.map((b) => b.name)}
                size="sm"
                style={{ width: 190 }}
                aria-label="Viewing as buyer"
              />
            </div>
            <Button variant="secondary" icon={<Download size={16} />} onClick={() => downloadCSV('pr-buyer-queue.csv', PR_EXPORT_COLUMNS, rows)}>Download</Button>
          </>
        }
      />

      <QuickStats items={stats} active={quick} onChange={setQuick} />

      <FilterBar fields={FIELDS} values={filters} defaults={DEFAULTS} onApply={(v) => { setFilters(v); setSelected([]); }} />

      <Card
        flush
        title={quick === 'ready' ? 'Ready for RFQ' : 'Assigned lines'}
        subtitle={`${rows.length} line${rows.length !== 1 ? 's' : ''} · select lines to create one RFQ`}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Input value={search} onChange={setSearch} size="sm" icon={<Search size={15} />} placeholder="Search…" style={{ width: isMobile ? 130 : 240 }} />
          </div>
        }
      >
        <PRTable rows={rows} variant="buyer" selected={selected} onSelectionChange={setSelected} onRowClick={(l) => setDetailId(l.id)} />
      </Card>
      <div style={{ height: 96 }} />

      <BulkActionBar
        count={selected.length}
        noun="line"
        onClear={() => setSelected([])}
        actions={[
          { label: 'Create RFQ', icon: FileStack, variant: 'primary', onClick: () => createRfq() },
          { label: 'Repeat order', icon: Repeat, onClick: () => open('repeat') },
          { label: 'Direct NFA', icon: FileSignature, onClick: () => open('nfa') },
          { label: 'Send back', icon: CornerUpLeft, variant: 'danger', onClick: () => open('sendBack') },
        ]}
      />

      <PRDetailDrawer
        open={!!detail}
        line={detail}
        mode="buyer"
        onClose={() => setDetailId(null)}
        onAction={(type) => (type === 'createRfq' ? createRfq([detail.id]) : setModal({ type, ids: [detail.id] }))}
      />

      <PRActionModals modal={modal} lines={lines} onClose={() => setModal(null)} onDone={done} />
    </>
  );
}
