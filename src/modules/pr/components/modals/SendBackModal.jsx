import { useState } from 'react';
import { CornerUpLeft } from 'lucide-react';
import { Button, Field, Modal, Select, Textarea, useToast } from '@/components/ui';
import { SEND_BACK_REASONS } from '../../data/constants';
import { sendBackToUser } from '../../data/prStore';
import SelectedLines from '../SelectedLines';

export default function SendBackModal({ open, onClose, lines, onDone }) {
  const { toast } = useToast();
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const requisitioners = [...new Set(lines.map((l) => l.requisitioner))].join(', ');

  const confirm = () => {
    sendBackToUser(lines.map((l) => l.id), reason, comment.trim());
    toast({ title: 'Sent back to requisitioner', description: `${requisitioners} will be notified`, tone: 'warning' });
    setReason(''); setComment('');
    onDone?.();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon={<CornerUpLeft size={20} />}
      title="Send back to user"
      subtitle={`Returns the line${lines.length > 1 ? 's' : ''} to ${requisitioners} for correction.`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="dangerSolid" disabled={!reason || (reason === 'Other' && !comment.trim())} onClick={confirm}>Send back</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <SelectedLines lines={lines} max={3} />
        <Field label="Reason" required>
          <Select value={reason} onChange={setReason} options={SEND_BACK_REASONS} placeholder="Select a reason" />
        </Field>
        <Field label="Comments" required={reason === 'Other'} hint="Be specific so the requisitioner can fix it in one go.">
          <Textarea value={comment} onChange={setComment} rows={3} placeholder="What needs to change?" />
        </Field>
      </div>
    </Modal>
  );
}
