import { useEffect, useState } from 'react';
import { RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, card, colors, radius, text } from '@/theme/theme';
import Button from './Button';
import Field from './Field';
import Input from './Input';
import Select from './Select';

/**
 * Collapsible filter panel with "applied filter" chips.
 *
 * fields: [{ key, label, type: 'text'|'select'|'date', options?, required?, placeholder? }]
 * values: currently APPLIED values (object)
 * onApply(nextValues) — called on Apply, on chip removal and on Reset (with `defaults`)
 */
export default function FilterBar({ fields, values, defaults = {}, onApply, primaryCount = 4, title = 'Filters' }) {
  const isMobile = useMediaQuery(bp.mobile);
  const [draft, setDraft] = useState(values);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => setDraft(values), [values]);

  const visible = expanded ? fields : fields.slice(0, primaryCount);
  const hiddenActive = fields.slice(primaryCount).filter((f) => values[f.key]).length;
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));
  const missingRequired = fields.some((f) => f.required && !draft[f.key]);

  const chips = fields
    .filter((f) => values[f.key] && !f.required)
    .map((f) => ({ key: f.key, label: f.label, value: f.options?.find?.((o) => (o.value ?? o) === values[f.key])?.label ?? values[f.key] }));

  return (
    <section style={{ ...card, padding: 0, marginBottom: 20 }}>
      <div style={{ padding: isMobile ? 16 : '18px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? 140 : 190}px, 1fr))`, gap: 14 }}>
          {visible.map((f) => (
            <Field key={f.key} label={f.label} required={f.required}>
              {f.type === 'select' ? (
                <Select value={draft[f.key]} onChange={(v) => set(f.key, v)} options={f.options} placeholder={f.placeholder ?? 'All'} />
              ) : (
                <Input
                  type={f.type === 'date' ? 'date' : 'text'}
                  value={draft[f.key]}
                  onChange={(v) => set(f.key, v)}
                  placeholder={f.placeholder}
                  onKeyDown={(e) => e.key === 'Enter' && !missingRequired && onApply(draft)}
                />
              )}
            </Field>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
          {fields.length > primaryCount && (
            <Button variant="ghost" size="sm" icon={<SlidersHorizontal size={15} />} onClick={() => setExpanded((e) => !e)}>
              {expanded ? 'Fewer filters' : `More filters${hiddenActive ? ` (${hiddenActive})` : ''}`}
            </Button>
          )}
          <div style={{ flex: 1 }} />
          <Button variant="ghost" size="sm" icon={<RotateCcw size={14} />} onClick={() => onApply(defaults)}>Reset</Button>
          <Button size="sm" onClick={() => onApply(draft)} disabled={missingRequired} style={{ minWidth: 88 }}>Apply</Button>
        </div>
      </div>

      {chips.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, padding: '10px 20px', borderTop: `1px solid ${colors.border}`, background: colors.bgSubtle, borderRadius: `0 0 ${radius.lg}px ${radius.lg}px` }}>
          <span style={text.caption}>{title}:</span>
          {chips.map((c) => (
            <span
              key={c.key}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, height: 26, padding: '0 6px 0 10px', borderRadius: 999,
                background: colors.bgCard, border: `1px solid ${colors.border}`, fontSize: 12, color: colors.textPrimary,
              }}
            >
              <span style={{ color: colors.textSecondary }}>{c.label}:</span>
              <strong style={{ fontWeight: 600 }}>{c.value}</strong>
              <button
                aria-label={`Remove ${c.label}`}
                onClick={() => onApply({ ...values, [c.key]: '' })}
                style={{ border: 0, background: colors.bgPage, width: 18, height: 18, borderRadius: '50%', display: 'grid', placeItems: 'center', cursor: 'pointer', color: colors.textSecondary }}
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
