import { Check } from 'lucide-react';
import useHover from '@/hooks/useHover';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors, status, text, transition } from '@/theme/theme';

function Step({ step, index, state, onClick, compact, last }) {
  const [hovered, hoverProps] = useHover();
  const Icon = step.icon;
  const done = state === 'done';
  const current = state === 'current';
  const error = state === 'error';
  return (
    <button
      type="button"
      onClick={onClick}
      {...hoverProps}
      style={{
        flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0',
        border: 0, background: 'transparent', cursor: 'pointer', textAlign: 'left',
      }}
    >
      <span
        style={{
          position: 'relative', width: 40, height: 40, flexShrink: 0, borderRadius: 12, display: 'grid', placeItems: 'center', transition,
          background: current ? colors.navy : done ? status.success.bg : error ? status.error.bg : hovered ? colors.steel50 : colors.bgPage,
          color: current ? colors.white : done ? status.success.color : error ? status.error.color : colors.textSecondary,
          boxShadow: current ? '0 6px 16px rgba(18,48,74,0.25)' : 'none',
        }}
      >
        {done ? <Check size={18} strokeWidth={2.6} /> : Icon ? <Icon size={18} /> : index + 1}
      </span>
      {!compact && (
        <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ ...text.caption, fontWeight: 500, color: colors.textDisabled }}>Step {index + 1}</span>
          <span style={{ ...text.nav, color: current ? colors.navy : colors.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{step.label}</span>
        </span>
      )}
      {!last && <span style={{ flex: 1, minWidth: 12, height: 2, borderRadius: 2, background: done ? status.success.color : colors.border, marginLeft: compact ? 0 : 4 }} />}
    </button>
  );
}

/**
 * <Stepper steps={[{ key, label, icon }]} current={0} states={{ items: 'done' | 'error' }} onChange={(index)=>...} />
 */
export default function Stepper({ steps, current, states = {}, onChange }) {
  const isMobile = useMediaQuery(bp.mobile);
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: 12 }} aria-label="Progress">
      {steps.map((s, i) => (
        <Step
          key={s.key}
          step={s}
          index={i}
          last={i === steps.length - 1}
          compact={isMobile}
          state={i === current ? 'current' : states[s.key]}
          onClick={() => onChange(i)}
        />
      ))}
    </nav>
  );
}
