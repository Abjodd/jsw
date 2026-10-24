import { NavLink, Link, Outlet } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import JswLogo from '@/components/brand/JswLogo';
import { MODULES } from '@/config/modules';
import useHover from '@/hooks/useHover';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors, layout, radius, text, transition } from '@/theme/theme';
import TopBar from './TopBar';

const sideLabel = {
  padding: '14px 10px 6px', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
  textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
};

function SideNavLink({ to, end, icon: Icon, children }) {
  const [hovered, hoverProps] = useHover();
  return (
    <NavLink
      to={to}
      end={end}
      {...hoverProps}
      style={({ isActive }) => ({
        ...text.nav, position: 'relative', display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 12px', borderRadius: 8, transition,
        color: isActive || hovered ? colors.white : 'rgba(255,255,255,0.72)',
        background: isActive ? 'rgba(255,255,255,0.1)' : hovered ? 'rgba(255,255,255,0.06)' : 'transparent',
      })}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span style={{ position: 'absolute', left: -14, top: 8, bottom: 8, width: 3, borderRadius: '0 3px 3px 0', background: colors.steel }} />
          )}
          {Icon && <Icon size={18} color={isActive ? '#8DB6D6' : undefined} />}
          {children}
        </>
      )}
    </NavLink>
  );
}

function BackLink() {
  const [hovered, hoverProps] = useHover();
  return (
    <Link
      to="/"
      {...hoverProps}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, margin: '14px 0 6px', padding: '8px 10px', borderRadius: 8,
        fontSize: 13, fontWeight: 500, transition,
        color: hovered ? colors.white : 'rgba(255,255,255,0.65)',
        background: hovered ? 'rgba(255,255,255,0.06)' : 'transparent',
      }}
    >
      <ArrowLeft size={15} /> All applications
    </Link>
  );
}

function SwitchChip({ m, current }) {
  const [hovered, hoverProps] = useHover();
  return (
    <Link
      to={m.path}
      title={m.name}
      {...hoverProps}
      style={{
        display: 'grid', placeItems: 'center', height: 36, borderRadius: 8,
        fontSize: 11, fontWeight: 600, letterSpacing: '0.02em', transition,
        color: current || hovered ? colors.white : 'rgba(255,255,255,0.6)',
        background: current ? colors.steel : hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
      }}
    >
      {m.code}
    </Link>
  );
}

/**
 * Shared layout for every module (PR, BID, RFQ, GNFA, PO).
 * module: entry from src/config/modules.js
 * nav:    array from the module's <code>.config.js → [{ label, path, icon, end? }]
 */
export default function ModuleLayout({ module, nav }) {
  const Icon = module.icon;
  const isTablet = useMediaQuery(bp.tablet);

  return (
    <div
      style={{
        display: 'grid', minHeight: '100vh',
        gridTemplateColumns: isTablet ? '1fr' : `${layout.sidebarW}px 1fr`,
        background: isTablet
          ? colors.bgPage
          : `linear-gradient(to right, ${colors.navy} ${layout.sidebarW}px, ${colors.bgPage} ${layout.sidebarW}px)`,
      }}
    >
      <aside
        style={{
          position: isTablet ? 'static' : 'sticky', top: 0, height: isTablet ? 'auto' : '100vh', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', background: colors.navy, color: colors.white, padding: '18px 14px',
        }}
      >
        <div style={{ padding: '4px 8px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link to="/"><JswLogo light /></Link>
        </div>

        <BackLink />

        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 14px', padding: 12, borderRadius: radius.md,
            background: 'linear-gradient(135deg, rgba(71,125,165,0.35), rgba(71,125,165,0.1))',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <span style={{ width: 38, height: 38, borderRadius: 10, display: 'grid', placeItems: 'center', background: colors.steel, flexShrink: 0 }}>
            <Icon size={19} />
          </span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '0.02em' }}>{module.code}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{module.name}</div>
          </div>
        </div>

        <div style={sideLabel}>Menu</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {nav.map(({ label, path, icon, end }) => (
            <SideNavLink key={path} to={path} end={end} icon={icon}>{label}</SideNavLink>
          ))}
        </nav>

        {!isTablet && (
          <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ ...sideLabel, paddingTop: 0 }}>Switch module</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
              {MODULES.map((m) => <SwitchChip key={m.id} m={m} current={m.id === module.id} />)}
            </div>
          </div>
        )}
      </aside>

      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar left={<span style={{ ...text.label, color: colors.textSecondary }}>{module.name}</span>} />
        <main
          style={{
            padding: isTablet ? '20px 16px' : 28, maxWidth: layout.contentMaxW, width: '100%', margin: '0 auto',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
