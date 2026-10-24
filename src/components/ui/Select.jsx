import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import useHover from '@/hooks/useHover';
import { colors } from '@/theme/theme';
import { controlStyle } from './Input';

/**
 * <Select value onChange={(v)=>...} options={['A','B'] | [{value,label}]} placeholder="All" size="sm|md" />
 */
export default function Select({ value, onChange, options = [], placeholder, size = 'md', error, disabled, style, ...rest }) {
  const [focused, setFocused] = useState(false);
  const [hovered, hoverProps] = useHover();
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', ...style }} {...hoverProps}>
      <select
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        {...rest}
        style={{
          ...controlStyle({ focused, hovered, error, disabled, size }),
          appearance: 'none', WebkitAppearance: 'none', paddingRight: 34, cursor: disabled ? 'not-allowed' : 'pointer',
          color: value ? colors.textPrimary : colors.textDisabled,
        }}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {opts.map((o) => (
          <option key={o.value} value={o.value} style={{ color: colors.textPrimary }}>{o.label}</option>
        ))}
      </select>
      <ChevronDown size={16} color={colors.textSecondary} style={{ position: 'absolute', right: 12, pointerEvents: 'none' }} />
    </div>
  );
}
