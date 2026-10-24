import { Repeat } from 'lucide-react';
import { Button, Modal, Tag, useToast } from '@/components/ui';
import { colors, radius, status, text } from '@/theme/theme';
import { processRepeatOrder } from '../../data/prStore';
import SelectedLines from '../SelectedLines';

export default function RepeatOrderModal({ open, onClose, lines, onDone }) {
  const { toast } = useToast();
  const eligible = lines.filter((l) => l.lastPoNo && l.rfqStatus === 'RFQ Pending');
  const skipped = lines.length - eligible.length;

  const confirm = () => {
    processRepeatOrder(eligible.map((l) => l.id));
    toast({ title: 'Repeat order processed', description: `${eligible.length} line${eligible.length > 1 ? 's' : ''} sent for PO creation` });
    onDone?.();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      width={620}
      icon={<Repeat size={20} />}
      title="Process repeat order"
      subtitle="Re-uses the price, vendor and terms of the last purchase order."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button disabled={!eligible.length} onClick={confirm}>Process {eligible.length} line{eligible.length !== 1 ? 's' : ''}</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SelectedLines
          lines={lines}
          max={6}
          extra={(l) =>
            l.lastPoNo && l.rfqStatus === 'RFQ Pending' ? (
              <span style={{ textAlign: 'right' }}>
                <span style={{ ...text.body, fontWeight: 600, display: 'block' }}>PO {l.lastPoNo}</span>
                <span style={text.caption}>Vendor {l.lastPoVendor}</span>
              </span>
            ) : (
              <Tag tone="warning" size="sm">{l.lastPoNo ? l.rfqStatus : 'No previous PO'}</Tag>
            )
          }
        />
        {skipped > 0 && (
          <div style={{ ...text.body, padding: '10px 14px', borderRadius: radius.md, background: status.warning.bg, color: colors.textPrimary }}>
            {skipped} line{skipped > 1 ? 's' : ''} will be skipped (no previous PO or already processed).
          </div>
        )}
      </div>
    </Modal>
  );
}
