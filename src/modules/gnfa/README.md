# GNFA — GNFA

Route prefix: `/gnfa`

```
gnfa/
├── GNFAModule.jsx          # routes (wrapped in shared ModuleLayout)
├── gnfa.config.js          # sidebar: GNFA Create, GNFA Dashboard (only these two)
├── pages/
│   ├── GNFACreate.jsx            # /gnfa/create             Event search, RFQ/PR lines, Create GNFA
│   ├── GNFACreateDetail.jsx      # /gnfa/create/detail      9 tabs (opened by Create GNFA)
│   ├── GNFADashboard.jsx         # /gnfa/dashboard          NFA search + results
│   └── GNFADashboardDetail.jsx   # /gnfa/dashboard/:nfaId   Executive Summary / Detailed / Attachment / Work Flow
├── components/
│   ├── gnfaTokens.js             # reads '@/theme/theme' + JSW type scale
│   ├── GnfaPrimitives.jsx        # local stand-ins (Tabs, fields, filter row, steps) — swap for shared ones
│   └── GnfaSections.jsx          # section bodies reused by Create Detail and dashboard Detailed view
├── services/gnfaApi.js
└── data/mockData.js            # demo data from the GNFA screenshots
```

## Styling
Inline styles only (`style={{ }}`), values from `@/theme/theme` via `components/gnfaTokens.js`. No `.css` files.
Detail/dashboard views are child routes of the two sidebar items — never add them to `gnfa.config.js`.
