import { useMemo, useState } from 'react';
import { AlertOctagon, ArrowRightLeft, CornerUpLeft, Download, Flag, Layers, Search, Timer, UserPlus, UserX } from 'lucide-react';
import { BulkActionBar, Button, Card, FilterBar, Input, PageHeader, useToast } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp } from '@/theme/theme';
import { downloadCSV, formatCompactINR } from '@/utils/format';
import PRActionModals from '../components/PRActionModals';
import PRDetailDrawer from '../components/PRDetailDrawer';
import PRTable from '../components/PRTable';
import { QuickStats } from '@/components/ui';
import { ASSIGNMENT_STATUSES, DOCUMENT_TYPES, PURCHASE_GROUPS, RELEASE_STATUSES, RFQ_STATUSES } from '../data/constants';
import { BUYERS } from '../data/mockData';
import { prStore } from '../data/prStore';
import { PR_EXPORT_COLUMNS } from '../data/exportColumns';
import usePRFilters from '../hooks/usePRFilters';

/**
 * PR › Admin Dashboard
 * Route: /pr
 * Admin view of every released PR line: assign / reassign buyers, change priority, send back.
 */
const DEFAULTS = { fromDate: '2026-09-01', toDate: '2026-10-31' };

const FIELDS = [
  { key: 'prNumber', label: 'PR number', type: 'text', placeholder: 'e.g. 2000016181' },
  { key: 'fromDate', label: 'PR from date', type: 'date', required: true },
  { key: 'toDate', label: 'PR to date', type: 'date', required: true },
  { key: 'assignmentStatus', label: 'Assignment status', type: 'select', options: ASSIGNMENT_STATUSES },
  { key: 'priority', label: 'Priority', type: 'select', options: ['P0', 'P1', 'P2'] },
  { key: 'purchaseGroup', label: 'Purchase group', type: 'select', options: PURCHASE_GROUPS },
  { key: 'docType', label: 'Document type', type: 'select', options: DOCUMENT_TYPES },
  { key: 'releaseStatus', label: 'Release status', type: 'select', options: RELEASE_STATUSES },
  { key: 'buyer', label: 'Buyer name', type: 'select', options: BUYERS.map((b) => b.name) },
  { key: 'rfqStatus', label: 'PR → RFQ status', type: 'select', options: RFQ_STATUSES },
];

const QUICK = [
  { key: 'all', predicate: () => true },
  { key: 'unassigned', predicate: (l) => !l.activeBuyer },
  { key: 'critical', predicate: (l) => l.priority === 'P0' },
  { key: 'issue', predicate: (l) => !!l.sendBack },
  { key: 'pending', predicate: (l) => l.rfqStatus === 'RFQ Pending' },
];

export default function PRAdminDashboard() {
  const { toast } = useToast();
  const isMobile = useMediaQuery(bp.mobile);
  const { lines } = prStore.useStore();
  const { filters, setFilters, quick, setQuick, search, setSearch, filtered, rows, counts } = usePRFilters(lines, { defaults: DEFAULTS, quickFilters: QUICK });

  const [selected, setSelected] = useState([]);
  const [detailId, setDetailId] = useState(null);
  const [modal, setModal] = useState(null);

  const detail = lines.find((l) => l.id === detailId);
  const selectedLines = lines.filter((l) => selected.includes(l.id));
  const totalValue = useMemo(() => filtered.reduce((s, l) => s + l.totalValue, 0), [filtered]);
  const rowsValue = rows.reduce((s, l) => s + l.totalValue, 0);

  const stats = [
    { key: 'all', label: 'All PR lines', value: counts.all, caption: `${formatCompactINR(totalValue)} total value`, icon: Layers, tone: 'navy' },
    { key: 'unassigned', label: 'Unassigned', value: counts.unassigned, caption: 'Waiting for a buyer', icon: UserX, tone: 'warning' },
    { key: 'critical', label: 'Critical (P0)', value: counts.critical, caption: 'Process within 24 h', icon: AlertOctagon, tone: 'error' },
    { key: 'issue', label: 'Issue in PR', value: counts.issue, caption: 'Sent back to user', icon: CornerUpLeft, tone: 'error' },
    { key: 'pending', label: 'RFQ pending', value: counts.pending, caption: 'Not yet sourced', icon: Timer, tone: 'progress' },
  ];

  const open = (type, ids = selected) => setModal({ type, ids });
  const done = () => { setModal(null); setSelected([]); };
  const anyAssigned = selectedLines.some((l) => l.activeBuyer);

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'PR' }, { label: 'Admin Dashboard' }]}
        title="PR Admin Dashboard"
        subtitle="Route released requisitions to buyers, set priorities and resolve PR issues."
        actions={
          <Button
            variant="secondary"
            icon={<Download size={16} />}
            onClick={() => { downloadCSV('pr-admin-lines.csv', PR_EXPORT_COLUMNS, rows); toast({ title: 'Export ready', description: `${rows.length} lines · all columns` }); }}
          >
            Download
          </Button>
        }
      />

      <QuickStats items={stats} active={quick} onChange={setQuick} />

      <FilterBar fields={FIELDS} values={filters} defaults={DEFAULTS} onApply={(v) => { setFilters(v); setSelected([]); }} />

      <Card
        flush
        title="Requisition lines"
        subtitle={`${rows.length} line${rows.length !== 1 ? 's' : ''} · ${formatCompactINR(rowsValue)}`}
        actions={
          <Input
            value={search}
            onChange={setSearch}
            size="sm"
            icon={<Search size={15} />}
            placeholder={isMobile ? 'Search' : 'Search PR, material, requisitioner…'}
            style={{ width: isMobile ? 150 : 300 }}
          />
        }
      >
        <PRTable rows={rows} variant="admin" selected={selected} onSelectionChange={setSelected} onRowClick={(l) => setDetailId(l.id)} />
      </Card>
      <div style={{ height: 96 }} />

      <BulkActionBar
        count={selected.length}
        noun="line"
        onClear={() => setSelected([])}
        actions={[
          { label: 'Assign buyer', icon: UserPlus, variant: 'primary', onClick: () => open('assign') },
          { label: 'Reassign', icon: ArrowRightLeft, onClick: () => open('reassign'), disabled: !anyAssigned, title: anyAssigned ? undefined : 'None of the selected lines has a buyer yet' },
          { label: 'Change priority', icon: Flag, onClick: () => open('priority') },
          { label: 'Send back', icon: CornerUpLeft, variant: 'danger', onClick: () => open('sendBack') },
        ]}
      />

      <PRDetailDrawer
        open={!!detail}
        line={detail}
        mode="admin"
        onClose={() => setDetailId(null)}
        onAction={(type) => setModal({ type, ids: [detail.id] })}
      />

      <PRActionModals modal={modal} lines={lines} onClose={() => setModal(null)} onDone={done} />
    </>
  );
}
