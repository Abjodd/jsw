# PO — Purchase Orders

Route prefix: `/po`

```
po/
├── POModule.jsx        # module routes (wrapped in shared ModuleLayout)
├── po.config.js          # sidebar navigation items
├── pages/
│   ├── POOverview.jsx  # /po
│   ├── POList.jsx            # /po/list
│   ├── POCreate.jsx          # /po/create
│   ├── PODetails.jsx         # /po/details
│   ├── POAmendments.jsx      # /po/amendments
│   ├── PODeliveryTracking.jsx # /po/deliveries
├── components/          # module-only components
├── hooks/               # module-only hooks
├── services/poApi.js     # API calls
└── data/mockData.js     # demo data (remove when APIs are live)
```

## Styling
Inline styles only (`style={{ }}`), values from `@/theme/theme`. No `.css` files.

## Adding a screen
1. Create `pages/MyScreen.jsx`
2. Add `{ label, path, icon }` to `po.config.js`
3. Add `<Route path="my-screen" element={<MyScreen />} />` in `POModule.jsx`
