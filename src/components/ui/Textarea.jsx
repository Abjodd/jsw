import { useState } from 'react';
import useHover from '@/hooks/useHover';
import { controlStyle } from './Input';

/** <Textarea value onChange={(v)=>...} rows={4} /> */
export default function Textarea({ value, onChange, rows = 4, error, style, ...rest }) {
  const [focused, setFocused] = useState(false);
  const [hovered, hoverProps] = useHover();
  return (
    <textarea
      {...hoverProps}
      value={value ?? ''}
      onChange={(e) => onChange?.(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      rows={rows}
      {...rest}
      style={{ ...controlStyle({ focused, hovered, error }), height: 'auto', padding: '10px 12px', resize: 'vertical', ...style }}
    />
  );
}
