/**
 * GNFA tokens — one place that reads the shared theme.
 * Every value comes from '@/theme/theme' (colors). The hex after each pick() is only a safety net
 * (the JSW palette) for token names this module could not confirm; delete the net once the names are verified.
 */
import * as theme from '@/theme/theme';

const c = theme.colors || {};
const pick = (...v) => v.find((x) => typeof x === 'string' && x);

export const tok = {
  navy: pick(c.navy, c.primary, '#12304A'),
  graphite: pick(c.graphite, '#273746'),
  steel: pick(c.steel, '#477DA5'),
  page: pick(c.pageBg, c.page, c.background, '#F4F6F8'),
  card: pick(c.cardBg, c.card, c.surface, '#FFFFFF'),
  border: pick(c.border, c.line, c.divider, '#E0E5EA'),
  text: pick(c.textPrimary, c.text, '#1F2937'),
  muted: pick(c.textSecondary, '#667085'),
  disabled: pick(c.textDisabled, c.disabled, '#98A2B3'),
  success: pick(c.success, '#23845B'),
  progress: pick(c.progress, c.info, '#3478B8'),
  warning: pick(c.warning, '#B7791F'),
  danger: pick(c.error, c.danger, '#C44747'),
  inactive: pick(c.inactive, '#778493'),
  radius: 8,
};

/** JSW type scale (px / line-height / weight). Inter is inherited from the app shell. */
export const type = {
  label: { fontSize: 13, lineHeight: '20px', fontWeight: 500 },
  body: { fontSize: 14, lineHeight: '22px', fontWeight: 400 },
  input: { fontSize: 14, lineHeight: '20px', fontWeight: 400 },
  button: { fontSize: 14, lineHeight: '20px', fontWeight: 500 },
  caption: { fontSize: 12, lineHeight: '18px', fontWeight: 400 },
  cardHeading: { fontSize: 16, lineHeight: '24px', fontWeight: 600 },
  nav: { fontSize: 14, lineHeight: '20px', fontWeight: 500 },
};
