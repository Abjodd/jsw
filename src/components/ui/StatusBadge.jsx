import { radius, status as STATUS, text } from '@/theme/theme';

/**
 * Standard status pill. Use ONLY these statuses across modules:
 * success (Completed) | progress (In Progress / Active) | warning (Pending) | error (Overdue) | inactive
 */
export default function StatusBadge({ status = 'inactive', children }) {
  const s = STATUS[status] ?? STATUS.inactive;
  return (
    <span
      style={{
        ...text.caption, fontWeight: 500,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: 24, padding: '0 10px', borderRadius: radius.pill, whiteSpace: 'nowrap',
        color: s.color, background: s.bg,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
      {children ?? s.label}
    </span>
  );
}
