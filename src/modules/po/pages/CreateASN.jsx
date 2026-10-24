import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Save, Send } from 'lucide-react';
import { Button, Card, EmptyState, Field, Input, PageHeader, useToast } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp } from '@/theme/theme';
import { toISODate } from '@/utils/format';
import ASNDocuments from '../components/asn/ASNDocuments';
import ASNItemsTable from '../components/asn/ASNItemsTable';
import ASNSuccessModal from '../components/asn/ASNSuccessModal';
import ASNSummary from '../components/asn/ASNSummary';
import { vendor } from '../data/mockData';
import { availableForAsn, gstSplit } from '../data/poMath';
import { createAsn, nextAsnNo, poStore } from '../data/poStore';

/**
 * PO › Create ASN (advance shipping notice)
 * Route: /po/:poNumber/asn
 */
export default function CreateASN() {
  const { poNumber } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isLaptop = useMediaQuery(bp.laptop);
  const isMobile = useMediaQuery(bp.mobile);
  const { pos } = poStore.useStore();
  const po = pos.find((p) => p.poNumber === poNumber);

  const [invoice, setInvoice] = useState(() => ({ number: '', date: toISODate(Date.now()), amount: '', contact: po ? vendor(po.vendorCode).contact : '', vehicle: '', transporter: '' }));
  const [qty, setQty] = useState({});
  const [docs, setDocs] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [created, setCreated] = useState(null);

  if (!po) return <Card><EmptyState title="Purchase order not found" /><p style={{ textAlign: 'center' }}><Link to="/po">Back</Link></p></Card>;

  const v = vendor(po.vendorCode);
  const intraState = v.state === po.plant.state;
  const set = (k) => (val) => setInvoice((x) => ({ ...x, [k]: val }));
  const lines = po.items.filter((i) => Number(qty[i.itemNo]) > 0);
  const overLimit = po.items.some((i) => Number(qty[i.itemNo]) > availableForAsn(i));
  const value = lines.reduce((s, i) => {
    const t = Number(qty[i.itemNo]) * i.netPrice;
    const g = gstSplit(t, i.gstRate, intraState);
    return s + t + g.igst + g.cgst + g.sgst;
  }, 0);

  const errors = {
    number: !invoice.number.trim() && 'Invoice number is required',
    date: !invoice.date && 'Invoice date is required',
    amount: !(Number(invoice.amount) > 0) && 'Invoice amount is required',
    contact: !/^[+\d\s-]{8,}$/.test(invoice.contact) && 'Enter a valid contact number',
  };
  const checks = [
    { label: 'Invoice details', ok: !Object.values(errors).some(Boolean) },
    { label: 'At least one item with ASN quantity', ok: lines.length > 0 && !overLimit },
    { label: 'Invoice document uploaded', ok: !!docs.invoice },
  ];
  const err = (k) => (showErrors ? errors[k] : undefined);

  const submit = () => {
    if (checks.some((c) => !c.ok)) {
      setShowErrors(true);
      toast({ title: 'ASN incomplete', description: checks.filter((c) => !c.ok).map((c) => c.label).join(' · '), tone: 'error' });
      return;
    }
    const asn = {
      asnNo: nextAsnNo(), invoiceNo: invoice.number.trim(), invoiceDate: invoice.date, value,
      lines: lines.map((i) => ({ itemNo: i.itemNo, qty: Number(qty[i.itemNo]) })), documents: docs,
      vehicle: invoice.vehicle, transporter: invoice.transporter, contact: invoice.contact,
    };
    createAsn(po.poNumber, asn, user?.name);
    setCreated(asn);
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'PO', to: '/po' }, { label: `PO ${po.poNumber}`, to: `/po/${po.poNumber}` }, { label: 'Create ASN' }]}
        title="Create ASN"
        subtitle={`Advance shipping notice for PO ${po.poNumber} · ${v.name} → ${po.plant.code} ${po.plant.name}`}
        actions={
          <>
            <Button variant="secondary" icon={<Save size={16} />} onClick={() => toast({ title: 'Draft saved', tone: 'info' })}>Save draft</Button>
            <Button icon={<Send size={16} />} onClick={submit}>Submit ASN</Button>
          </>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: isLaptop ? '1fr' : 'minmax(0, 1fr) 340px', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          <Card title="Invoice details" subtitle="As printed on the supplier's tax invoice.">
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 1 : 3}, minmax(0, 1fr))`, gap: 16 }}>
              <Field label="Invoice number" required error={err('number')}><Input value={invoice.number} onChange={set('number')} placeholder="e.g. FTF/26-27/0391" error={!!err('number')} /></Field>
              <Field label="Invoice date" required error={err('date')}><Input type="date" value={invoice.date} onChange={set('date')} error={!!err('date')} /></Field>
              <Field label="Invoice amount (incl. GST)" required error={err('amount')}><Input type="number" min="0" value={invoice.amount} onChange={set('amount')} icon={<span style={{ fontSize: 13 }}>₹</span>} placeholder="0.00" error={!!err('amount')} /></Field>
              <Field label="Supplier contact no." required error={err('contact')}><Input value={invoice.contact} onChange={set('contact')} error={!!err('contact')} /></Field>
              <Field label="Vehicle no."><Input value={invoice.vehicle} onChange={set('vehicle')} placeholder="e.g. GJ 03 AB 1234" /></Field>
              <Field label="Transporter / LR no."><Input value={invoice.transporter} onChange={set('transporter')} placeholder="Optional" /></Field>
            </div>
          </Card>

          <Card flush title="Items to ship" subtitle="Quantities can't exceed what is still available on each PO line." bodyStyle={{ overflowX: 'visible' }}>
            <ASNItemsTable po={po} qty={qty} setQty={setQty} showErrors={showErrors} />
          </Card>

          <Card flush title="Documents" subtitle="Invoice is mandatory; attach PDI report and MTC where applicable." bodyStyle={{ overflowX: 'visible' }}>
            <ASNDocuments docs={docs} setDocs={setDocs} showErrors={showErrors} />
          </Card>
        </div>

        <ASNSummary po={po} qty={qty} intraState={intraState} invoiceAmount={invoice.amount} checks={checks} />
      </div>

      <ASNSuccessModal asn={created} poNumber={po.poNumber} onViewPo={() => navigate(`/po/${po.poNumber}`)} onBack={() => navigate('/po')} />
    </>
  );
}
