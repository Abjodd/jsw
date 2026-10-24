import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, FileText, RotateCcw, Undo2 } from 'lucide-react';
import { Button, Card, EmptyState, KpiCard, PageHeader, StatusBadge } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp } from '@/theme/theme';
import { NFA_LIST, NFA_STATUS_TONE } from '../data/mockData';
import { FilterRow, GnfaDataTable, InputField, LinkText, useNotify } from '../components/GnfaPrimitives';

/**
 * GNFA › GNFA Dashboard        Route: /gnfa/dashboard
 * Event ID / NFA ID search -> results table -> NFA ID opens the NFA views (/gnfa/dashboard/:nfaId).
 */
const digits = (v) => String(v).replace(/\D/g, '').replace(/^0+/, '');
const matches = (value, q) => !q || digits(value).includes(digits(q));

export default function GNFADashboard() {
  const navigate = useNavigate();
  const notify = useNotify();
  const isMobile = useMediaQuery(bp.mobile);
  const [rows, setRows] = useState(NFA_LIST);
  const [form, setForm] = useState({ eventId: '', nfaId: '' });
  const [applied, setApplied] = useState({ eventId: '', nfaId: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target?.value ?? e }));

  const visible = rows.filter((r) => matches(r.eventId, applied.eventId) && matches(r.nfaId, applied.nfaId));
  const RECALLABLE = ['Under Approval', 'Overdue'];
  const pending = rows.filter((r) => RECALLABLE.includes(r.status)).length;
  const recall = (id) => { setRows((rs) => rs.map((r) => (r.nfaId === id ? { ...r, status: 'Recalled', pendingWith: '' } : r))); notify(`NFA ${id} recalled`); };

  const columns = [
    { key: 'eventId', label: 'Event ID', style: { whiteSpace: 'nowrap' } },
    { key: 'nfaId', label: 'NFA ID', render: (r) => <LinkText onClick={() => navigate(`/gnfa/dashboard/${r.nfaId}`)}>{r.nfaId}</LinkText> },
    { key: 'group', label: 'Purchase Group and Description' },
    { key: 'scope', label: 'Scope' },
    { key: 'buyer', label: 'Buyer' },
    { key: 'status', label: 'NFA Status', render: (r) => <StatusBadge status={NFA_STATUS_TONE[r.status] ?? 'inactive'} label={r.status} /> },
    { key: 'pendingWith', label: 'Approval Pending With' },
    { key: 'pendingSince', label: 'Pending Since', style: { whiteSpace: 'nowrap' } },
    { key: 'created', label: 'GNFA Creation Date', style: { whiteSpace: 'nowrap' } },
    { key: 'po', label: 'PO Number', render: (r) => (r.po ? <LinkText>{r.po}</LinkText> : '') },
    { key: 'action', label: 'Recall', render: (r) => (
      <Button variant="secondary" icon={<Undo2 size={14} />} disabled={!RECALLABLE.includes(r.status)} onClick={() => recall(r.nfaId)}>Recall</Button>
    ) },
  ];

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'GNFA', to: '/gnfa' }, { label: 'GNFA Dashboard' }]}
        title="GNFA Dashboard"
        subtitle="Search NFAs and follow each one through approval."
      />
      <Card style={{ marginBottom: 20 }}>
        <FilterRow>
          <InputField label="Event ID" value={form.eventId} onChange={set('eventId')} style={{ minWidth: 220 }} />
          <InputField label="NFA ID" value={form.nfaId} onChange={set('nfaId')} style={{ minWidth: 220 }} />
          <Button onClick={() => setApplied(form)}>Go</Button>
          <Button variant="secondary" icon={<RotateCcw size={16} />} onClick={() => { const e = { eventId: '', nfaId: '' }; setForm(e); setApplied(e); }}>Clear</Button>
        </FilterRow>
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 1 : 2}, 1fr)`, gap: 16, marginBottom: 20 }}>
        <KpiCard label="NFAs in view" value={String(visible.length)} icon={FileText} caption="Matching the search" />
        <KpiCard label="Awaiting approval" value={String(pending)} icon={Clock} caption="Under approval or overdue" />
      </div>
      <Card title="NFA results" flush>
        {visible.length ? <GnfaDataTable columns={columns} rows={visible} /> : <EmptyState title="No NFAs found" description="Change the Event ID or NFA ID, or choose Clear to see all NFAs." />}
      </Card>
    </>
  );
}
