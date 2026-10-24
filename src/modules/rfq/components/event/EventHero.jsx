import { Briefcase, CalendarClock, CircleStop, Coins, Layers3, Pause, Play, User, XCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors, radius, text } from '@/theme/theme';
import { formatDateTime, splitDuration } from '@/utils/format';
import useCountdown from '../../hooks/useCountdown';

const STATUS_STYLE = {
  Live: { color: '#8FE0B8', label: 'Live', dot: true },
  Paused: { color: '#F2C77C', label: 'Paused' },
  Closed: { color: '#C7D1DB', label: 'Closed' },
  Cancelled: { color: '#F2A7A7', label: 'Cancelled' },
};

function Box({ value, label }) {
  return (
    <div style={{ minWidth: 64, padding: '10px 8px 8px', borderRadius: radius.md, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', textAlign: 'center' }}>
      <div style={{ fontSize: 30, lineHeight: '36px', fontWeight: 600, color: colors.white, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{String(value).padStart(2, '0')}</div>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>{label}</div>
    </div>
  );
}

/** Navy header for an RFQ event: identity, live countdown, window progress and buyer actions. */
export default function EventHero({ event: e, onAction }) {
  const isTablet = useMediaQuery(bp.laptop);
  const live = e.status === 'Live';
  const ms = useCountdown(e.end, live);
  const remaining = e.status === 'Paused' ? e.pausedRemaining : live ? ms : 0;
  const { d, h, m, s } = splitDuration(remaining);
  const startMs = new Date(e.start).getTime();
  const endMs = e.status === 'Paused' ? Date.now() + (e.pausedRemaining ?? 0) : new Date(e.end).getTime();
  const elapsed = Math.min(100, Math.max(0, ((Date.now() - startMs) / (endMs - startMs)) * 100));
  const st = STATUS_STYLE[e.status];
  const finished = e.status === 'Closed' || e.status === 'Cancelled';
  const urgent = live && ms < 24 * 3600e3;

  const meta = [
    [User, 'Buyer', e.buyer],
    [Briefcase, 'Function', e.function],
    [Layers3, 'Category', `${e.category} · ${e.commodity}`],
    [Coins, 'Base currency', `${e.currency} · ${e.assetClass}`],
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
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: isTablet ? '1fr' : 'minmax(0, 1.4fr) minmax(360px, 1fr)', gap: 28, padding: isTablet ? 22 : 28 }}>
        {/* identity */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 26, padding: '0 10px', borderRadius: 999, background: 'rgba(255,255,255,0.1)', color: st.color, fontSize: 12, fontWeight: 600 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: st.color, animation: st.dot ? 'jsw-pulse 1.6s ease-in-out infinite' : 'none' }} />
              {st.label}
            </span>
            <span style={{ height: 26, display: 'inline-flex', alignItems: 'center', padding: '0 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)' }}>
              Event {e.eventId}
            </span>
            <span style={{ height: 26, display: 'inline-flex', alignItems: 'center', padding: '0 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)' }}>
              {e.rfqId}
            </span>
          </div>
          <h1 style={{ ...text.pageTitle, color: colors.white, margin: '14px 0 4px' }}>{e.subject}</h1>
          {e.description && e.description !== e.subject && <p style={{ ...text.subtitle, color: 'rgba(255,255,255,0.7)' }}>{e.description}</p>}

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isTablet ? 2 : 4}, minmax(0, 1fr))`, gap: 16, marginTop: 22 }}>
            {meta.map(([Icon, label, value]) => (
              <div key={label} style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}><Icon size={13} />{label}</div>
                <div style={{ ...text.body, fontWeight: 500, color: colors.white, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* countdown */}
        <div style={{ padding: 20, borderRadius: radius.lg, background: 'rgba(0,0,0,0.14)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: urgent ? '#F2C77C' : 'rgba(255,255,255,0.75)' }}>
            <CalendarClock size={16} />
            {live ? (urgent ? 'Closing soon — time remaining' : 'Time remaining') : e.status === 'Paused' ? 'Paused — time on hold' : e.status === 'Closed' ? 'Bid window closed' : `Cancelled — ${e.cancelReason ?? ''}`}
          </div>
          {!finished ? (
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <Box value={d} label="Days" /><Box value={h} label="Hours" /><Box value={m} label="Min" /><Box value={s} label="Sec" />
            </div>
          ) : (
            <div style={{ fontSize: 24, lineHeight: '32px', fontWeight: 600, marginTop: 12 }}>{formatDateTime(e.end)}</div>
          )}
          <div style={{ marginTop: 16 }}>
            <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
              <span style={{ display: 'block', height: '100%', width: `${finished ? 100 : elapsed}%`, borderRadius: 999, background: urgent ? '#F2C77C' : '#8DB6D6' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              <span>{formatDateTime(e.start)}</span>
              <span>{formatDateTime(e.status === 'Paused' ? endMs : e.end)}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
            {e.status === 'Paused' ? (
              <Button variant="onDark" size="sm" icon={<Play size={15} />} onClick={() => onAction('resume')}>Resume RFQ</Button>
            ) : (
              <Button variant="onDark" size="sm" icon={<Pause size={15} />} disabled={!live} onClick={() => onAction('pause')}>Pause RFQ</Button>
            )}
            <Button variant="onDark" size="sm" icon={<CircleStop size={15} />} disabled={finished} onClick={() => onAction('end')}>End RFQ</Button>
            <Button variant="onDark" size="sm" icon={<XCircle size={15} />} disabled={finished} onClick={() => onAction('cancel')} style={{ color: finished ? undefined : '#F2B8B8' }}>Cancel RFQ</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
