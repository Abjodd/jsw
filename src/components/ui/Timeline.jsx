import { colors, status, text } from '@/theme/theme';
import { formatDate, formatDateTime } from '@/utils/format';

/**
 * Vertical activity timeline, newest first.
 * <Timeline items={[{ at: ISO, text: '...', tone: 'success|progress|warning|error|inactive', by?: 'name' }]} />
 */
export default function Timeline({ items, style }) {
  const list = [...items].sort((a, b) => new Date(b.at) - new Date(a.at));
  return (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 18, ...style }}>
      {list.map((a, i) => (
        <li key={i} style={{ display: 'grid', gridTemplateColumns: '14px 1fr auto', gap: 14, position: 'relative', alignItems: 'start' }}>
          {i < list.length - 1 && <span style={{ position: 'absolute', left: 6, top: 18, bottom: -16, width: 2, background: colors.border }} />}
          <span style={{ width: 14, height: 14, marginTop: 4, borderRadius: '50%', position: 'relative', background: status[a.tone]?.color ?? colors.steel, boxShadow: `0 0 0 4px ${status[a.tone]?.bg ?? colors.steel50}` }} />
          <span style={{ ...text.body, color: colors.textPrimary }}>
            {a.text}
            {a.by && <span style={{ ...text.caption, display: 'block' }}>by {a.by}</span>}
          </span>
          <span style={{ ...text.caption, whiteSpace: 'nowrap' }}>{String(a.at).length > 10 ? formatDateTime(a.at) : formatDate(a.at)}</span>
        </li>
      ))}
    </ol>
  );
}
