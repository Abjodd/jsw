# PR — Purchase Requisition

Route prefix: `/pr` · Mock data only (no services wired yet).

| Screen | Route | File |
|---|---|---|
| PR Admin Dashboard | `/pr` | `pages/PRAdminDashboard.jsx` |
| PR Buyer Dashboard | `/pr/buyer` | `pages/PRBuyerDashboard.jsx` |

```
pr/
├── PRModule.jsx                 # routes (wrapped in shared ModuleLayout)
├── pr.config.js                 # sidebar menu
├── pages/
│   ├── PRAdminDashboard.jsx     # assign / reassign buyer, change priority, send back
│   └── PRBuyerDashboard.jsx     # create RFQ, repeat order, direct NFA, send back
├── components/
│   ├── PRTable.jsx              # compact line table (admin / buyer layouts)
│   ├── PRDetailDrawer.jsx       # every SAP field, grouped + activity timeline
│   ├── PriorityPill.jsx · BuyerCell.jsx · SelectedLines.jsx
│   ├── PRActionModals.jsx       # picks the right modal
│   └── modals/                  # AssignBuyer, ChangePriority, SendBack, RepeatOrder, DirectNfa
├── hooks/usePRFilters.js        # filter panel + quick filter + search
├── data/
│   ├── mockData.js              # PR lines + buyers
│   ├── prStore.js               # in-memory store + actions (swap for API calls)
│   ├── constants.js             # option lists, status → colour
│   └── exportColumns.js         # full 33-column CSV export
└── services/prApi.js            # API stubs (not used yet)
```

**Design notes:** the 33-column SAP grid is condensed into 8–10 readable columns; everything else lives in the
detail drawer (click a row). Bulk actions appear in a floating bar when rows are selected. Download exports all columns.
