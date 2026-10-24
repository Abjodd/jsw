import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, History } from 'lucide-react';
import { Button, Card, EmptyState, PageHeader, StatusBadge } from '@/components/ui';
import { AWARDED, NFA_DETAILS, NFA_LIST, NFA_STATUS_TONE } from '../data/mockData';
import { type } from '../components/gnfaTokens';
import { ApprovalSteps, Collapsible, FieldGrid, GnfaDataTable, LinkText, ReadField, TabBar } from '../components/GnfaPrimitives';
import * as S from '../components/GnfaSections';

/**
 * GNFA › GNFA Dashboard › NFA          Route: /gnfa/dashboard/:nfaId
 * Executive Summary / Detailed / Attachment / Work Flow — all inside the right panel.
 */
const TABS = ['Executive Summary', 'Detailed', 'Attachment', 'Work Flow'];

function Executive({ e }) {
  return (
    <Card title="Executive Summary">
      <FieldGrid>
        <ReadField label="Plant Name" value={e.plant} />
        <div><span style={{ ...type.label, display: 'block', marginBottom: 6 }}>Scope</span><LinkText>Scope</LinkText></div>
        <ReadField label="Budgeted Amount (PR Value)" value={e.budget} />
        <ReadField label="NFA Amount" value={e.nfaAmount} />
        <ReadField label="Total Vendors Quoted" value={e.quoted} />
        <ReadField label="Vendors Shortlisted" value={e.shortlisted} />
        <ReadField label="Commercial Diff from Others (L1 vs L2)" value={e.diff} />
        <div><span style={{ ...type.label, display: 'block', marginBottom: 6 }}>NFA Justification</span><LinkText>NFA Justification</LinkText></div>
        <ReadField label="Exceptions (If any)" value="" />
      </FieldGrid>
      <div style={{ marginTop: 20 }}>
        <GnfaDataTable
          columns={[
            { key: 'supplier', label: 'Awarded Supplier' }, { key: 'rank', label: 'Commercial Rank' },
            { key: 'ta', label: 'Technically Acceptable' }, { key: 'existing', label: 'Existing/New' }, { key: 'risk', label: 'Risk Rating' },
          ]}
          rows={AWARDED.map((a) => ({ ...a, ta: '', risk: '' }))}
        />
      </div>
    </Card>
  );
}

const Detailed = ({ nfaId }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Collapsible title="User Requirement Details & Quotes"><S.UserRequirement nfaId={nfaId} /></Collapsible>
    <Collapsible title="Bidding/RFQ Overview"><S.Bidding /></Collapsible>
    <Collapsible title="Proposed Vendor & Rationale"><S.ProposedVendor showRationale /></Collapsible>
    <Collapsible title="Comparative Summary"><S.Comparative /></Collapsible>
    <Collapsible title="Commercial Terms"><S.CommercialTerms /></Collapsible>
    <Collapsible title="Awarded Vendors Information and VDD" ><S.AwardedVendorInfo /></Collapsible>
  </div>
);

const WorkFlow = ({ steps, queries }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Card title="Approval workflow">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}><Button variant="secondary" icon={<History size={16} />}>History</Button></div>
      <ApprovalSteps steps={steps} />
    </Card>
    <Card title="Raise Query" flush>
      {queries.length ? (
        <GnfaDataTable
          columns={[{ key: 'inquiry', label: 'Inquiry' }, { key: 'response', label: 'Buyer Response', render: (r) => r.response || 'Awaiting response' }, { key: 'by', label: 'Raised By' }, { key: 'on', label: 'Raised On' }]}
          rows={queries}
        />
      ) : (
        <EmptyState title="No queries raised" description="Queries raised on this NFA will be listed here." />
      )}
    </Card>
  </div>
);

export default function GNFADashboardDetail() {
  const { nfaId } = useParams();
  const navigate = useNavigate();
  const nfa = NFA_LIST.find((n) => n.nfaId === nfaId);
  const [tab, setTab] = useState(TABS[0]);
  const detail = NFA_DETAILS[nfaId] ?? NFA_DETAILS['0000050022'];

  if (!nfa) {
    return (
      <>
        <PageHeader crumbs={[{ label: 'Applications', to: '/' }, { label: 'GNFA', to: '/gnfa' }, { label: 'GNFA Dashboard', to: '/gnfa/dashboard' }]} title="NFA not found" />
        <Card><EmptyState title={`No NFA ${nfaId}`} description="Go back to the dashboard and search again." /></Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'GNFA', to: '/gnfa' }, { label: 'GNFA Dashboard', to: '/gnfa/dashboard' }, { label: nfa.nfaId }]}
        title={`NFA ${nfa.nfaId}`}
        subtitle={`Event ${nfa.eventId} · Buyer ${nfa.buyer}`}
        actions={
          <>
            <StatusBadge status={NFA_STATUS_TONE[nfa.status] ?? 'inactive'} label={nfa.status} />
            <Button variant="secondary" icon={<FileText size={16} />} disabled>Select Document Type</Button>
            <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate('/gnfa/dashboard')}>Back to dashboard</Button>
          </>
        }
      />
      <TabBar tabs={TABS} value={tab} onChange={setTab} />
      {tab === 'Executive Summary' && <Executive e={detail.exec} />}
      {tab === 'Detailed' && <Detailed nfaId={nfa.nfaId} />}
      {tab === 'Attachment' && <Card title="Attachments"><S.Attachments /></Card>}
      {tab === 'Work Flow' && <WorkFlow steps={detail.workflow} queries={detail.queries} />}
    </>
  );
}
