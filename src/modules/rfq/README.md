# RFQ — Request for Quotation

Route prefix: `/rfq` · Mock data only (no services wired yet).

| Screen | Route | File |
|---|---|---|
| RFQ Dashboard | `/rfq` | `pages/RFQDashboard.jsx` |
| Create RFQ (5-step wizard) | `/rfq/create` | `pages/CreateRFQ.jsx` |
| RFQ event detail | `/rfq/events/:eventId` | `pages/RFQEventDetail.jsx` |

**Flow:** PR Buyer Dashboard → select lines → *Create RFQ* → wizard → *Submit* → new Event ID →
event page (live countdown). The PR lines flip to **RFQ Created** automatically.

```
rfq/
├── RFQModule.jsx · rfq.config.js
├── pages/                       # RFQDashboard, CreateRFQ, RFQEventDetail
├── components/
│   ├── TimeLeft.jsx             # live "2d 06h left" ticker
│   ├── dashboard/EventRow.jsx   # one row per event, suppliers expand underneath
│   ├── create/                  # ItemsStep, GeneralStep, TermsStep, VendorsStep, AttachmentsStep,
│   │                            # SummaryPanel, PRLinePickerModal, SubmitSuccessModal
│   └── event/                   # EventHero (countdown + pause/end/cancel), EventActionModal,
│                                # ItemsTab, GeneralTab, TermsTab, VendorsTab, AttachmentsTab, ActivityTab
├── hooks/useCountdown.js
├── data/
│   ├── mockData.js              # vendors + events (live events are timed relative to "now")
│   ├── rfqStore.js              # in-memory store + actions
│   ├── eventStats.js            # bids, L1, ceiling, savings
│   └── constants.js             # statuses, T&C fields, JSW standard terms
└── services/rfqApi.js           # API stubs (not used yet)
```
