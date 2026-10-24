import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, FileText, Info, ListChecks, Paperclip, Save, Send, Store } from 'lucide-react';
import { Button, Card, PageHeader, Stepper, useToast } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors, text } from '@/theme/theme';
import { toLocalInput } from '@/utils/format';
import { markRfqCreated, prStore } from '@/modules/pr/data/prStore';
import AttachmentsStep from '../components/create/AttachmentsStep';
import GeneralStep from '../components/create/GeneralStep';
import ItemsStep from '../components/create/ItemsStep';
import PRLinePickerModal from '../components/create/PRLinePickerModal';
import SubmitSuccessModal from '../components/create/SubmitSuccessModal';
import SummaryPanel from '../components/create/SummaryPanel';
import TermsStep from '../components/create/TermsStep';
import VendorsStep from '../components/create/VendorsStep';
import { DEFAULT_TERMS, FUNCTION, TERMS_FIELDS } from '../data/constants';
import { itemFromPrLine, vendorByCode } from '../data/mockData';
import { addEvent, nextEventId } from '../data/rfqStore';

/**
 * RFQ › Create RFQ
 * Route: /rfq/create   (PR Buyer Dashboard → "Create RFQ" passes { state: { lineIds } })
 * Five-step wizard: Items → General → Terms → Vendors → Attachments, with live summary.
 */
const STEPS = [
  { key: 'items', label: 'Items', icon: ListChecks, required: true, title: 'Line items', subtitle: 'Quantities and ceiling prices suppliers will quote against.' },
  { key: 'general', label: 'General details', icon: Info, required: true, title: 'RFQ details', subtitle: 'Subject, category and bid window.' },
  { key: 'terms', label: 'Terms & conditions', icon: FileText, required: true, title: 'Commercial terms & conditions', subtitle: 'Pre-filled with the JSW standard — edit only where this RFQ differs.' },
  { key: 'vendors', label: 'Vendors', icon: Store, required: true, title: 'Invite vendors', subtitle: 'Pick suppliers from the vendor master.' },
  { key: 'attachments', label: 'Attachments', icon: Paperclip, required: false, title: 'Attachments', subtitle: 'Drawings, specifications or scope of work.' },
];

const roundHour = (ms) => { const d = new Date(ms); d.setMinutes(0, 0, 0); return d; };

export default function CreateRFQ() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isLaptop = useMediaQuery(bp.laptop);

  const initialLines = useMemo(() => {
    const ids = location.state?.lineIds ?? [];
    return prStore.get().lines.filter((l) => ids.includes(l.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [step, setStep] = useState(0);
  const [visited, setVisited] = useState(new Set([0]));
  const [showErrors, setShowErrors] = useState(false);
  const [picker, setPicker] = useState(false);
  const [created, setCreated] = useState(null);

  const [items, setItems] = useState(() => initialLines.map(itemFromPrLine));
  const [general, setGeneral] = useState(() => ({
    subject: initialLines.length ? `${initialLines[0].materialDesc}${initialLines.length > 1 ? ` + ${initialLines.length - 1} more` : ''} — ${initialLines[0].city}` : '',
    description: '', category: 'Asset Management', commodity: '026',
    startAt: new Date().toISOString(), endAt: toLocalInput(roundHour(Date.now() + 4 * 86400000)),
    commercialReviewer: '', technicalEval: false, supplierAssessment: false, multiCurrency: false,
  }));
  const [terms, setTerms] = useState(DEFAULT_TERMS);
  const [vendorCodes, setVendorCodes] = useState([]);
  const [attachments, setAttachments] = useState([{ id: 'a1', spec: 'Drawings', file: null, sendToSupplier: false }]);

  const buyer = initialLines[0]?.activeBuyer || 'Deepak Kumar Jha';
  const opexCapex = [...new Set(items.map((i) => prStore.get().lines.find((l) => l.id === i.id)?.opexCapex).filter(Boolean))].join(' / ') || 'Opex';

  const generalErrors = {
    subject: !general.subject.trim() && 'Subject is required',
    description: !general.description.trim() && 'Description is required',
    category: !general.category && 'Pick a category',
    commodity: !general.commodity.trim() && 'Commodity is required',
    endAt: (!general.endAt || new Date(general.endAt) <= new Date()) && 'End must be in the future',
  };
  const validity = {
    items: items.length > 0 && items.every((i) => Number(i.qty) > 0),
    general: !Object.values(generalErrors).some(Boolean),
    terms: TERMS_FIELDS.filter((f) => f.required).every((f) => terms[f.key]),
    vendors: vendorCodes.length > 0,
    attachments: attachments.some((a) => a.file),
  };
  const states = Object.fromEntries(STEPS.map((s, i) => [s.key, visited.has(i) && i !== step ? (validity[s.key] ? 'done' : s.required && showErrors ? 'error' : undefined) : undefined]));

  const go = (i) => { setStep(i); setVisited((v) => new Set(v).add(i)); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const submit = () => {
    const firstBad = STEPS.findIndex((s) => s.required && !validity[s.key]);
    if (firstBad >= 0) {
      setShowErrors(true);
      setVisited(new Set(STEPS.map((_, i) => i)));
      go(firstBad);
      toast({ title: 'A few things are missing', description: `Complete “${STEPS[firstBad].label}” to submit.`, tone: 'error' });
      return;
    }
    const eventId = nextEventId();
    const now = new Date().toISOString();
    const event = {
      eventId, rfqId: `${eventId}_R01`, round: 'R01', subject: general.subject.trim(), description: general.description.trim(), status: 'Live',
      start: now, end: new Date(general.endAt).toISOString(), buyer, function: FUNCTION, category: general.category, commodity: general.commodity,
      assetClass: opexCapex, currency: 'INR', commercialReviewer: general.commercialReviewer, technicalEvaluator: general.technicalEval ? 'To be assigned' : '',
      supplierAssessmentEvaluator: general.supplierAssessment ? 'To be assigned' : '', activeDelegatee: '', previousDelegatee: '',
      items: items.map((i) => ({ ...i, qty: Number(i.qty), ceilingPrice: Number(i.ceilingPrice) || 0 })), terms,
      vendors: vendorCodes.map((code, n) => ({ code, vendorStatus: 'Created', bidStatus: 'Not Submitted', quotationId: String(21300 + Number(eventId.slice(-3)) * 10 + n).padStart(10, '0') })),
      attachments: attachments.filter((a) => a.file).map((a) => ({ spec: a.spec, name: a.file.name, size: a.file.size, sendToSupplier: a.sendToSupplier })),
      prAttachments: [],
      activity: [
        { at: now, text: `RFQ created by ${buyer} from ${items.length} PR line${items.length > 1 ? 's' : ''}`, tone: 'inactive' },
        { at: now, text: `RFQ published to ${vendorCodes.length} vendors: ${vendorCodes.map((c) => vendorByCode(c).name).join(', ')}`, tone: 'progress' },
      ],
    };
    addEvent(event);
    markRfqCreated(items.map((i) => i.id), eventId);
    setCreated(event);
  };

  const current = STEPS[step];
  const stepProps = { showErrors };
  const content = {
    items: <ItemsStep items={items} setItems={setItems} onAddLines={() => setPicker(true)} {...stepProps} />,
    general: <GeneralStep general={general} setGeneral={setGeneral} buyer={buyer} opexCapex={opexCapex} errors={generalErrors} {...stepProps} />,
    terms: <TermsStep terms={terms} setTerms={setTerms} {...stepProps} />,
    vendors: <VendorsStep vendorCodes={vendorCodes} setVendorCodes={setVendorCodes} {...stepProps} />,
    attachments: <AttachmentsStep rows={attachments} setRows={setAttachments} />,
  }[current.key];

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'RFQ', to: '/rfq' }, { label: 'Create RFQ' }]}
        title="Create RFQ"
        subtitle={initialLines.length ? `Started from ${initialLines.length} PR line${initialLines.length > 1 ? 's' : ''} in ${buyer}’s queue.` : 'Build a request for quotation from released PR lines.'}
        actions={
          <>
            <Button variant="secondary" icon={<Save size={16} />} onClick={() => toast({ title: 'Draft saved', description: 'You can resume from RFQ › Drafts.', tone: 'info' })}>Save draft</Button>
            <Button icon={<Send size={16} />} onClick={submit}>Submit RFQ</Button>
          </>
        }
      />

      <Card style={{ marginBottom: 20 }} bodyStyle={{ padding: '16px 20px' }}>
        <Stepper steps={STEPS} current={step} states={states} onChange={go} />
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: isLaptop ? '1fr' : 'minmax(0, 1fr) 320px', gap: 20, alignItems: 'start' }}>
        <Card
          flush
          title={current.title}
          subtitle={current.subtitle}
          bodyStyle={{ overflowX: 'visible' }}
          actions={<span style={{ ...text.caption, whiteSpace: 'nowrap' }}>Step {step + 1} of {STEPS.length}</span>}
        >
          <div key={current.key} style={{ animation: 'jsw-fade 200ms ease both' }}>{content}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '16px 20px', borderTop: `1px solid ${colors.border}`, background: colors.bgSubtle, borderRadius: '0 0 14px 14px' }}>
            <Button variant="secondary" icon={<ArrowLeft size={16} />} disabled={step === 0} onClick={() => go(step - 1)}>Back</Button>
            {step < STEPS.length - 1 ? (
              <Button iconRight={<ArrowRight size={16} />} onClick={() => go(step + 1)}>Continue to {STEPS[step + 1].label.toLowerCase()}</Button>
            ) : (
              <Button icon={<Send size={16} />} onClick={submit}>Submit RFQ</Button>
            )}
          </div>
        </Card>

        <SummaryPanel general={general} items={items} vendorCodes={vendorCodes} attachments={attachments} steps={STEPS} validity={validity} onJump={go} showErrors={showErrors} />
      </div>

      <PRLinePickerModal
        open={picker}
        onClose={() => setPicker(false)}
        excludeIds={items.map((i) => i.id)}
        onAdd={(lines) => {
          setItems((xs) => [...xs, ...lines.map(itemFromPrLine)].map((it, n) => ({ ...it, lineItem: String((n + 1) * 10).padStart(5, '0') })));
          setPicker(false);
          toast({ title: `${lines.length} line${lines.length > 1 ? 's' : ''} added` });
        }}
      />

      <SubmitSuccessModal
        event={created}
        onOpenEvent={() => navigate(`/rfq/events/${created.eventId}`)}
        onBackToQueue={() => navigate('/pr/buyer')}
      />
    </>
  );
}
