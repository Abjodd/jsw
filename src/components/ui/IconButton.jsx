import useHover from '@/hooks/useHover';
import { colors, radius, transition } from '@/theme/theme';

/** Square icon-only button. Always pass `label` for accessibility. */
export default function IconButton({ label, children, size = 36, tone = 'default', style, ...rest }) {
  const [hovered, hoverProps] = useHover();
  const danger = tone === 'danger';
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...hoverProps}
      {...rest}
      style={{
        width: size, height: size, flexShrink: 0, display: 'grid', placeItems: 'center',
        border: 0, borderRadius: radius.md, cursor: 'pointer', transition,
        background: hovered ? (danger ? '#FAECEC' : colors.steel50) : 'transparent',
        color: danger ? '#C44747' : hovered ? colors.navy : colors.textSecondary,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
