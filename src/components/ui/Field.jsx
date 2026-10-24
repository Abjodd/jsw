import { text } from '@/theme/theme';

/** Label + control wrapper for forms. <Field label="Subject" required hint="..." error="...">{control}</Field> */
export default function Field({ label, required, hint, error, children, style, right }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, ...style }}>
      {label && (
        <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <span style={text.label}>
            {label}
            {required && <span style={{ color: '#C44747', marginLeft: 3 }}>*</span>}
          </span>
          {right}
        </span>
      )}
      {children}
      {error ? <span style={{ ...text.caption, color: '#C44747' }}>{error}</span> : hint && <span style={text.caption}>{hint}</span>}
    </label>
  );
}
