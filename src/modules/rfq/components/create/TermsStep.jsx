import { RotateCcw } from 'lucide-react';
import { Button, Input, Select, Tag } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors, text } from '@/theme/theme';
import { DEFAULT_TERMS, TERMS_FIELDS } from '../../data/constants';

/** Step 3 — commercial terms, pre-filled with the JSW standard. */
export default function TermsStep({ terms, setTerms, showErrors }) {
  const isMobile = useMediaQuery(bp.mobile);
  const edited = TERMS_FIELDS.filter((f) => terms[f.key] !== DEFAULT_TERMS[f.key]).length;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 20px', background: colors.bgSubtle, borderBottom: `1px solid ${colors.border}` }}>
        <span style={text.caption}>{edited ? `${edited} term${edited > 1 ? 's' : ''} differ from the JSW standard` : 'All terms match the JSW standard'}</span>
        <Button variant="ghost" size="sm" icon={<RotateCcw size={14} />} disabled={!edited} onClick={() => setTerms(DEFAULT_TERMS)}>Reset to standard</Button>
      </div>
      {TERMS_FIELDS.map((f) => {
        const v = terms[f.key];
        const changed = v !== DEFAULT_TERMS[f.key];
        const set = (val) => setTerms((t) => ({ ...t, [f.key]: val }));
        const error = showErrors && f.required && !v;
        return (
          <div
            key={f.key}
            style={{
              display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(200px, 1fr) minmax(0, 1.6fr)', gap: isMobile ? 6 : 20,
              alignItems: 'center', padding: '12px 20px', borderBottom: `1px solid ${colors.border}`,
              boxShadow: changed ? `inset 3px 0 0 ${colors.steel}` : 'none',
            }}
          >
            <span style={{ ...text.label, display: 'flex', alignItems: 'center', gap: 8 }}>
              {f.label}{f.required && <span style={{ color: '#C44747' }}>*</span>}
              {changed && <Tag size="sm" tone="steel">Edited</Tag>}
            </span>
            {f.type === 'select' ? (
              <Select value={v} onChange={set} options={f.options} placeholder="Select" error={error} />
            ) : (
              <Input value={v} onChange={set} placeholder={f.placeholder ?? 'NA'} error={error} />
            )}
          </div>
        );
      })}
    </div>
  );
}
