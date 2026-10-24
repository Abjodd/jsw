import { useState } from 'react';
import { FileSignature } from 'lucide-react';
import { Button, Field, Modal, Select, Textarea, useToast } from '@/components/ui';
import { formatINR } from '@/utils/format';
import { NFA_TYPES } from '../../data/constants';
import { raiseDirectNfa } from '../../data/prStore';
import SelectedLines from '../SelectedLines';

export default function DirectNfaModal({ open, onClose, lines, onDone }) {
  const { toast } = useToast();
  const [type, setType] = useState('');
  const [why, setWhy] = useState('');
  const eligible = lines.filter((l) => l.rfqStatus === 'RFQ Pending');
  const total = eligible.reduce((s, l) => s + l.totalValue, 0);

  const confirm = () => {
    raiseDirectNfa(eligible.map((l) => l.id), type);
    toast({ title: 'Direct NFA raised', description: `${eligible.length} line${eligible.length > 1 ? 's' : ''} · ${formatINR(total)} sent for approval` });
    setType(''); setWhy('');
    onDone?.();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon={<FileSignature size={20} />}
      title="Raise direct NFA"
      subtitle="Skip the RFQ and request a Note for Approval directly."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button disabled={!type || why.trim().length < 10 || !eligible.length} onClick={confirm}>Raise NFA</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <SelectedLines lines={eligible} max={3} />
        <Field label="NFA type" required>
          <Select value={type} onChange={setType} options={NFA_TYPES} placeholder="Select NFA type" />
        </Field>
        <Field label="Justification" required hint="Minimum 10 characters.">
          <Textarea value={why} onChange={setWhy} rows={4} placeholder="Why is competitive bidding not possible?" />
        </Field>
      </div>
    </Modal>
  );
}
