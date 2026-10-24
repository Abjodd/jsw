/**
 * Placeholder product mark. Swap the <svg> for the official JSW logo file
 * (put it in src/assets/) once brand assets are provided.
 */
export default function JswLogo({ light = false, size = 32, showText = true, subtitle = 'Procurement Suite' }) {
  const fg = light ? '#FFFFFF' : '#12304A';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill={light ? 'rgba(255,255,255,0.12)' : '#12304A'} />
        <path d="M9 21l7-11 7 11" fill="none" stroke="#477DA5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 21h8" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {showText && (
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: '0.06em', color: fg }}>JSW</span>
          {subtitle && (
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', color: light ? 'rgba(255,255,255,0.65)' : '#667085' }}>
              {subtitle}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
