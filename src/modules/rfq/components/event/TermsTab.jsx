import { colors, text } from '@/theme/theme';
import { Tag } from '@/components/ui';
import { DEFAULT_TERMS, TERMS_FIELDS } from '../../data/constants';

export default function TermsTab({ event }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1fr) 2fr', padding: '10px 20px', background: colors.bgSubtle, borderBottom: `1px solid ${colors.border}` }}>
        {['Commercial term', 'JSW terms for this RFQ'].map((h) => <span key={h} style={{ ...text.tableHead, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</span>)}
      </div>
      {TERMS_FIELDS.map((f) => {
        const v = event.terms[f.key];
        const edited = v !== DEFAULT_TERMS[f.key];
        return (
          <div key={f.key} style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1fr) 2fr', alignItems: 'center', padding: '14px 20px', borderBottom: `1px solid ${colors.border}` }}>
            <span style={{ ...text.body, color: colors.textSecondary }}>{f.label}</span>
            <span style={{ ...text.body, fontWeight: 500, color: v === 'NA' ? colors.textDisabled : colors.textPrimary, display: 'flex', gap: 8, alignItems: 'center' }}>
              {v || '—'} {edited && <Tag size="sm" tone="steel">Non-standard</Tag>}
            </span>
          </div>
        );
      })}
    </div>
  );
}
