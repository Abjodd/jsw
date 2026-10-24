import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, HelpCircle, LogOut, Search, Settings, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import useHover from '@/hooks/useHover';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors, layout, radius, shadow, status, text, transition } from '@/theme/theme';

const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('') || 'JU';

function IconButton({ label, children, dot }) {
  const [hovered, hoverProps] = useHover();
  return (
    <button
      aria-label={label}
      {...hoverProps}
      style={{
        position: 'relative', width: 38, height: 38, borderRadius: radius.md,
        display: 'grid', placeItems: 'center', cursor: 'pointer', border: 0, transition,
        background: hovered ? colors.steel50 : 'transparent',
        color: hovered ? colors.navy : colors.textSecondary,
      }}
    >
      {children}
      {dot && (
        <span
          style={{
            position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: '50%',
            background: status.error.color, border: `2px solid ${colors.white}`,
          }}
        />
      )}
    </button>
  );
}

function MenuItem({ icon, children, danger, onClick }) {
  const [hovered, hoverProps] = useHover();
  return (
    <button
      onClick={onClick}
      {...hoverProps}
      style={{
        ...text.nav, display: 'flex', alignItems: 'center', gap: 10, width: '100%',
        padding: '9px 10px', borderRadius: 8, border: 0, cursor: 'pointer', textAlign: 'left',
        background: hovered ? colors.bgPage : 'transparent',
        color: danger ? status.error.color : colors.textPrimary,
      }}
    >
      {icon}
      {children}
    </button>
  );
}

/** Shared top bar. `left` slot = logo or page context. */
export default function TopBar({ left, searchPlaceholder = 'Search PRs, RFQs, POs, vendors…' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isTablet = useMediaQuery(bp.tablet);
  const [open, setOpen] = useState(false);
  const [userHovered, userHoverProps] = useHover();
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 30, height: layout.topbarH,
        display: 'flex', alignItems: 'center', gap: isTablet ? 6 : 16, padding: isTablet ? '0 16px' : '0 28px',
        background: 'rgba(255, 255, 255, 0.86)', backdropFilter: 'saturate(180%) blur(12px)',
        WebkitBackdropFilter: 'saturate(180%) blur(12px)',
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      {left}
      <div style={{ flex: 1 }} />

      {!isTablet && (
        <label
          style={{
            display: 'flex', alignItems: 'center', gap: 8, width: 'min(420px, 40vw)', height: 38, padding: '0 12px',
            borderRadius: radius.md, background: colors.bgPage, border: `1px solid ${colors.border}`, color: colors.textDisabled,
          }}
        >
          <Search size={16} />
          <input
            placeholder={searchPlaceholder}
            aria-label="Search"
            style={{ ...text.input, flex: 1, border: 0, background: 'transparent', outline: 'none', color: colors.textPrimary }}
          />
          <span style={{ fontSize: 11, fontWeight: 500, padding: '1px 6px', borderRadius: 4, border: '1px solid currentColor', opacity: 0.7 }}>
            ⌘K
          </span>
        </label>
      )}

      <IconButton label="Help"><HelpCircle size={19} /></IconButton>
      <IconButton label="Notifications" dot><Bell size={19} /></IconButton>

      <div ref={ref} style={{ position: 'relative' }}>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={open}
          {...userHoverProps}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
            padding: '4px 8px 4px 4px', borderRadius: radius.pill, border: 0, transition,
            background: userHovered ? colors.steel50 : 'transparent',
          }}
        >
          <span
            style={{
              width: 34, height: 34, borderRadius: '50%', display: 'grid', placeItems: 'center',
              background: `linear-gradient(135deg, ${colors.steel}, ${colors.navy})`,
              color: colors.white, fontSize: 13, fontWeight: 600, letterSpacing: '0.02em',
            }}
          >
            {initials(user?.name)}
          </span>
          {!isTablet && (
            <span style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: 13, lineHeight: '18px', fontWeight: 600, color: colors.textPrimary }}>{user?.name}</span>
              <span style={{ ...text.caption, lineHeight: '16px' }}>{user?.role}</span>
            </span>
          )}
          <ChevronDown size={16} color={colors.textSecondary} />
        </button>

        {open && (
          <div
            role="menu"
            style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)', minWidth: 220, padding: 6,
              background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: radius.md,
              boxShadow: shadow.lg, animation: 'jsw-rise 160ms ease both',
            }}
          >
            <MenuItem icon={<User size={16} />}>My profile</MenuItem>
            <MenuItem icon={<Settings size={16} />}>Settings</MenuItem>
            <div style={{ height: 1, background: colors.border, margin: '6px 0' }} />
            <MenuItem icon={<LogOut size={16} />} danger onClick={() => { logout(); navigate('/login'); }}>
              Sign out
            </MenuItem>
          </div>
        )}
      </div>
    </header>
  );
}
