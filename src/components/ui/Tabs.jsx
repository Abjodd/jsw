import useHover from '@/hooks/useHover';
import { colors, radius, shadow, text, transition } from '@/theme/theme';

function Tab({ item, active, onClick, variant }) {
  const [hovered, hoverProps] = useHover();
  const Icon = item.icon;
  const pill = variant === 'pill';
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      {...hoverProps}
      style={{
        ...text.nav, position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
        border: 0, cursor: 'pointer', transition,
        padding: pill ? '7px 14px' : '14px 4px',
        borderRadius: pill ? radius.md - 2 : 0,
        background: pill ? (active ? colors.bgCard : 'transparent') : 'transparent',
        boxShadow: pill && active ? shadow.sm : 'none',
        color: active ? colors.navy : hovered ? colors.textPrimary : colors.textSecondary,
      }}
    >
      {Icon && <Icon size={17} />}
      {item.label}
      {item.count !== undefined && (
        <span
          style={{
            minWidth: 22, height: 20, padding: '0 6px', borderRadius: 999, display: 'inline-grid', placeItems: 'center',
            fontSize: 12, fontWeight: 600,
            background: active ? colors.navy : colors.bgPage, color: active ? colors.white : colors.textSecondary,
          }}
        >
          {item.count}
        </span>
      )}
      {!pill && (
        <span style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 2, borderRadius: 2, background: active ? colors.navy : 'transparent', transition }} />
      )}
    </button>
  );
}

/**
 * <Tabs items={[{ key, label, icon?, count? }]} value onChange={(key)=>...} variant="underline|pill" />
 */
export default function Tabs({ items, value, onChange, variant = 'underline', style }) {
  const pill = variant === 'pill';
  return (
    <div
      role="tablist"
      style={{
        display: 'flex', gap: pill ? 4 : 28, overflowX: 'auto',
        ...(pill
          ? { padding: 4, background: colors.bgPage, borderRadius: radius.md, border: `1px solid ${colors.border}`, width: 'fit-content', maxWidth: '100%' }
          : { borderBottom: `1px solid ${colors.border}` }),
        ...style,
      }}
    >
      {items.map((it) => (
        <Tab key={it.key} item={it} active={it.key === value} onClick={() => onChange(it.key)} variant={variant} />
      ))}
    </div>
  );
}
