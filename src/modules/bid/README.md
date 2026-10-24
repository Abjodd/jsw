# BID — Bid Management

Route prefix: `/bid`

```
bid/
├── BIDModule.jsx        # module routes (wrapped in shared ModuleLayout)
├── bid.config.js          # sidebar navigation items
├── pages/
│   ├── BIDOverview.jsx  # /bid
│   ├── BidEvents.jsx         # /bid/events
│   ├── BidCreate.jsx         # /bid/create
│   ├── BidEvaluation.jsx     # /bid/evaluation
│   ├── BidComparison.jsx     # /bid/comparison
│   ├── BidAward.jsx          # /bid/award
├── components/          # module-only components
├── hooks/               # module-only hooks
├── services/bidApi.js     # API calls
└── data/mockData.js     # demo data (remove when APIs are live)
```

## Styling
Inline styles only (`style={{ }}`), values from `@/theme/theme`. No `.css` files.

## Adding a screen
1. Create `pages/MyScreen.jsx`
2. Add `{ label, path, icon }` to `bid.config.js`
3. Add `<Route path="my-screen" element={<MyScreen />} />` in `BIDModule.jsx`
