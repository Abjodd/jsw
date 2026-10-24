import { useState } from 'react';
import { CheckCheck } from 'lucide-react';
import { Button, Checkbox, DescriptionList, Modal, useToast } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { formatDate, formatINR } from '@/utils/format';
import { vendor } from '../../data/mockData';
import { poTotal } from '../../data/poMath';
import { acknowledgePO } from '../../data/poStore';

export default function AcknowledgeModal({ po, onClose }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ok, setOk] = useState(false);
  const first = [...po.items].sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate))[0];
  return (
    <Modal
      open
      onClose={onClose}
      icon={<CheckCheck size={20} />}
      title="Acknowledge purchase order"
      subtitle={`PO ${po.poNumber} · ${vendor(po.vendorCode).name}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button disabled={!ok} onClick={() => { acknowledgePO(po.poNumber, user?.name); toast({ title: 'PO acknowledged', description: po.poNumber }); onClose(); }}>Acknowledge</Button>
        </>
      }
    >
      <DescriptionList columns={2} items={[
        { label: 'Line items', value: po.items.length }, { label: 'PO value (incl. GST)', value: formatINR(poTotal(po), 2) },
        { label: 'First delivery due', value: formatDate(first.deliveryDate) }, { label: 'Payment terms', value: po.paymentTerms },
      ]} />
      <div style={{ marginTop: 20 }}>
        <Checkbox checked={ok} onChange={setOk} label="I confirm quantities, prices and delivery dates for all items." />
      </div>
    </Modal>
  );
}
