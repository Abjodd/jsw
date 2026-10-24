import { colors, status, text } from '@/theme/theme';
import { formatDateTime } from '@/utils/format';

export default function ActivityTab({ event }) {
  const items = [...event.activity].reverse();
  return (
    <ol style={{ listStyle: 'none', margin: 0, padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
      {items.map((a, i) => (
        <li key={i} style={{ display: 'grid', gridTemplateColumns: '14px 1fr auto', gap: 14, position: 'relative', alignItems: 'start' }}>
          {i < items.length - 1 && <span style={{ position: 'absolute', left: 6, top: 18, bottom: -16, width: 2, background: colors.border }} />}
          <span style={{ width: 14, height: 14, marginTop: 4, borderRadius: '50%', background: status[a.tone]?.color ?? colors.steel, boxShadow: `0 0 0 4px ${status[a.tone]?.bg ?? colors.steel50}`, position: 'relative' }} />
          <span style={{ ...text.body, color: colors.textPrimary }}>{a.text}</span>
          <span style={{ ...text.caption, whiteSpace: 'nowrap' }}>{formatDateTime(a.at)}</span>
        </li>
      ))}
    </ol>
  );
}
