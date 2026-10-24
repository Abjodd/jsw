/**
 * =====================================================================
 * JSW DASHBOARD — THEME (single source of truth)
 * ---------------------------------------------------------------------
 * All styling in this project is INLINE (style={{ ... }}).
 * Every colour, font size, spacing value and shadow MUST come from here.
 *
 *   import { colors, text, space, radius, shadow } from '@/theme/theme';
 *   <h1 style={text.pageTitle}>Purchase Requisition</h1>
 *   <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }} />
 *
 * Do NOT hard-code hex values, font families or font sizes in components.
 * =====================================================================
 */

/* ---------- 1. Colour palette ---------- */
export const colors = {
  navy: '#12304A', // Primary
  navyHover: '#0D2438',
  graphite: '#273746', // Secondary
  steel: '#477DA5', // Accent
  steelHover: '#3D6F95',
  steel50: '#EEF4F9', // tint — icon backgrounds, hover
  steel100: '#DCE8F2',
  bgPage: '#F4F6F8',
  bgCard: '#FFFFFF',
  bgSubtle: '#F9FAFB', // table header, hover rows
  border: '#E0E5EA',
  borderStrong: '#C9D1D9',
  textPrimary: '#1F2937',
  textSecondary: '#667085',
  textDisabled: '#98A2B3',
  white: '#FFFFFF',
};

/* ---------- Status colours ---------- */
export const status = {
  success: { color: '#23845B', bg: '#E9F4EE', label: 'Completed' },
  progress: { color: '#3478B8', bg: '#EAF2FA', label: 'In Progress' },
  warning: { color: '#B7791F', bg: '#FBF3E6', label: 'Pending' },
  error: { color: '#C44747', bg: '#FAECEC', label: 'Overdue' },
  inactive: { color: '#778493', bg: '#EFF1F3', label: 'Inactive' },
};

/** Ordered palette for chart series — use in this order. */
export const chartSeries = ['#12304A', '#477DA5', '#273746', '#3478B8', '#98A2B3'];

/* ---------- 2. Font family ---------- */
export const fontFamily = "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

/* ---------- 3. Type scale — spread these into style={{}} ---------- */
export const text = {
  pageTitle: { fontSize: 30, lineHeight: '38px', fontWeight: 600, color: colors.textPrimary, letterSpacing: '-0.02em', margin: 0 },
  subtitle: { fontSize: 14, lineHeight: '22px', fontWeight: 400, color: colors.textSecondary, margin: 0 },
  section: { fontSize: 20, lineHeight: '28px', fontWeight: 600, color: colors.textPrimary, letterSpacing: '-0.01em', margin: 0 },
  cardTitle: { fontSize: 16, lineHeight: '24px', fontWeight: 600, color: colors.textPrimary, margin: 0 },
  tableHead: { fontSize: 12, lineHeight: '18px', fontWeight: 600 },
  body: { fontSize: 14, lineHeight: '22px', fontWeight: 400 },
  label: { fontSize: 13, lineHeight: '20px', fontWeight: 500, color: colors.textPrimary },
  input: { fontSize: 14, lineHeight: '20px', fontWeight: 400 },
  button: { fontSize: 14, lineHeight: '20px', fontWeight: 500 },
  caption: { fontSize: 12, lineHeight: '18px', fontWeight: 400, color: colors.textSecondary },
  kpi: { fontSize: 30, lineHeight: '38px', fontWeight: 600, color: colors.textPrimary, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' },
  nav: { fontSize: 14, lineHeight: '20px', fontWeight: 500 },
};

/* ---------- Spacing / radius / elevation ---------- */
export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40 };
export const radius = { sm: 6, md: 10, lg: 14, xl: 20, pill: 999 };
export const shadow = {
  sm: '0 1px 2px rgba(18, 48, 74, 0.06)',
  md: '0 4px 16px rgba(18, 48, 74, 0.08)',
  lg: '0 16px 40px rgba(18, 48, 74, 0.14)',
};
export const layout = { topbarH: 64, sidebarW: 248, contentMaxW: 1440 };
export const transition = 'all 180ms cubic-bezier(0.2, 0.7, 0.2, 1)';

/* ---------- Breakpoints (use with useMediaQuery) ---------- */
export const bp = { mobile: '(max-width: 720px)', tablet: '(max-width: 960px)', laptop: '(max-width: 1200px)' };

/* ---------- Reusable style snippets ---------- */
export const card = {
  background: colors.bgCard,
  border: `1px solid ${colors.border}`,
  borderRadius: radius.lg,
  boxShadow: shadow.sm,
  minWidth: 0,
};

/** Entrance animation (keyframes "jsw-rise" are defined in GlobalStyles). */
export const rise = (delayMs = 0) => ({
  animation: 'jsw-rise 420ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
  animationDelay: `${delayMs}ms`,
});

const theme = { colors, status, chartSeries, fontFamily, text, space, radius, shadow, layout, transition, bp, card, rise };
export default theme;
