import { ExternalLink } from 'lucide-react';
import { Field, Input, Select, Textarea, Toggle } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors, radius, text } from '@/theme/theme';
import { formatDateTime } from '@/utils/format';
import { COMMERCIAL_REVIEWERS, FUNCTION, GENERAL_CATEGORIES } from '../../data/constants';

/** Step 2 — RFQ header details. */
export default function GeneralStep({ general, setGeneral, buyer, opexCapex, showErrors, errors }) {
  const isMobile = useMediaQuery(bp.mobile);
  const isLaptop = useMediaQuery(bp.laptop);
  const cols = isMobile ? 1 : isLaptop ? 2 : 3;
  const set = (k) => (v) => setGeneral((g) => ({ ...g, [k]: v }));
  const err = (k) => (showErrors ? errors[k] : undefined);

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 18 }}>
        <Field label="RFQ subject" required error={err('subject')} style={{ gridColumn: cols > 1 ? 'span 2' : undefined }}>
          <Input value={general.subject} onChange={set('subject')} placeholder="e.g. Conduit pipes — Dolvi O&M" error={!!err('subject')} />
        </Field>
        <Field label="General category" required error={err('category')}>
          <Select value={general.category} onChange={set('category')} options={GENERAL_CATEGORIES} placeholder="Select category" error={!!err('category')} />
        </Field>
        <Field label="RFQ description" required error={err('description')} style={{ gridColumn: `span ${cols}` }}>
          <Textarea value={general.description} onChange={set('description')} rows={3} placeholder="What suppliers should quote for, scope notes, inspection requirements…" error={!!err('description')} />
        </Field>
        <Field label="Commodity" required error={err('commodity')}>
          <Input value={general.commodity} onChange={set('commodity')} placeholder="e.g. 026" error={!!err('commodity')} />
        </Field>
        <Field label="Start date & time" hint="Published on submit">
          <Input value={formatDateTime(general.startAt)} readOnly />
        </Field>
        <Field label="End date & time" required error={err('endAt')}>
          <Input type="datetime-local" value={general.endAt} onChange={set('endAt')} error={!!err('endAt')} />
        </Field>
        <Field label="Buyer"><Input value={buyer} readOnly /></Field>
        <Field label="Commercial reviewer">
          <Select value={general.commercialReviewer} onChange={set('commercialReviewer')} options={COMMERCIAL_REVIEWERS} placeholder="Optional" />
        </Field>
        <Field label="Function"><Input value={FUNCTION} readOnly /></Field>
        <Field label="Base currency"><Input value="INR — Indian Rupee" readOnly /></Field>
        <Field label="OPEX / CAPEX" hint="Taken from the PR lines"><Input value={opexCapex} readOnly /></Field>
        <Field label="GCC terms & conditions">
          <a href="#" onClick={(e) => e.preventDefault()} style={{ ...text.body, height: 40, display: 'inline-flex', alignItems: 'center', gap: 6, color: colors.steel, fontWeight: 500 }}>
            JSW General Conditions of Contract <ExternalLink size={14} />
          </a>
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 16, padding: 18, borderRadius: radius.md, background: colors.bgSubtle, border: `1px solid ${colors.border}` }}>
        <Toggle checked={general.technicalEval} onChange={set('technicalEval')} label="Technical evaluation required" description="Bids go through a technical round before commercials open." />
        <Toggle checked={general.supplierAssessment} onChange={set('supplierAssessment')} label="Supplier assessment required" description="Ask new suppliers for a capability questionnaire." />
        <Toggle checked={general.multiCurrency} onChange={set('multiCurrency')} label="Multi-currency RFQ" description="Allow suppliers to quote in USD / EUR." />
      </div>
    </div>
  );
}
