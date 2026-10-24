import { useState } from 'react';
import useHover from '@/hooks/useHover';
import { colors, radius, text, transition } from '@/theme/theme';

/** Shared look for every text-like control (Input, Select, Textarea). */
export const controlStyle = ({ focused, hovered, error, disabled, readOnly, size = 'md' }) => ({
  ...text.input,
  width: '100%',
  height: size === 'sm' ? 34 : 40,
  padding: '0 12px',
  color: colors.textPrimary,
  background: disabled || readOnly ? colors.bgSubtle : colors.bgCard,
  border: `1px solid ${error ? '#C44747' : focused ? colors.steel : hovered && !disabled ? colors.borderStrong : colors.border}`,
  borderRadius: radius.md,
  outline: 'none',
  boxShadow: focused ? '0 0 0 4px rgba(71, 125, 165, 0.15)' : 'none',
  transition,
  cursor: disabled ? 'not-allowed' : undefined,
});

/**
 * <Input value onChange={(v)=>...} icon={<Search size={16}/>} suffix="₹" size="sm|md" type="text|date|number|datetime-local" />
 * onChange receives the VALUE (not the event).
 */
export default function Input({ value, onChange, icon, suffix, size = 'md', error, style, inputStyle, disabled, readOnly, ...rest }) {
  const [focused, setFocused] = useState(false);
  const [hovered, hoverProps] = useHover();
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', ...style }} {...hoverProps}>
      {icon && <span style={{ position: 'absolute', left: 12, display: 'flex', color: colors.textDisabled, pointerEvents: 'none' }}>{icon}</span>}
      <input
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        readOnly={readOnly}
        {...rest}
        style={{
          ...controlStyle({ focused: focused && !readOnly, hovered, error, disabled, readOnly, size }),
          paddingLeft: icon ? 36 : 12,
          paddingRight: suffix ? 36 : 12,
          ...inputStyle,
        }}
      />
      {suffix && <span style={{ position: 'absolute', right: 12, ...text.caption, pointerEvents: 'none' }}>{suffix}</span>}
    </div>
  );
}
