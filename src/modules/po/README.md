# PO — Purchase Orders

Route prefix: `/po` · Mock data only (no services wired yet).

| Screen | Route | File |
|---|---|---|
| Purchase Orders (dashboard) | `/po` | `pages/PODashboard.jsx` |
| PO detail | `/po/:poNumber` | `pages/PODetail.jsx` |
| Create ASN | `/po/:poNumber/asn` | `pages/CreateASN.jsx` |
| ASN Register | `/po/asns` | `pages/ASNRegister.jsx` |

```
po/
├── POModule.jsx · po.config.js
├── pages/                         # PODashboard, PODetail, CreateASN, ASNRegister
├── components/
│   ├── poColumns.jsx              # dashboard table columns
│   ├── RemarksModal.jsx           # remark thread + 500-char composer
│   ├── detail/                    # POHero, ItemsTab, ItemDrawer, DrawingsTab, ASNsTab, RemarksTab,
│   │                              # DeliveryDecisionModal, AcknowledgeModal, itemStatus.js
│   └── asn/                       # ASNItemsTable, ASNDocuments, ASNSummary (GST split), ASNSuccessModal
├── data/
│   ├── mockData.js                # vendors + POs (from the SAP screens)
│   ├── poStore.js                 # in-memory store: acknowledge, remarks, date decisions, drawings, ASN
│   ├── poMath.js                  # line/PO totals, pending value, overdue, GST split
│   └── constants.js               # statuses, plants, purchase groups, ASN document types
└── services/poApi.js              # API stubs (not used yet)
```

**Flows:** select one PO → *Create ASN* → enter invoice + quantities (capped at available qty) → upload invoice →
submit → ASN number; PO line "ASN created qty" updates. On the PO page: *Acknowledge PO*, *Date decisions*
(approve/reject supplier delivery-date requests), *Drawings → Send upload*, *Remarks*.
