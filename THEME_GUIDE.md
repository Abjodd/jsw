# JSW Dashboard — Colours & Typography Standards

Source of truth: `src/theme/theme.js`. All styling is **inline** (`style={{ }}`) — no `.css` files.

## 1. Colour palette

| Role | Hex | `theme.js` |
|---|---|---|
| Primary Navy | `#12304A` | `colors.navy` |
| Secondary Graphite | `#273746` | `colors.graphite` |
| Accent Steel Blue | `#477DA5` | `colors.steel` |
| Page Background | `#F4F6F8` | `colors.bgPage` |
| Card Background | `#FFFFFF` | `colors.bgCard` |
| Borders & Dividers | `#E0E5EA` | `colors.border` |
| Primary Text | `#1F2937` | `colors.textPrimary` |
| Secondary Text | `#667085` | `colors.textSecondary` |
| Disabled Text | `#98A2B3` | `colors.textDisabled` |

### Status

| Status | Hex | `theme.js` | `<StatusBadge status=…>` |
|---|---|---|---|
| Success / Completed | `#23845B` | `status.success.color` | `success` |
| In Progress / Active | `#3478B8` | `status.progress.color` | `progress` |
| Pending / Warning | `#B7791F` | `status.warning.color` | `warning` |
| Error / Overdue | `#C44747` | `status.error.color` | `error` |
| Inactive | `#778493` | `status.inactive.color` | `inactive` |

Each status also has a light tint (`status.success.bg`, …) used only for badge backgrounds.

## 2. Font family

**Inter**, everywhere. Do not mix font families across modules.

## 3. Type scale

| Use | Size / Line height | Weight | `theme.js` |
|---|---|---|---|
| Main Page Heading | 30 / 38 | 600 | `text.pageTitle` |
| Page Subtitle | 14 / 22 | 400 | `text.subtitle` |
| Section Heading | 20 / 28 | 600 | `text.section` |
| Card Heading | 16 / 24 | 600 | `text.cardTitle` |
| Table Header | 12 / 18 | 600 | `text.tableHead` (auto in `DataTable`) |
| Body Text | 14 / 22 | 400 | `text.body` (default) |
| Form Labels | 13 / 20 | 500 | `text.label` |
| Input Text | 14 / 20 | 400 | `text.input` (auto in `FormField`) |
| Button Text | 14 / 20 | 500 | `text.button` (auto in `Button`) |
| Captions / Helper | 12 / 18 | 400 | `text.caption` |
| KPI Numbers | 30 / 38 (28–32) | 600 | `text.kpi` |
| Navigation Items | 14 / 20 | 500 | `text.nav` |

## Do / Don't

```jsx
import { colors, status, text } from '@/theme/theme';

// ✅ Do
<h2 style={text.section}>Open requisitions</h2>
<p style={{ ...text.caption, marginTop: 4 }}>Updated 5 min ago</p>
<div style={{ color: colors.textSecondary, border: `1px solid ${colors.border}` }} />
<StatusBadge status="warning">Pending</StatusBadge>

// ❌ Don't
<h2 style={{ fontSize: 22, fontFamily: 'Roboto' }}>…</h2>
<span style={{ color: 'orange' }}>Pending</span>
import './my-screen.css';
```

Hover → `useHover()`; responsive → `useMediaQuery(bp.mobile)`. Charts: take series colours in order from `chartSeries`; use `status.*.color` for status-coded series.
