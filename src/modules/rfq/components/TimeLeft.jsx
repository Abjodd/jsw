import { colors, status, text } from '@/theme/theme';
import { formatDate, shortDuration } from '@/utils/format';
import useCountdown from '../hooks/useCountdown';

/** "2d 06h left" (live, ticking) · "Paused · 1d 04h" · "Closed 15 Oct 2026" */
export default function TimeLeft({ event }) {
  const live = event.status === 'Live';
  const ms = useCountdown(event.end, live);
  if (event.status === 'Paused') {
    return <span style={{ ...text.body, fontWeight: 600, color: status.warning.color, whiteSpace: 'nowrap' }}>{shortDuration(event.pausedRemaining)} held</span>;
  }
  if (!live) return <span style={{ ...text.caption, whiteSpace: 'nowrap' }}>Ended {formatDate(event.end)}</span>;
  const color = ms < 3600e3 ? status.error.color : ms < 24 * 3600e3 ? status.warning.color : colors.textPrimary;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', ...text.body, fontWeight: 600, color, fontVariantNumeric: 'tabular-nums' }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color === colors.textPrimary ? status.progress.color : color, animation: 'jsw-pulse 1.6s ease-in-out infinite' }} />
      {shortDuration(ms)} left
    </span>
  );
}
