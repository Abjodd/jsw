import { radius, status } from '@/theme/theme';
import { PRIORITIES } from '../data/constants';

/** P0 / P1 / P2 pill. `showName` adds "Critical / High / Normal". */
export default function PriorityPill({ priority, showName }) {
  const p = PRIORITIES[priority] ?? PRIORITIES.P2;
  const s = status[p.tone];
  return (
    <span
      title={`${p.label} · ${p.name}`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, height: 24, padding: '0 9px', borderRadius: radius.sm,
        fontSize: 12, fontWeight: 600, letterSpacing: '0.02em', whiteSpace: 'nowrap', color: s.color, background: s.bg,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 2, background: s.color, transform: 'rotate(45deg)' }} />
      {p.label}
      {showName && <span style={{ fontWeight: 500 }}>· {p.name}</span>}
    </span>
  );
}
