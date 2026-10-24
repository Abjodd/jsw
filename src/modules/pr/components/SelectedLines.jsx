import { colors, radius, text } from '@/theme/theme';
import { formatINR } from '@/utils/format';
import PriorityPill from './PriorityPill';

/** Compact list of the PR lines an action will apply to. */
export default function SelectedLines({ lines, max = 4, extra }) {
  const shown = lines.slice(0, max);
  return (
    <div style={{ border: `1px solid ${colors.border}`, borderRadius: radius.md, overflow: 'hidden' }}>
      {shown.map((l, i) => (
        <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderTop: i ? `1px solid ${colors.border}` : 0, background: colors.bgCard }}>
          <PriorityPill priority={l.priority} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...text.body, fontWeight: 600, color: colors.navy }}>{l.prNumber} / {l.lineItem}</div>
            <div style={{ ...text.caption, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.materialDesc}</div>
          </div>
          {extra ? extra(l) : <span style={{ ...text.body, fontWeight: 600, whiteSpace: 'nowrap' }}>{formatINR(l.totalValue)}</span>}
        </div>
      ))}
      {lines.length > max && (
        <div style={{ ...text.caption, padding: '8px 14px', background: colors.bgSubtle, borderTop: `1px solid ${colors.border}` }}>
          + {lines.length - max} more line{lines.length - max > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
