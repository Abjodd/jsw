# JSW Procurement Suite — Dashboard

Vite + React 18 + React Router 6. One login, one app hub, five module dashboards.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
```

Demo login: any email + any password (see `src/context/AuthContext.jsx`, to be replaced with real auth/SSO).

---

## Project structure

```
src/
├── main.jsx
├── App.jsx                      # renders <GlobalStyles/> once
├── theme/                       # ★ DESIGN SYSTEM — the only place colours & fonts are defined
│   ├── theme.js                 #   colors, status, text (type scale), space, radius, shadow, bp …
│   └── GlobalStyles.jsx         #   body reset, keyframes, placeholder/scrollbar (can't be inline)
├── hooks/
│   ├── useHover.js              # replaces :hover for inline styles
│   └── useMediaQuery.js         # replaces @media for inline styles
├── config/
│   └── modules.js               # module registry → drives home tiles + module sidebar header
├── context/AuthContext.jsx      # auth state (demo)
├── routes/
│   ├── AppRoutes.jsx            # top-level routes, modules lazy-loaded
│   └── ProtectedRoute.jsx
├── components/
│   ├── ui/                      # ★ shared UI kit — Button, IconButton, Card, KpiCard, StatusBadge, Tag,
│   │                            #   Avatar, DataTable (select/sort/paging), FilterBar, BulkActionBar, QuickStats, Timeline,
│   │                            #   Modal, Drawer, Toast, Tabs, Stepper, Input, Select, Textarea,
│   │                            #   Checkbox, Toggle, Field, DescriptionList, PageHeader, EmptyState
│   ├── layout/                  # TopBar, ModuleLayout (sidebar + topbar for every module)
│   └── brand/JswLogo.jsx        # placeholder mark — replace with official logo asset
├── pages/
│   ├── Login/                   # /login
│   ├── Home/                    # /  — main app hub with module tiles
│   └── NotFound/
├── modules/                     # ★ one folder per module
│   ├── pr/    → /pr     Purchase Requisition  ✅ Admin + Buyer dashboards (see pr/README.md)
│   ├── rfq/   → /rfq    Request for Quotation ✅ Dashboard, Create RFQ, Event detail (see rfq/README.md)
│   ├── bid/   → /bid    Bid Management
│   ├── gnfa/  → /gnfa   GNFA
│   └── po/    → /po     Purchase Orders       ✅ Dashboard, PO detail, Create ASN, ASN register (see po/README.md)
├── utils/                       # apiClient.js, format.js (INR / dates / CSV), createStore.js (mock state)
└── assets/
```

### Inside a placeholder module (example: `modules/gnfa/`)

```
gnfa/
├── GNFAModule.jsx        # routes for /gnfa/* (wrapped in shared ModuleLayout)
├── gnfa.config.js        # sidebar menu items
├── pages/                # one .jsx per screen — PASTE SCREEN CODE HERE
│   ├── GNFAOverview.jsx  # /gnfa  (module landing dashboard)
│   └── …                 # /gnfa/requests, /gnfa/create, …
├── components/           # module-only components
├── hooks/                # module-only hooks
├── services/gnfaApi.js   # API calls
└── data/mockData.js    # demo data
```

Each module folder has its own `README.md` with its route map.

**Adding a screen:** create `pages/MyScreen.jsx` → add it to `<module>.config.js` → add a `<Route>` in `<CODE>Module.jsx`.

---

## Styling rules (everyone must follow)

**All styling is inline (`style={{ }}`). There are no `.css` files.** See `THEME_GUIDE.md`.

```jsx
import { colors, text, radius, card } from '@/theme/theme';
import useHover from '@/hooks/useHover';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp } from '@/theme/theme';

export default function VendorCard({ vendor }) {
  const [hovered, hoverProps] = useHover();
  const isMobile = useMediaQuery(bp.mobile);
  return (
    <div {...hoverProps} style={{ ...card, padding: isMobile ? 16 : 20, borderColor: hovered ? colors.steel : colors.border }}>
      <h3 style={text.cardTitle}>{vendor.name}</h3>
      <p style={text.caption}>{vendor.city}</p>
    </div>
  );
}
```

1. **Never hard-code colours, fonts or font sizes** — take them from `@/theme/theme` (`colors`, `status`, `text`, `radius`, `shadow`, `space`).
2. **Text styles:** spread the matching `text.*` object — `text.pageTitle`, `text.section`, `text.cardTitle`, `text.body`, `text.label`, `text.caption`, `text.kpi`…
3. **Hover / responsive:** `useHover()` and `useMediaQuery(bp.mobile | bp.tablet | bp.laptop)`.
4. **Use the shared UI kit** (`@/components/ui`) for buttons, cards, KPIs, tables, status badges, page headers and form fields.
5. **Status colours only via `<StatusBadge status="success|progress|warning|error|inactive" />`** (or `status.<name>.color` for charts).
6. **Tables:** `<DataTable columns={[...]} rows={[...]} />`.
7. For long components, keep a `const s = { ... }` style object at the top of the file (see `LoginPage.jsx`, `HomeDashboard.jsx`).
