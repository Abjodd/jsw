import { UserPlus } from 'lucide-react';
import { Avatar } from '@/components/ui';
import { colors, status, text } from '@/theme/theme';

/** Active buyer with avatar; previous buyer as caption; dashed pill when unassigned. */
export default function BuyerCell({ line }) {
  if (!line.activeBuyer) {
    return (
      <span
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 10px', borderRadius: 999,
          border: `1.5px dashed ${status.warning.color}`, color: status.warning.color, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
        }}
      >
        <UserPlus size={13} /> Unassigned
      </span>
    );
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
      <Avatar name={line.activeBuyer} size={30} />
      <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span style={{ ...text.body, fontWeight: 500, color: colors.textPrimary, whiteSpace: 'nowrap' }}>{line.activeBuyer}</span>
        {line.previousBuyer ? (
          <span style={{ ...text.caption, whiteSpace: 'nowrap', color: status.progress.color }}>Re-assigned · prev. {line.previousBuyer.split(' ')[0]}</span>
        ) : line.buyer2 ? (
          <span style={{ ...text.caption, whiteSpace: 'nowrap' }}>+ {line.buyer2}</span>
        ) : null}
      </span>
    </span>
  );
}
