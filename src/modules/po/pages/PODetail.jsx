import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Activity, AlarmClockOff, ArrowLeft, CalendarClock, FileImage, ListChecks, MessageSquareText, PackageCheck, Truck } from 'lucide-react';
import { Card, EmptyState, KpiCard, Tabs, Timeline } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors, text } from '@/theme/theme';
import AcknowledgeModal from '../components/detail/AcknowledgeModal';
import ASNsTab from '../components/detail/ASNsTab';
import DeliveryDecisionModal from '../components/detail/DeliveryDecisionModal';
import DrawingsTab from '../components/detail/DrawingsTab';
import ItemDrawer from '../components/detail/ItemDrawer';
import ItemsTab from '../components/detail/ItemsTab';
import POHero from '../components/detail/POHero';
import RemarksTab from '../components/detail/RemarksTab';
import RemarksModal from '../components/RemarksModal';
import { pendingChanges, poDeliveredPct, poOverdueItems } from '../data/poMath';
import { poStore } from '../data/poStore';

/**
 * PO › Purchase order detail
 * Route: /po/:poNumber
 */
export default function PODetail() {
  const { poNumber } = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(bp.mobile);
  const isLaptop = useMediaQuery(bp.laptop);
  const { pos } = poStore.useStore();
  const [tab, setTab] = useState('items');
  const [modal, setModal] = useState(null);
  const [itemNo, setItemNo] = useState(null);
  const po = pos.find((p) => p.poNumber === poNumber);

  if (!po) {
    return (
      <Card>
        <EmptyState title="Purchase order not found" description={`No PO with number ${poNumber}.`} />
        <p style={{ textAlign: 'center' }}><Link to="/po">Back to Purchase Orders</Link></p>
      </Card>
    );
  }

  const onAction = (a) => (a === 'asn' ? navigate(`/po/${po.poNumber}/asn`) : setModal(a));
  const overdue = poOverdueItems(po).length;
  const changes = pendingChanges(po).length;
  const TABS = [
    { key: 'items', label: 'Items', icon: ListChecks, count: po.items.length },
    { key: 'drawings', label: 'Drawings', icon: FileImage, count: po.items.reduce((s, i) => s + i.drawings.length, 0) },
    { key: 'asns', label: 'ASNs', icon: Truck, count: po.asns.length },
    { key: 'remarks', label: 'Remarks', icon: MessageSquareText, count: po.remarks.length },
    { key: 'activity', label: 'Activity', icon: Activity },
  ];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, ...text.caption }}>
        <Link to="/po" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: colors.textSecondary, fontWeight: 500 }}><ArrowLeft size={14} /> Purchase Orders</Link>
        <span style={{ color: colors.textDisabled }}>/</span><span>PO {po.poNumber}</span>
      </div>

      <POHero po={po} onAction={onAction} />

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 1 : isLaptop ? 2 : 4}, 1fr)`, gap: 16, marginBottom: 20 }}>
        <KpiCard label="Delivered" value={`${Math.round(poDeliveredPct(po))}%`} icon={PackageCheck} caption="Of total ordered quantity" />
        <KpiCard label="ASNs created" value={po.asns.length} icon={Truck} caption={`${po.asns.filter((a) => a.status === 'In Transit').length} in transit`} />
        <KpiCard label="Overdue items" value={overdue} icon={AlarmClockOff} caption={overdue ? 'Past expected delivery date' : 'All on schedule'} />
        <KpiCard label="Date change requests" value={changes} icon={CalendarClock} caption={changes ? 'Awaiting your decision' : 'Nothing pending'} />
      </div>

      <Card flush bodyStyle={{ overflowX: 'visible' }}>
        <div style={{ padding: '0 20px' }}><Tabs items={TABS} value={tab} onChange={setTab} style={{ borderBottom: 0 }} /></div>
        <div style={{ borderTop: `1px solid ${colors.border}` }}>
          {tab === 'items' && <ItemsTab po={po} onOpenItem={(i) => setItemNo(i.itemNo)} />}
          {tab === 'drawings' && <DrawingsTab po={po} />}
          {tab === 'asns' && <ASNsTab po={po} onCreate={() => onAction('asn')} />}
          {tab === 'remarks' && <RemarksTab po={po} onAdd={() => setModal('remarks')} />}
          {tab === 'activity' && <Timeline items={po.activity} style={{ padding: 24 }} />}
        </div>
      </Card>

      {itemNo && <ItemDrawer po={po} item={po.items.find((i) => i.itemNo === itemNo)} onClose={() => setItemNo(null)} />}
      {modal === 'ack' && <AcknowledgeModal po={po} onClose={() => setModal(null)} />}
      {modal === 'dates' && <DeliveryDecisionModal po={po} onClose={() => setModal(null)} />}
      {modal === 'remarks' && <RemarksModal po={po} onClose={() => setModal(null)} />}
    </>
  );
}
