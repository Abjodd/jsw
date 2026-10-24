import { colors, radius, status } from '@/theme/theme';

const TONES = {
  neutral: { color: colors.graphite, bg: colors.bgPage, border: colors.border },
  navy: { color: colors.white, bg: colors.navy, border: colors.navy },
  steel: { color: colors.navy, bg: colors.steel50, border: colors.steel100 },
  ...Object.fromEntries(Object.entries(status).map(([k, v]) => [k, { color: v.color, bg: v.bg, border: 'transparent' }])),
};

/**
 * Small rectangular label (codes, flags, categories).
 * <Tag tone="neutral|navy|steel|success|progress|warning|error|inactive" icon={<Icon size={12}/>}>Issue in PR</Tag>
 */
export default function Tag({ children, tone = 'neutral', icon, size = 'md', style, mono }) {
  const t = TONES[tone] ?? TONES.neutral;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
        height: size === 'sm' ? 20 : 24, padding: size === 'sm' ? '0 6px' : '0 8px', borderRadius: radius.sm,
        fontSize: size === 'sm' ? 11 : 12, lineHeight: '18px', fontWeight: 600, letterSpacing: '0.02em',
        fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : undefined,
        color: t.color, background: t.bg, border: `1px solid ${t.border}`,
        ...style,
      }}
    >
      {icon}
      {children}
    </span>
  );
}
