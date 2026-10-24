import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Save, Send } from 'lucide-react';
import { Button, Card, PageHeader } from '@/components/ui';
import { EVENTS } from '../data/mockData';
import { TabBar, useNotify } from '../components/GnfaPrimitives';
import * as S from '../components/GnfaSections';

/**
 * GNFA › GNFA Create › Detail      Route: /gnfa/create/detail
 * Opened by "Create GNFA" on GNFA Create. A detail view inside the same right panel — not a sidebar item.
 */
const TABS = {
  'User Requirements': S.UserRequirement,
  'Bidding/RFQ': S.Bidding,
  'Proposed Vendor': S.ProposedVendor,
  Comparative: S.Comparative,
  'Commercial Terms': S.CommercialTerms,
  'Awarded Vendor': S.AwardedVendorInfo,
  'Deviations from Standard Terms': S.Deviations,
  Others: S.Others,
  Attachment: S.Attachments,
};
const TITLES = {
  'User Requirements': 'User Requirement Details', 'Bidding/RFQ': 'Bidding / RFQ Overview', 'Proposed Vendor': 'Proposed Vendor & Rationale',
  Comparative: 'Comparative Summary', 'Commercial Terms': 'Commercial Terms Comparison', 'Awarded Vendor': 'Awarded Vendor',
  'Deviations from Standard Terms': 'Deviations from Standard Terms', Others: 'Others', Attachment: 'Attachments',
};

export default function GNFACreateDetail() {
  const navigate = useNavigate();
  const notify = useNotify();
  const { state } = useLocation();
  const eventId = state?.eventId ?? EVENTS[10038].id;
  const [tab, setTab] = useState('User Requirements');
  const Body = TABS[tab];

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'GNFA', to: '/gnfa' }, { label: 'GNFA Create', to: '/gnfa/create' }, { label: 'Create Detail' }]}
        title="GNFA Create Detail"
        subtitle={`Event ${eventId} · complete each tab, then save or submit the NFA.`}
        actions={
          <>
            <Button variant="secondary" icon={<Save size={16} />} onClick={() => notify('NFA saved as draft')}>Save NFA</Button>
            <Button icon={<Send size={16} />} onClick={() => { notify('NFA submitted for approval'); navigate('/gnfa/dashboard'); }}>Submit NFA</Button>
          </>
        }
      />
      <TabBar tabs={Object.keys(TABS)} value={tab} onChange={setTab} />
      <Card title={TITLES[tab]}><Body /></Card>
    </>
  );
}
