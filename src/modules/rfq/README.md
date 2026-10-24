# RFQ — Request for Quotation

Route prefix: `/rfq`

```
rfq/
├── RFQModule.jsx        # module routes (wrapped in shared ModuleLayout)
├── rfq.config.js          # sidebar navigation items
├── pages/
│   ├── RFQOverview.jsx  # /rfq
│   ├── RFQList.jsx           # /rfq/list
│   ├── RFQCreate.jsx         # /rfq/create
│   ├── RFQVendorResponses.jsx # /rfq/responses
│   ├── RFQComparison.jsx     # /rfq/comparison
│   ├── RFQVendors.jsx        # /rfq/vendors
├── components/          # module-only components
├── hooks/               # module-only hooks
├── services/rfqApi.js     # API calls
└── data/mockData.js     # demo data (remove when APIs are live)
```

## Styling
Inline styles only (`style={{ }}`), values from `@/theme/theme`. No `.css` files.

## Adding a screen
1. Create `pages/MyScreen.jsx`
2. Add `{ label, path, icon }` to `rfq.config.js`
3. Add `<Route path="my-screen" element={<MyScreen />} />` in `RFQModule.jsx`
