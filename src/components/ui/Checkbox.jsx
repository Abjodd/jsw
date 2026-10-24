import { Check, Minus } from 'lucide-react';
import { colors, transition } from '@/theme/theme';

/** <Checkbox checked indeterminate onChange={(next)=>...} label="Visible label" ariaLabel="Screen-reader only" /> */
export default function Checkbox({ checked, indeterminate, onChange, label, ariaLabel, disabled, size = 18 }) {
  const on = checked || indeterminate;
  return (
    <span
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : !!checked}
      aria-label={ariaLabel ?? (typeof label === 'string' ? label : undefined)}
      tabIndex={disabled ? -1 : 0}
      onClick={(e) => { e.stopPropagation(); if (!disabled) onChange?.(!checked); }}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!disabled) onChange?.(!checked); } }}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, userSelect: 'none' }}
    >
      <span
        style={{
          width: size, height: size, borderRadius: 5, flexShrink: 0, display: 'grid', placeItems: 'center', transition,
          background: on ? colors.navy : colors.bgCard, border: `1.5px solid ${on ? colors.navy : '#B9C2CC'}`, color: colors.white,
        }}
      >
        {indeterminate ? <Minus size={size - 6} strokeWidth={3} /> : checked ? <Check size={size - 6} strokeWidth={3} /> : null}
      </span>
      {label && typeof label !== 'string' ? label : label && <span style={{ fontSize: 14, color: colors.textPrimary }}>{label}</span>}
    </span>
  );
}
