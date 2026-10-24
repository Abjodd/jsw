import { useState } from 'react';
import useHover from '@/hooks/useHover';
import { colors, radius, status, text, transition } from '@/theme/theme';

/**
 * <FormField label="Email" icon={<Mail size={18}/>} hint="..." error="..." right={<a/>} endAdornment={<button/>} {...inputProps} />
 */
export default function FormField({ label, icon, hint, error, id, right, endAdornment, style, ...inputProps }) {
  const fieldId = id || inputProps.name;
  const [focused, setFocused] = useState(false);
  const [hovered, hoverProps] = useHover();

  const borderColor = error ? status.error.color : focused ? colors.steel : hovered ? colors.borderStrong : colors.border;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label htmlFor={fieldId} style={text.label}>{label}</label>
          {right}
        </div>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} {...hoverProps}>
        {icon && (
          <span style={{ position: 'absolute', left: 14, display: 'flex', color: colors.textDisabled, pointerEvents: 'none' }}>{icon}</span>
        )}
        <input
          id={fieldId}
          {...inputProps}
          onFocus={(e) => { setFocused(true); inputProps.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); inputProps.onBlur?.(e); }}
          style={{
            ...text.input,
            width: '100%', height: 44,
            paddingLeft: icon ? 42 : 14, paddingRight: endAdornment ? 44 : 14,
            color: colors.textPrimary, background: colors.bgCard,
            border: `1px solid ${borderColor}`, borderRadius: radius.md, outline: 'none',
            boxShadow: focused ? '0 0 0 4px rgba(71, 125, 165, 0.15)' : 'none',
            transition,
          }}
        />
        {endAdornment && <span style={{ position: 'absolute', right: 6, display: 'flex' }}>{endAdornment}</span>}
      </div>
      {error ? (
        <span style={{ ...text.caption, color: status.error.color }}>{error}</span>
      ) : (
        hint && <span style={text.caption}>{hint}</span>
      )}
    </div>
  );
}
