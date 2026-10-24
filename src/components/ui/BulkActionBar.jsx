import { X } from 'lucide-react';
import useHover from '@/hooks/useHover';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors, layout, radius, shadow, transition } from '@/theme/theme';

function BarButton({ action }) {
  const [hovered, hoverProps] = useHover();
  const Icon = action.icon;
  const primary = action.variant === 'primary';
  const danger = action.variant === 'danger';
  return (
    <button
      type="button"
      onClick={action.onClick}
      disabled={action.disabled}
      title={action.title}
      {...hoverProps}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, height: 36, padding: '0 14px', borderRadius: radius.md,
        border: 0, cursor: action.disabled ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', transition,
        fontSize: 14, fontWeight: 500, opacity: action.disabled ? 0.45 : 1,
        background: primary ? (hovered ? '#5A8DB3' : colors.steel) : hovered ? 'rgba(255,255,255,0.12)' : 'transparent',
        color: danger ? '#F2B8B8' : colors.white,
      }}
    >
      {Icon && <Icon size={16} />}
      {action.label}
    </button>
  );
}

/**
 * Floating action bar shown while table rows are selected.
 * <BulkActionBar count={3} noun="line" actions={[{ label, icon, onClick, variant: 'primary'|'danger' }]} onClear={...} />
 */
export default function BulkActionBar({ count, noun = 'item', actions, onClear }) {
  const isTablet = useMediaQuery(bp.tablet);
  if (!count) return null;
  return (
    <div
      style={{
        position: 'fixed', zIndex: 40, bottom: 24, left: isTablet ? 0 : layout.sidebarW, right: 0,
        display: 'flex', justifyContent: 'center', padding: '0 16px', pointerEvents: 'none',
      }}
    >
      <div
        role="toolbar"
        style={{
          pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: 6, paddingLeft: 16,
          maxWidth: '100%', overflowX: 'auto',
          background: colors.navy, borderRadius: radius.lg, boxShadow: shadow.lg, color: colors.white,
          animation: 'jsw-pop 240ms cubic-bezier(0.2,0.7,0.2,1) both',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', paddingRight: 10, marginRight: 4, borderRight: '1px solid rgba(255,255,255,0.15)' }}>
          <span style={{ minWidth: 24, height: 24, padding: '0 6px', borderRadius: 999, display: 'grid', placeItems: 'center', background: colors.white, color: colors.navy, fontSize: 12 }}>{count}</span>
          {noun}{count > 1 ? 's' : ''} selected
        </span>
        {actions.map((a) => <BarButton key={a.label} action={a} />)}
        <button
          aria-label="Clear selection"
          onClick={onClear}
          style={{ marginLeft: 4, width: 36, height: 36, borderRadius: radius.md, border: 0, background: 'rgba(255,255,255,0.08)', color: colors.white, display: 'grid', placeItems: 'center', cursor: 'pointer' }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
