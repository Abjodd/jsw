import { useState } from 'react';
import { MessageSquareText } from 'lucide-react';
import { Avatar, Button, Modal, Textarea, useToast } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, status, text } from '@/theme/theme';
import { formatDateTime } from '@/utils/format';
import { REMARKS_LIMIT } from '../data/constants';
import { addRemark } from '../data/poStore';

/** Remark thread for a PO + composer (500 characters). */
export default function RemarksModal({ po, onClose }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [value, setValue] = useState('');
  if (!po) return null;
  const left = REMARKS_LIMIT - value.length;

  const submit = () => {
    addRemark(po.poNumber, value.trim(), user?.name ?? 'You');
    toast({ title: 'Remark added', description: `PO ${po.poNumber}` });
    setValue('');
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      width={580}
      icon={<MessageSquareText size={20} />}
      title={`Remarks · PO ${po.poNumber}`}
      subtitle={`${po.remarks.length} previous remark${po.remarks.length === 1 ? '' : 's'}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button disabled={!value.trim()} onClick={submit}>Submit remark</Button>
        </>
      }
    >
      {po.remarks.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 220, overflowY: 'auto', marginBottom: 20 }}>
          {po.remarks.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 10 }}>
              <Avatar name={r.by} size={30} />
              <div style={{ flex: 1, padding: '10px 14px', borderRadius: `4px ${radius.md}px ${radius.md}px ${radius.md}px`, background: colors.bgSubtle, border: `1px solid ${colors.border}` }}>
                <div style={{ ...text.caption, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <strong style={{ color: colors.textPrimary, fontWeight: 600 }}>{r.by}</strong>{formatDateTime(r.at)}
                </div>
                <div style={{ ...text.body, color: colors.textPrimary, marginTop: 2 }}>{r.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <label style={{ ...text.label, display: 'block', marginBottom: 6 }}>Add a remark</label>
      <Textarea value={value} onChange={(v) => setValue(v.slice(0, REMARKS_LIMIT))} rows={5} placeholder="Type your remarks here…" autoFocus />
      <div style={{ ...text.caption, textAlign: 'right', marginTop: 6, color: left < 50 ? status.warning.color : colors.textSecondary }}>
        {left} characters remaining
      </div>
    </Modal>
  );
}
