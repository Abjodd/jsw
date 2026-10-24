import { CalendarClock, CheckCheck, MessageSquareText, Truck } from 'lucide-react';
import { Button } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors, radius, text } from '@/theme/theme';
import { amountInWords, formatDate, formatINR } from '@/utils/format';
import { vendor } from '../../data/mockData';
import { pendingChanges, poDeliveredPct, poPendingValue, poTotal } from '../../data/poMath';

const STATUS_COLOR = { New: '#A9CBEA', 'Pending Acknowledgement': '#F2C77C', Acknowledged: '#8FE0B8', 'Partially Delivered': '#A9CBEA', Closed: '#C7D1DB' };
const chip = { height: 26, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)' };

/** Navy header for a PO: vendor, commercial terms, value (in words) and primary actions. */
export default function POHero({ po, onAction }) {
  const isLaptop = useMediaQuery(bp.laptop);
  const v = vendor(po.vendorCode);
  const total = poTotal(po);
  const pct = poDeliveredPct(po);
  const changes = pendingChanges(po).length;
  const needsAck = po.status === 'New' || po.status === 'Pending Acknowledgement';

  const meta = [
    ['Plant', `${po.plant.code} · ${po.plant.name}`], ['Purchase group', `${po.purGroup.code} · ${po.purGroup.name}`],
    ['Payment terms', po.paymentTerms], ['Incoterms', po.incoterms],
    ['Document type', `${po.docType} · ${po.poType}`], ['Created', `${formatDate(po.createdOn)} · ${po.createdBy}`],
    ['Unit', po.unitNo], ['Currency', po.currency],
  ];

  return (
    <section
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: radius.xl, color: colors.white, marginBottom: 20,
        background: `radial-gradient(80% 140% at 100% 0%, rgba(71,125,165,0.5) 0%, transparent 60%), linear-gradient(120deg, ${colors.navy} 0%, #163B5B 60%, ${colors.graphite} 100%)`,
        boxShadow: '0 16px 40px rgba(18,48,74,0.18)',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(115deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 48px)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: isLaptop ? '1fr' : 'minmax(0, 1.5fr) minmax(340px, 1fr)', gap: 28, padding: isLaptop ? 22 : 28 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ ...chip, background: 'rgba(255,255,255,0.1)', color: STATUS_COLOR[po.status] }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_COLOR[po.status] }} />{po.status}
            </span>
            <span style={{ ...chip, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{po.docType} · {po.poType}</span>
            {changes > 0 && <span style={{ ...chip, color: '#F2C77C' }}><CalendarClock size={13} />{changes} delivery date request{changes > 1 ? 's' : ''}</span>}
          </div>
          <h1 style={{ ...text.pageTitle, color: colors.white, margin: '14px 0 2px', fontVariantNumeric: 'tabular-nums' }}>PO {po.poNumber}</h1>
          <p style={{ ...text.subtitle, color: 'rgba(255,255,255,0.75)' }}>{v.code} · {v.name} · {v.city}, {v.state}</p>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isLaptop ? 2 : 4}, minmax(0, 1fr))`, gap: '16px 20px', marginTop: 22 }}>
            {meta.map(([label, value]) => (
              <div key={label} style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{label}</div>
                <div style={{ ...text.body, fontWeight: 500, color: colors.white, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={value}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: 20, borderRadius: radius.lg, background: 'rgba(0,0,0,0.14)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Total PO value (incl. GST)</div>
          <div style={{ fontSize: 32, lineHeight: '40px', fontWeight: 600, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{formatINR(total, 2)}</div>
          <div style={{ ...text.caption, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{amountInWords(total)}</div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
            <span>Pending order value <strong style={{ color: colors.white, marginLeft: 6 }}>{formatINR(poPendingValue(po), 2)}</strong></span>
            <span>{Math.round(pct)}% delivered</span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.12)', overflow: 'hidden', marginTop: 8 }}>
            <span style={{ display: 'block', height: '100%', width: `${pct}%`, borderRadius: 999, background: '#8DB6D6' }} />
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 18, flexWrap: 'wrap' }}>
            {needsAck && <Button size="sm" variant="accent" icon={<CheckCheck size={15} />} onClick={() => onAction('ack')}>Acknowledge PO</Button>}
            <Button size="sm" variant="onDark" icon={<Truck size={15} />} disabled={po.status === 'Closed'} onClick={() => onAction('asn')}>Create ASN</Button>
            <Button size="sm" variant="onDark" icon={<CalendarClock size={15} />} disabled={!changes} onClick={() => onAction('dates')}>
              Date decisions{changes ? ` (${changes})` : ''}
            </Button>
            <Button size="sm" variant="onDark" icon={<MessageSquareText size={15} />} onClick={() => onAction('remarks')}>Remarks{po.remarks.length ? ` (${po.remarks.length})` : ''}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
