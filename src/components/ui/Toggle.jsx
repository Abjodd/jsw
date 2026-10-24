import { colors, text, transition } from '@/theme/theme';

/** <Toggle checked onChange={(next)=>...} label="Technical evaluation required" /> */
export default function Toggle({ checked, onChange, label, description, disabled }) {
  return (
    <span
      role="switch"
      aria-checked={!!checked}
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && onChange?.(!checked)}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!disabled) onChange?.(!checked); } }}
      style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 12, cursor: disabled ? 'not-allowed' : 'pointer', userSelect: 'none', opacity: disabled ? 0.5 : 1 }}
    >
      <span style={{ position: 'relative', width: 38, height: 22, flexShrink: 0, borderRadius: 999, transition, background: checked ? colors.steel : '#CBD3DB', marginTop: 1 }}>
        <span style={{ position: 'absolute', top: 3, left: checked ? 19 : 3, width: 16, height: 16, borderRadius: '50%', background: colors.white, boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition }} />
      </span>
      {(label || description) && (
        <span style={{ display: 'flex', flexDirection: 'column' }}>
          {label && <span style={text.label}>{label}</span>}
          {description && <span style={text.caption}>{description}</span>}
        </span>
      )}
    </span>
  );
}
