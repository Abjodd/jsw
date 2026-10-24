import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import useHover from '@/hooks/useHover';
import { colors, radius, rise, shadow, status, text } from '@/theme/theme';

const ease = 'cubic-bezier(0.2,0.7,0.2,1)';

/** Home-page tile that routes into a module dashboard. */
export default function ModuleTile({ module, index = 0, style }) {
  const { icon: Icon, code, name, description, stats, path, progress, progressLabel } = module;
  const [hovered, hoverProps] = useHover();

  return (
    <Link
      to={path}
      {...hoverProps}
      style={{
        position: 'relative', overflow: 'hidden', isolation: 'isolate',
        display: 'flex', flexDirection: 'column', gap: 10, padding: 24,
        borderRadius: radius.lg, background: colors.bgCard, color: 'inherit',
        border: `1px solid ${hovered ? '#C9D7E3' : colors.border}`,
        boxShadow: hovered ? shadow.lg : shadow.sm,
        transform: hovered ? 'translateY(-4px)' : 'none',
        transition: `transform 240ms ${ease}, box-shadow 240ms, border-color 240ms`,
        ...rise(120 + index * 70),
        ...style,
      }}
    >
      {/* top accent bar */}
      <span
        style={{
          position: 'absolute', left: 0, top: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, ${colors.navy}, ${colors.steel})`,
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left',
          transition: `transform 320ms ${ease}`,
        }}
      />
      {/* glow */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute', zIndex: -1, right: -80, top: -80, width: 220, height: 220, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(71,125,165,0.14), transparent 70%)',
          transform: hovered ? 'scale(1.3)' : 'none', transition: 'transform 400ms ease',
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span
          style={{
            width: 48, height: 48, borderRadius: 14, display: 'grid', placeItems: 'center', color: colors.white,
            background: hovered ? colors.steel : colors.navy, boxShadow: '0 6px 16px rgba(18,48,74,0.25)',
            transition: 'background 240ms',
          }}
        >
          <Icon size={22} />
        </span>
        <span
          style={{
            fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', color: colors.steel,
            padding: '4px 10px', borderRadius: radius.pill, background: colors.steel50,
          }}
        >
          {code}
        </span>
      </div>

      <h3 style={{ ...text.cardTitle, marginTop: 2 }}>{name}</h3>
      <p style={{ ...text.body, color: colors.textSecondary, margin: 0, minHeight: 44 }}>{description}</p>

      <dl
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, margin: '8px 0 0', padding: '14px 0',
          borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}`,
        }}
      >
        {stats.map((st) => (
          <div key={st.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <dt style={text.caption}>{st.label}</dt>
            <dd
              style={{
                margin: 0, fontSize: 22, lineHeight: '30px', fontWeight: 600, letterSpacing: '-0.01em',
                fontVariantNumeric: 'tabular-nums',
                color: st.status ? status[st.status].color : colors.textPrimary,
              }}
            >
              {st.value}
            </dd>
          </div>
        ))}
      </dl>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
        <div style={{ ...text.caption, display: 'flex', justifyContent: 'space-between' }}>
          <span>{progressLabel}</span>
          <strong style={{ color: colors.textPrimary, fontWeight: 600 }}>{progress}%</strong>
        </div>
        <div style={{ height: 6, borderRadius: radius.pill, background: colors.bgPage, overflow: 'hidden' }}>
          <span
            style={{
              display: 'block', height: '100%', width: `${progress}%`, borderRadius: 'inherit',
              background: `linear-gradient(90deg, ${colors.navy}, ${colors.steel})`,
            }}
          />
        </div>
      </div>

      <span
        style={{
          ...text.button, display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8,
          color: hovered ? colors.steel : colors.navy,
        }}
      >
        Open dashboard
        <ArrowRight size={16} style={{ transform: hovered ? 'translateX(4px)' : 'none', transition: `transform 240ms ${ease}` }} />
      </span>
    </Link>
  );
}
