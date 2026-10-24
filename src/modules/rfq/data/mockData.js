// Demo data for the RFQ module. Live / paused events are timed relative to "now"
// so countdowns always work in demos. Contact details are fictitious.
import { PR_LINES } from '@/modules/pr/data/mockData';
import { DEFAULT_TERMS, FUNCTION } from './constants';

export const VENDORS = [
  { code: '108296', ref: '0000011297', name: 'Six Degrees BCW Pvt. Ltd.', city: 'Mumbai', email: 'rfq@sixdegrees-bcw.example', phone: '+91 90000 11297', categories: ['Electrical', 'Services'], rating: 4.6, pastRfqs: 18 },
  { code: '107703', ref: '0000010057', name: 'Prism International', city: 'Pune', email: 'sales@prism-intl.example', phone: '+91 90000 10057', categories: ['Mechanical', 'MRO'], rating: 4.2, pastRfqs: 11 },
  { code: '107105', ref: '0000010752', name: 'Integral Industrial', city: 'Ahmedabad', email: 'bids@integral-ind.example', phone: '+91 90000 10752', categories: ['MRO', 'Bearings'], rating: 4.4, pastRfqs: 23 },
  { code: '108505', ref: '0000011419', name: 'Integrated Solutions', city: 'New Delhi', email: 'tenders@integrated-sol.example', phone: '+91 90000 11419', categories: ['Electrical', 'Cables'], rating: 4.1, pastRfqs: 9 },
  { code: '108906', ref: '0000011462', name: 'EPS Transformers', city: 'Vadodara', email: 'quotes@eps-transformers.example', phone: '+91 90000 11462', categories: ['Electrical', 'Transformers'], rating: 4.7, pastRfqs: 31 },
  { code: '108840', ref: '0000011095', name: 'Shiv Shakti Engineering', city: 'Bellary', email: 'office@shivshakti-eng.example', phone: '+91 90000 11095', categories: ['Mechanical', 'Fabrication'], rating: 4.0, pastRfqs: 14 },
  { code: '100763', ref: '0000010668', name: 'Ambika Enterprises', city: 'Nagpur', email: 'ambika@ambika-ent.example', phone: '+91 90000 10668', categories: ['Safety', 'Consumables'], rating: 3.9, pastRfqs: 7 },
  { code: '108964', ref: '0000011461', name: 'V Electrical Services', city: 'Hyderabad', email: 'rfq@v-electrical.example', phone: '+91 90000 11461', categories: ['Electrical', 'Services'], rating: 4.3, pastRfqs: 16 },
  { code: '108719', ref: '0000010808', name: 'UPT Spares & Services', city: 'Chennai', email: 'sales@upt-spares.example', phone: '+91 90000 10808', categories: ['Mechanical', 'Spares'], rating: 4.5, pastRfqs: 20 },
];

export const vendorByCode = (code) => VENDORS.find((v) => v.code === code);

/** Build an RFQ item from a PR line. */
export const itemFromPrLine = (l, i) => ({
  id: l.id, lineItem: String((i + 1) * 10).padStart(5, '0'), type: l.prType, materialCode: l.materialCode, description: l.materialDesc,
  qty: l.qty, uom: l.uom, prNumber: l.prNumber, prLineItem: l.lineItem, prDate: l.prDate, purGroup: l.purGroup,
  plantCode: l.plantCode, plantAddress: l.city, ceilingPrice: Math.round((l.totalValue / l.qty) * 1.1),
});

const H = 3600e3;
const D = 24 * H;
const now = Date.now();
const iso = (ms) => new Date(ms).toISOString();
const items = (...ids) => ids.map((id, i) => itemFromPrLine(PR_LINES.find((l) => l.id === id), i));

const ev = (e) => ({
  round: 'R01', rfqId: `${e.eventId}_R01`, description: e.subject, function: FUNCTION, category: 'Asset Management', commodity: '026',
  assetClass: 'Opex', currency: 'INR', commercialReviewer: '', technicalEvaluator: '', supplierAssessmentEvaluator: '',
  activeDelegatee: '', previousDelegatee: '', terms: DEFAULT_TERMS, prAttachments: [], attachments: [], ...e,
});

export const EVENTS = [
  ev({
    eventId: '0000010040', subject: 'Transformer oil — rate contract FY27', status: 'Live', category: 'MRO & Spares', commodity: '031',
    start: iso(now - 3 * D), end: iso(now + 17 * H + 12 * 60e3), buyer: 'Chandra Sekhar', commercialReviewer: 'Meera Iyer',
    items: items('2000016191-00010'),
    vendors: [
      { code: '108906', vendorStatus: 'Accepted', bidStatus: 'Submitted', quotationId: '0000021230', submittedAt: iso(now - 30 * H), amount: 241500 },
      { code: '108964', vendorStatus: 'Accepted', bidStatus: 'Submitted', quotationId: '0000021231', submittedAt: iso(now - 20 * H), amount: 252000 },
      { code: '108505', vendorStatus: 'Accepted', bidStatus: 'Revised', quotationId: '0000021232', submittedAt: iso(now - 4 * H), amount: 238900 },
      { code: '100763', vendorStatus: 'Viewed', bidStatus: 'Not Submitted', quotationId: '0000021233' },
    ],
    attachments: [{ spec: 'Technical specification', name: 'IS-335 oil spec.pdf', size: '412 KB', sendToSupplier: true }],
  }),
  ev({
    eventId: '0000010039', subject: 'RFQ for procurement', status: 'Live',
    start: iso(now - 1 * D - 17 * H - 36 * 60e3), end: iso(now + 2 * D + 6 * H + 24 * 60e3), buyer: 'Deepak Kumar Jha',
    items: items('2000016173-00010'),
    vendors: [
      { code: '108296', vendorStatus: 'Accepted', bidStatus: 'Submitted', quotationId: '0000021220', submittedAt: iso(now - 5 * H), amount: 96 },
      { code: '107703', vendorStatus: 'Viewed', bidStatus: 'Not Submitted', quotationId: '0000021221' },
      { code: '107105', vendorStatus: 'Created', bidStatus: 'Not Submitted', quotationId: '0000021222' },
    ],
    attachments: [{ spec: 'Drawings', name: 'Sample PDF.pdf', size: '248 KB', sendToSupplier: false }],
  }),
  ev({
    eventId: '0000010041', subject: 'Crane wire ropes — Bellary works', status: 'Paused', category: 'MRO & Spares', commodity: '044',
    start: iso(now - 2 * D), end: iso(now + 1 * D + 4 * H), pausedRemaining: 1 * D + 4 * H, buyer: 'Rohit Menon',
    items: items('2000016190-00010'),
    vendors: [
      { code: '108840', vendorStatus: 'Accepted', bidStatus: 'Submitted', quotationId: '0000021240', submittedAt: iso(now - 26 * H), amount: 204800 },
      { code: '108719', vendorStatus: 'Viewed', bidStatus: 'Not Submitted', quotationId: '0000021241' },
    ],
  }),
  ev({
    eventId: '0000010038', subject: 'Procurement for DL', status: 'Closed',
    start: '2026-10-12T12:37:09+05:30', end: '2026-10-15T12:55:34+05:30', buyer: 'Deepak Kumar Jha',
    items: items('2000016182-00010', '2000016182-00020'),
    vendors: [
      { code: '108505', vendorStatus: 'Accepted', bidStatus: 'Submitted', quotationId: '0000021218', submittedAt: '2026-10-14T16:02:00+05:30', amount: 732000 },
      { code: '108296', vendorStatus: 'Accepted', bidStatus: 'Submitted', quotationId: '0000021219', submittedAt: '2026-10-15T10:41:00+05:30', amount: 748500 },
    ],
  }),
  ev({
    eventId: '0000010032', subject: 'Lab chemicals — Q3 consumables', status: 'Cancelled', category: 'MRO & Spares', commodity: '052',
    start: '2026-08-04T10:00:00+05:30', end: '2026-08-08T18:00:00+05:30', buyer: 'Neha Kulkarni', cancelReason: 'Requirement merged into Q4 PR',
    items: items('2000016193-00010'),
    vendors: [
      { code: '100763', vendorStatus: 'Viewed', bidStatus: 'Not Submitted', quotationId: '0000021150' },
      { code: '108719', vendorStatus: 'Created', bidStatus: 'Not Submitted', quotationId: '0000021151' },
    ],
  }),
  ev({
    eventId: '0000010010', subject: 'Kindly share the quote as per the SOW', status: 'Closed', category: 'Services', commodity: '061',
    start: '2026-06-09T13:10:47+05:30', end: '2026-06-11T23:57:21+05:30', buyer: 'Deepak Kumar Jha',
    items: items('2000016185-00010'),
    vendors: [
      { code: '108906', vendorStatus: 'Accepted', bidStatus: 'Submitted', quotationId: '0000021105', submittedAt: '2026-06-10T11:20:00+05:30', amount: 236000 },
      { code: '108840', vendorStatus: 'Accepted', bidStatus: 'Submitted', quotationId: '0000021106', submittedAt: '2026-06-11T09:05:00+05:30', amount: 229500 },
      { code: '100763', vendorStatus: 'Declined', bidStatus: 'Regretted', quotationId: '0000021107' },
      { code: '108964', vendorStatus: 'Accepted', bidStatus: 'Revised', quotationId: '0000021108', submittedAt: '2026-06-11T21:40:00+05:30', amount: 224900 },
      { code: '108719', vendorStatus: 'Viewed', bidStatus: 'Not Submitted', quotationId: '0000021109' },
    ],
  }),
].map((e) => ({
  ...e,
  activity: [
    { at: e.start, text: `RFQ published to ${e.vendors.length} vendors by ${e.buyer}`, tone: 'progress' },
    ...e.vendors.filter((v) => v.submittedAt).map((v) => ({ at: v.submittedAt, text: `${vendorByCode(v.code).name} ${v.bidStatus === 'Revised' ? 'revised its' : 'submitted a'} quotation`, tone: 'success' })),
    ...(e.status === 'Paused' ? [{ at: iso(now - 2 * H), text: 'RFQ paused by buyer', tone: 'warning' }] : []),
    ...(e.status === 'Closed' ? [{ at: e.end, text: 'Bid window closed', tone: 'inactive' }] : []),
    ...(e.status === 'Cancelled' ? [{ at: e.end, text: `RFQ cancelled — ${e.cancelReason}`, tone: 'error' }] : []),
  ].sort((a, b) => new Date(a.at) - new Date(b.at)),
}));
