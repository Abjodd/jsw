import useHover from '@/hooks/useHover';
import { colors, radius, shadow, status, text, transition } from '@/theme/theme';

const VARIANTS = {
  primary: { base: { background: colors.navy, color: colors.white }, hover: { background: colors.navyHover, boxShadow: shadow.md } },
  accent: { base: { background: colors.steel, color: colors.white }, hover: { background: colors.steelHover } },
  secondary: {
    base: { background: colors.bgCard, color: colors.textPrimary, borderColor: colors.border },
    hover: { background: colors.bgSubtle, borderColor: colors.borderStrong },
  },
  ghost: { base: { background: 'transparent', color: colors.textSecondary }, hover: { background: colors.steel50, color: colors.navy } },
  danger: { base: { background: status.error.bg, color: status.error.color }, hover: { background: '#F4DADA' } },
  dangerSolid: { base: { background: status.error.color, color: colors.white }, hover: { background: '#A93B3B' } },
  /** for buttons placed on navy surfaces */
  onDark: {
    base: { background: 'rgba(255,255,255,0.08)', color: colors.white, borderColor: 'rgba(255,255,255,0.2)' },
    hover: { background: 'rgba(255,255,255,0.16)' },
  },
};
const SIZES = {
  sm: { height: 32, padding: '0 12px', borderRadius: radius.sm },
  md: { height: 40, padding: '0 16px', borderRadius: radius.md },
  lg: { height: 46, padding: '0 20px', borderRadius: radius.md },
};

/**
 * <Button variant="primary|accent|secondary|ghost|danger|dangerSolid|onDark" size="sm|md|lg" block icon={<Icon/>} iconRight={<Icon/>} style={{...}} />
 */
export default function Button({ variant = 'primary', size = 'md', block, icon, iconRight, children, style, disabled, ...rest }) {
  const [hovered, hoverProps] = useHover();
  const v = VARIANTS[variant];
  return (
    <button
      disabled={disabled}
      {...hoverProps}
      {...rest}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        border: '1px solid transparent', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1, whiteSpace: 'nowrap', transition,
        width: block ? '100%' : undefined,
        ...text.button,
        ...SIZES[size],
        ...v.base,
        ...(hovered && !disabled ? v.hover : null),
        ...style,
      }}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
}
