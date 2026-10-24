import useHover from '@/hooks/useHover';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, card, colors, rise, status, text, transition } from '@/theme/theme';

const TONE = {
  navy: { color: colors.navy, bg: colors.steel50 },
  ...Object.fromEntries(Object.entries(status).map(([k, v]) => [k, { color: v.color, bg: v.bg }])),
};

function Stat({ item, active, onClick, index }) {
  const [hovered, hoverProps] = useHover();
  const Icon = item.icon;
  const t = TONE[item.tone] ?? TONE.navy;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      {...hoverProps}
      style={{
        ...card, ...rise(index * 50),
        position: 'relative', overflow: 'hidden', textAlign: 'left', cursor: 'pointer', padding: '16px 18px',
        display: 'flex', flexDirection: 'column', gap: 10, transition,
        borderColor: active ? colors.navy : hovered ? colors.borderStrong : colors.border,
        boxShadow: active ? `0 0 0 3px ${colors.steel100}` : hovered ? '0 4px 16px rgba(18,48,74,0.08)' : card.boxShadow,
        transform: hovered && !active ? 'translateY(-2px)' : 'none',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ ...text.label, color: colors.textSecondary }}>{item.label}</span>
        <span style={{ width: 32, height: 32, borderRadius: 10, display: 'grid', placeItems: 'center', background: t.bg, color: t.color }}>
          <Icon size={17} />
        </span>
      </span>
      <span style={{ ...text.kpi, fontSize: 28, lineHeight: '34px' }}>{item.value}</span>
      <span style={{ ...text.caption, display: 'flex', alignItems: 'center', gap: 6 }}>
        {item.caption}
      </span>
      <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: active ? colors.navy : 'transparent', transition }} />
    </button>
  );
}

/**
 * KPI cards that double as quick filters.
 * items: [{ key, label, value, caption, icon, tone }]   active: key   onChange(key)
 */
export default function QuickStats({ items, active, onChange, columns }) {
  const isMobile = useMediaQuery(bp.mobile);
  const isLaptop = useMediaQuery(bp.laptop);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 2 : isLaptop ? 3 : columns ?? items.length}, minmax(0, 1fr))`, gap: 14, marginBottom: 20 }}>
      {items.map((it, i) => (
        <Stat key={it.key} item={it} index={i} active={active === it.key} onClick={() => onChange(active === it.key && it.key !== 'all' ? 'all' : it.key)} />
      ))}
    </div>
  );
}
