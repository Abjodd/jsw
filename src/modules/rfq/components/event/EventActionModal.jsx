import { useState } from 'react';
import { CircleStop, Pause, Play, XCircle } from 'lucide-react';
import { Button, Field, Modal, Textarea, useToast } from '@/components/ui';
import { text } from '@/theme/theme';
import { cancelEvent, endEvent, pauseEvent, resumeEvent } from '../../data/rfqStore';

const CONFIG = {
  pause: { icon: Pause, title: 'Pause RFQ', body: 'Suppliers can’t submit or revise bids while paused. The remaining time is held and restored when you resume.', cta: 'Pause RFQ', run: pauseEvent, toast: 'RFQ paused', tone: 'warning' },
  resume: { icon: Play, title: 'Resume RFQ', body: 'The bid window reopens with the time that was remaining when it was paused.', cta: 'Resume RFQ', run: resumeEvent, toast: 'RFQ resumed', tone: 'success' },
  end: { icon: CircleStop, title: 'End RFQ now', body: 'Closes the bid window immediately. Bids already received are kept for evaluation; pending suppliers can no longer respond.', cta: 'End RFQ', run: endEvent, toast: 'RFQ ended', tone: 'success' },
  cancel: { icon: XCircle, title: 'Cancel RFQ', body: 'Cancels the event for all suppliers and discards received bids. This can’t be undone.', cta: 'Cancel RFQ', run: cancelEvent, toast: 'RFQ cancelled', tone: 'error', danger: true, needsReason: true },
};

export default function EventActionModal({ action, event, onClose }) {
  const { toast } = useToast();
  const [reason, setReason] = useState('');
  if (!action) return null;
  const c = CONFIG[action];
  const Icon = c.icon;
  const confirm = () => {
    c.run(event.eventId, reason.trim());
    toast({ title: c.toast, description: `Event ${event.eventId}`, tone: c.tone });
    setReason('');
    onClose();
  };
  return (
    <Modal
      open
      onClose={onClose}
      icon={<Icon size={20} />}
      title={c.title}
      subtitle={`${event.eventId} · ${event.subject}`}
      width={520}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Keep as is</Button>
          <Button variant={c.danger ? 'dangerSolid' : 'primary'} disabled={c.needsReason && reason.trim().length < 5} onClick={confirm}>{c.cta}</Button>
        </>
      }
    >
      <p style={{ ...text.body, margin: 0 }}>{c.body}</p>
      {c.needsReason && (
        <Field label="Reason for cancellation" required style={{ marginTop: 18 }}>
          <Textarea value={reason} onChange={setReason} rows={3} placeholder="Visible to suppliers" />
        </Field>
      )}
    </Modal>
  );
}
