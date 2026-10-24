import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Activity, ArrowLeft, FileText, Info, ListChecks, Paperclip, Store, Trophy, Inbox, Layers, Target } from 'lucide-react';
import { Card, EmptyState, KpiCard, Tabs } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors, text } from '@/theme/theme';
import { formatINR } from '@/utils/format';
import ActivityTab from '../components/event/ActivityTab';
import AttachmentsTab from '../components/event/AttachmentsTab';
import EventActionModal from '../components/event/EventActionModal';
import EventHero from '../components/event/EventHero';
import GeneralTab from '../components/event/GeneralTab';
import ItemsTab from '../components/event/ItemsTab';
import TermsTab from '../components/event/TermsTab';
import VendorsTab from '../components/event/VendorsTab';
import getEventStats from '../data/eventStats';
import { rfqStore } from '../data/rfqStore';

/**
 * RFQ › Event detail
 * Route: /rfq/events/:eventId
 * Live countdown, pause / end / cancel, and read-only tabs for items, details, T&C, vendors, attachments.
 */
export default function RFQEventDetail() {
  const { eventId } = useParams();
  const isMobile = useMediaQuery(bp.mobile);
  const isLaptop = useMediaQuery(bp.laptop);
  const { events } = rfqStore.useStore();
  const [tab, setTab] = useState('items');
  const [action, setAction] = useState(null);
  const e = events.find((x) => x.eventId === eventId);

  if (!e) {
    return (
      <Card>
        <EmptyState title="RFQ event not found" description={`No event with ID ${eventId}.`} />
        <p style={{ textAlign: 'center' }}><Link to="/rfq">Back to RFQ Dashboard</Link></p>
      </Card>
    );
  }

  const s = getEventStats(e);
  const TABS = [
    { key: 'items', label: 'Items / Service', icon: ListChecks, count: e.items.length },
    { key: 'general', label: 'General details', icon: Info },
    { key: 'terms', label: 'Terms & conditions', icon: FileText },
    { key: 'vendors', label: 'Vendors', icon: Store, count: e.vendors.length },
    { key: 'attachments', label: 'Attachments', icon: Paperclip, count: e.attachments.length + e.prAttachments.length },
    { key: 'activity', label: 'Activity', icon: Activity },
  ];
  const body = { items: ItemsTab, general: GeneralTab, terms: TermsTab, vendors: VendorsTab, attachments: AttachmentsTab, activity: ActivityTab }[tab];
  const Body = body;

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, ...text.caption }}>
        <Link to="/rfq" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: colors.textSecondary, fontWeight: 500 }}>
          <ArrowLeft size={14} /> RFQ Dashboard
        </Link>
        <span style={{ color: colors.textDisabled }}>/</span>
        <span>Event {e.eventId}</span>
      </div>

      <EventHero event={e} onAction={setAction} />

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 1 : isLaptop ? 2 : 4}, 1fr)`, gap: 16, marginBottom: 20 }}>
        <KpiCard label="Bids received" value={`${s.bids} / ${s.invited}`} icon={Inbox} caption={s.invited - s.bids ? `${s.invited - s.bids} supplier(s) yet to respond` : 'All suppliers responded'} />
        <KpiCard label="Lowest quote (L1)" value={s.l1 ? formatINR(s.l1.amount) : '—'} icon={Trophy} caption={s.l1Vendor ? s.l1Vendor.name : 'No bids yet'} />
        <KpiCard label="Ceiling value" value={formatINR(s.ceiling)} icon={Target} caption={s.savingsPct != null ? `L1 is ${s.savingsPct.toFixed(1)}% ${s.savingsPct >= 0 ? 'below' : 'above'} ceiling` : 'Sum of ceiling × qty'} />
        <KpiCard label="Line items" value={e.items.length} icon={Layers} caption={[...new Set(e.items.map((i) => i.prNumber))].map((p) => `PR ${p}`).join(', ')} />
      </div>

      <Card flush bodyStyle={{ overflowX: 'visible' }}>
        <div style={{ padding: '0 20px' }}>
          <Tabs items={TABS} value={tab} onChange={setTab} style={{ borderBottom: 0 }} />
        </div>
        <div style={{ borderTop: `1px solid ${colors.border}` }}>
          <Body event={e} />
        </div>
      </Card>

      <EventActionModal action={action} event={e} onClose={() => setAction(null)} />
    </>
  );
}
