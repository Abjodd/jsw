import { MessageSquarePlus } from 'lucide-react';
import { Avatar, Button } from '@/components/ui';
import { colors, radius, text } from '@/theme/theme';
import { formatDateTime } from '@/utils/format';

export default function RemarksTab({ po, onAdd }) {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={text.caption}>{po.remarks.length} remark{po.remarks.length === 1 ? '' : 's'} on this PO</span>
        <Button size="sm" icon={<MessageSquarePlus size={15} />} onClick={onAdd}>Add remark</Button>
      </div>
      {!po.remarks.length && <p style={{ ...text.body, color: colors.textSecondary, margin: 0 }}>No remarks yet.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[...po.remarks].reverse().map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 12 }}>
            <Avatar name={r.by} size={34} />
            <div style={{ flex: 1, padding: '12px 16px', borderRadius: `4px ${radius.lg}px ${radius.lg}px ${radius.lg}px`, background: colors.bgSubtle, border: `1px solid ${colors.border}` }}>
              <div style={{ ...text.caption, display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: colors.textPrimary }}>{r.by}</strong>{formatDateTime(r.at)}</div>
              <div style={{ ...text.body, marginTop: 4, color: colors.textPrimary }}>{r.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
