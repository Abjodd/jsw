import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, KeyRound, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { MODULES } from '@/config/modules';
import JswLogo from '@/components/brand/JswLogo';
import { Button, FormField } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors, radius, rise, shadow, status, text } from '@/theme/theme';

/* ---------- styles ---------- */
const s = {
  page: (isTablet) => ({
    display: 'grid', minHeight: '100vh', background: colors.bgCard,
    gridTemplateColumns: isTablet ? '1fr' : 'minmax(420px, 46%) 1fr',
  }),
  brand: {
    position: 'relative', overflow: 'hidden', color: colors.white,
    background: `radial-gradient(120% 80% at 100% 0%, rgba(71,125,165,0.35) 0%, transparent 55%),
      radial-gradient(90% 60% at 0% 100%, rgba(39,55,70,0.9) 0%, transparent 60%), ${colors.navy}`,
  },
  pattern: { position: 'absolute', inset: 0, width: '100%', height: '100%' },
  brandInner: { position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', gap: 40, padding: '44px 56px' },
  eyebrow: {
    display: 'inline-block', marginBottom: 16, padding: '4px 10px', borderRadius: radius.pill,
    fontSize: 12, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
    color: '#B9D1E4', background: 'rgba(71,125,165,0.22)', border: '1px solid rgba(71,125,165,0.4)',
  },
  headline: { margin: 0, fontSize: 40, lineHeight: '48px', fontWeight: 600, letterSpacing: '-0.025em' },
  lede: { margin: '16px 0 0', maxWidth: 440, fontSize: 15, lineHeight: '24px', color: 'rgba(255,255,255,0.7)' },
  flow: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', position: 'relative' },
  flowLine: {
    position: 'absolute', left: 19, top: 20, bottom: 20, width: 1,
    background: 'linear-gradient(to bottom, rgba(141,182,214,0.6), rgba(141,182,214,0.1))',
  },
  flowStep: { position: 'relative', display: 'grid', gridTemplateColumns: '40px 56px 1fr', alignItems: 'center', gap: 12, padding: '7px 0' },
  flowIcon: {
    width: 40, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center',
    background: '#183A57', border: '1px solid rgba(141,182,214,0.3)', color: '#8DB6D6',
  },
  flowCode: { fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', color: colors.white },
  flowName: { fontSize: 14, color: 'rgba(255,255,255,0.65)' },
  legal: { margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.45)' },

  formWrap: { display: 'grid', placeItems: 'center', padding: '40px 24px', background: colors.bgPage },
  form: (isTablet) => ({
    width: '100%', maxWidth: 440, padding: isTablet ? '28px 20px' : 40,
    background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: radius.xl, boxShadow: shadow.md,
    ...rise(0),
  }),
  fields: { display: 'flex', flexDirection: 'column', gap: 18 },
  link: { ...text.caption, color: colors.steel, fontWeight: 500 },
  pwToggle: {
    width: 32, height: 32, display: 'grid', placeItems: 'center', border: 0, background: 'transparent',
    cursor: 'pointer', color: colors.textSecondary, borderRadius: radius.sm,
  },
  remember: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: colors.textPrimary, ...text.body },
  error: {
    ...text.label, padding: '10px 12px', borderRadius: radius.md,
    background: status.error.bg, color: status.error.color,
  },
  dividerLine: { flex: 1, height: 1, background: colors.border },
  secure: { ...text.caption, display: 'flex', gap: 6, alignItems: 'flex-start', margin: '24px 0 0' },
};

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isTablet = useMediaQuery(bp.tablet);
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Enter your corporate email and password to continue.');
      return;
    }
    setLoading(true);
    await login(form);
    navigate(location.state?.from?.pathname || '/', { replace: true });
  };

  return (
    <div style={s.page(isTablet)}>
      {/* ---------- Brand panel ---------- */}
      {!isTablet && (
        <aside style={s.brand}>
          <svg style={s.pattern} viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
              <linearGradient id="lg-fade" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={colors.steel} stopOpacity="0.55" />
                <stop offset="1" stopColor={colors.steel} stopOpacity="0" />
              </linearGradient>
            </defs>
            {Array.from({ length: 14 }).map((_, i) => (
              <path key={i} d={`M${-200 + i * 70} 820 L${260 + i * 70} -20`} stroke="url(#lg-fade)" strokeWidth="1" fill="none" />
            ))}
            {[220, 150, 80].map((r, i) => (
              <circle key={r} cx="520" cy="140" r={r} fill="none" stroke={colors.steel} strokeOpacity={0.18 - i * 0.04} />
            ))}
          </svg>

          <div style={s.brandInner}>
            <JswLogo light size={40} />

            <div style={{ marginTop: 'auto' }}>
              <span style={s.eyebrow}>Source-to-Pay Platform</span>
              <h1 style={s.headline}>Every procurement flow,<br />one connected workspace.</h1>
              <p style={s.lede}>
                Requisitions, bids, quotations, approvals and purchase orders — tracked end-to-end
                across plants with a single sign-in.
              </p>
            </div>

            <ol style={s.flow}>
              <span style={s.flowLine} />
              {MODULES.map((m, i) => {
                const Icon = m.icon;
                return (
                  <li key={m.id} style={{ ...s.flowStep, ...rise(120 + i * 80) }}>
                    <span style={s.flowIcon}><Icon size={18} /></span>
                    <span style={s.flowCode}>{m.code}</span>
                    <span style={s.flowName}>{m.name}</span>
                  </li>
                );
              })}
            </ol>

            <p style={s.legal}>© {new Date().getFullYear()} JSW Group · Internal use only</p>
          </div>
        </aside>
      )}

      {/* ---------- Form panel ---------- */}
      <main style={s.formWrap}>
        <form style={s.form(isTablet)} onSubmit={onSubmit} noValidate>
          {isTablet && <div style={{ marginBottom: 24 }}><JswLogo /></div>}
          <h2 style={text.pageTitle}>Welcome back</h2>
          <p style={{ ...text.subtitle, marginTop: 6, marginBottom: 28 }}>
            Sign in with your JSW corporate account to continue.
          </p>

          <div style={s.fields}>
            <FormField
              label="Corporate email"
              name="email"
              type="email"
              autoComplete="username"
              placeholder="firstname.lastname@jsw.in"
              icon={<Mail size={18} />}
              value={form.email}
              onChange={onChange}
            />

            <FormField
              label="Password"
              name="password"
              type={showPw ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              icon={<Lock size={18} />}
              value={form.password}
              onChange={onChange}
              right={<a href="#" style={s.link}>Forgot password?</a>}
              endAdornment={
                <button type="button" style={s.pwToggle} onClick={() => setShowPw((v) => !v)} aria-label={showPw ? 'Hide password' : 'Show password'}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <label style={s.remember}>
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={onChange}
                style={{ width: 16, height: 16, accentColor: colors.navy }}
              />
              Keep me signed in on this device
            </label>

            {error && <div role="alert" style={s.error}>{error}</div>}

            <Button type="submit" size="lg" block disabled={loading} iconRight={!loading && <ArrowRight size={18} />}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={s.dividerLine} />
              <span style={{ ...text.caption, color: colors.textDisabled }}>or</span>
              <span style={s.dividerLine} />
            </div>

            <Button type="button" variant="secondary" size="lg" block icon={<KeyRound size={18} />}>
              Continue with JSW SSO
            </Button>
          </div>

          <p style={s.secure}>
            <ShieldCheck size={14} color={status.success.color} style={{ flexShrink: 0, marginTop: 2 }} />
            Protected by enterprise single sign-on. Need access? Contact IT Helpdesk.
          </p>
        </form>
      </main>
    </div>
  );
}
