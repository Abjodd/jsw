# PR — Purchase Requisition

Route prefix: `/pr`

```
pr/
├── PRModule.jsx        # module routes (wrapped in shared ModuleLayout)
├── pr.config.js          # sidebar navigation items
├── pages/
│   ├── PROverview.jsx  # /pr
│   ├── PRList.jsx            # /pr/list
│   ├── PRCreate.jsx          # /pr/create
│   ├── PRDetails.jsx         # /pr/details
│   ├── PRApprovals.jsx       # /pr/approvals
│   ├── PRReports.jsx         # /pr/reports
├── components/          # module-only components
├── hooks/               # module-only hooks
├── services/prApi.js     # API calls
└── data/mockData.js     # demo data (remove when APIs are live)
```

## Styling
Inline styles only (`style={{ }}`), values from `@/theme/theme`. No `.css` files.

## Adding a screen
1. Create `pages/MyScreen.jsx`
2. Add `{ label, path, icon }` to `pr.config.js`
3. Add `<Route path="my-screen" element={<MyScreen />} />` in `PRModule.jsx`
