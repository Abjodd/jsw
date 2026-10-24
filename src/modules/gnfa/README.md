# GNFA — GNFA

Route prefix: `/gnfa`

```
gnfa/
├── GNFAModule.jsx        # module routes (wrapped in shared ModuleLayout)
├── gnfa.config.js          # sidebar navigation items
├── pages/
│   ├── GNFAOverview.jsx  # /gnfa
│   ├── GNFARequests.jsx      # /gnfa/requests
│   ├── GNFACreate.jsx        # /gnfa/create
│   ├── GNFAApprovals.jsx     # /gnfa/approvals
│   ├── GNFADetails.jsx       # /gnfa/details
│   ├── GNFAReports.jsx       # /gnfa/reports
├── components/          # module-only components
├── hooks/               # module-only hooks
├── services/gnfaApi.js     # API calls
└── data/mockData.js     # demo data (remove when APIs are live)
```

## Styling
Inline styles only (`style={{ }}`), values from `@/theme/theme`. No `.css` files.

## Adding a screen
1. Create `pages/MyScreen.jsx`
2. Add `{ label, path, icon }` to `gnfa.config.js`
3. Add `<Route path="my-screen" element={<MyScreen />} />` in `GNFAModule.jsx`
