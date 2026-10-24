// Demo data for the GNFA module, taken from the GNFA reference screenshots.
// Delete once the APIs in ../services/gnfaApi.js are wired.
// ───────────────────────── GNFA CREATE: events ─────────────────────────
// Search by short id (10038) or full id (0000010038). Anything not listed (e.g. 10077) = "no lines found" empty state.
const line = (ev, n, pr, material, description, qty, uom, total = '0.00') => ({
  id: `L${n}`, rfqId: `${ev}_R01`, rfqLine: String(n * 10).padStart(5, '0'), pr, prLine: String(n * 10).padStart(5, '0'),
  total, material, description, qty, uom,
});

export const EVENTS = {
  // Happy path — exactly the screenshot data (2 lines, totals 0.00 until awarded)
  10038: { id: '0000010038', short: '10038', round: 'R01', lines: [
    { id: 'L1', rfqId: '0000010038_R01', rfqLine: '00010', pr: '2000016182', prLine: '00010', total: '0.00', material: '13050122', description: '11kv Resin cast CT,CTR:650/1-1 A', qty: '6.00', uom: 'EA' },
    { id: 'L2', rfqId: '0000010038_R01', rfqLine: '00020', pr: '2000016182', prLine: '00020', total: '0.00', material: '13030128', description: 'Transportation charges', qty: '1.00', uom: 'NOS' },
  ] },
  // Single-line event — select-all equals one row
  10052: { id: '0000010052', short: '10052', round: 'R01', lines: [
    line('0000010052', 1, '2000016340', '13040211', 'Centrifugal pump mechanical seal kit', '4.00', 'EA', '1,86,400.00'),
  ] },
  // Many-line event — scrolling, partial selection, select-all
  10061: { id: '0000010061', short: '10061', round: 'R02', lines: [
    line('0000010061', 1, '2000016411', '13020045', 'Gate valve 150NB CL300 CS', '12.00', 'EA', '2,40,000.00'),
    line('0000010061', 2, '2000016411', '13020046', 'Globe valve 100NB CL300 CS', '8.00', 'EA', '1,12,800.00'),
    line('0000010061', 3, '2000016412', '13060130', 'Spiral wound gasket 150NB', '60.00', 'EA', '27,000.00'),
    line('0000010061', 4, '2000016412', '13060131', 'Stud bolt set M24 x 140', '40.00', 'SET', '18,400.00'),
    line('0000010061', 5, '2000016413', '13030128', 'Transportation charges', '1.00', 'NOS', '9,500.00'),
  ] },
};

// Backwards-compatible aliases (the default event shown when the page opens)
export const EVENT = EVENTS[10038];
export const RFQ_LINES = EVENTS[10038].lines;

export const USER_REQUIREMENT = {
  nfaId: '', nfaType: 'GENERAL', purchaseGroup: '014', eventId: '0000010038',
  contractType: 'PO', groupDetails: 'NAS18', totalPr: '3,88,000.00', totalNfa: '1,378.99',
};

export const PR_LINES = [
  { id: 'P1', pr: '2000016182', line: '00010', description: '11kv Resin cast CT,CTR:650/1-1 A', release: '12.10.2026', company: '3900', plant: '3901', plantName: 'Sabarkantha', budget: '3,72,000.00' },
  { id: 'P2', pr: '2000016182', line: '00020', description: 'Transportation charges', release: '12.10.2026', company: '3900', plant: '3901', plantName: 'Sabarkantha', budget: '16,000.00' },
];

export const BIDDING = [
  ['PR Revision After Initial RFQ', 'Yes'], ['RFQ End Date', '12.10.2026'],
  ['Bidding Mode', 'AzuPro 360'], ['RFQ Timeline Extension', 'No'],
  ['RFQ Sent to Vendors', '2'], ['RFQ Closure Type', 'Forced'],
  ['Bidding Rounds', '01'], ['Approval for RFQ Extension', 'No'],
  ['RFQ Initiation Date', '12.10.2026'], ['Buyer', 'Deepak Kumar Jha'],
];

export const PROPOSED = { quoted: '2.00', shortlisted: '1' };
export const AWARDED = [
  { id: 'A1', supplier: 'INTEGRATED SOLUTIONS', amount: '1,343.87', currency: 'INR', rank: 'L2', savings: '0.00', existing: 'Existing', lastPoDate: '21.10.2025' },
];

const lines = [
  { line: '00010', description: '11kv Resin cast CT,CTR:650/1-1 A', qty: '6.00', uom: 'EA', sdI: '152.88', sdF: '152.88', isI: '1,199.88', isF: '1,199.88', lowV: 'SIX DEGREES BCW PRIVATE LIMITE', lowF: '152.88', poVal: '3,12,000.00', poDate: '18.02.2026', poVen: '0000108841' },
  { line: '00020', description: 'Transportation charges', qty: '1.00', uom: 'NOS', sdI: '24.50', sdF: '24.50', isI: '27.44', isF: '27.44', lowV: 'SIX DEGREES BCW PRIVATE LIMITE', lowF: '24.50', poVal: '2,000.00', poDate: '10.07.2026', poVen: '0000106120' },
];
export const COMPARATIVE = [
  ...lines.map((l) => ({ id: l.line, type: 'Supply', delivery: 'Sabarkantha', poLoc: 'Sabarkantha', ...l })),
  { id: 'T1', description: 'Total Price (Without GST)', sdI: '0.00', sdF: '177.38', isI: '0.00', isF: '1,227.32', total: true },
  { id: 'T2', description: 'Total Price (With GST)', sdI: '0.00', sdF: '227.05', isI: '0.00', isF: '1,378.99', total: true },
  { id: 'T3', description: 'Commercial Rank (With GST)', sdI: '', sdF: 'L1', isI: '', isF: 'L2', total: true },
];

export const TERMS = [
  ['Payment Terms', '0012 - 100% pay relse wtin 45 dys agnst submsn eror fee i', 'Accepted', 'Accepted'],
  ['Delivery Terms', 'DAS - Delivered at site', 'Accepted', 'Accepted'],
  ['Delivery Timeline', '40 Days', 'Accepted', 'Accepted'],
  ['ABG', 'NA', 'Accepted', 'Accepted'],
  ['PBG/Retention', 'NA', 'Accepted', 'Accepted'],
  ['CPBG', 'NA', 'Accepted', 'Accepted'],
  ['Liquidated Damage', 'L00 - NO LD', 'Accepted', 'Accepted'],
  ['LD Performance', 'NA', 'Accepted', 'Accepted'],
  ['Warranty/DLP', '5 Years', 'Accepted', 'Accepted'],
  ['Remarks', 'NA', 'Accepted', 'Accepted'],
  ['GCC Terms', 'GCC', 'Accepted With Remarks', 'Accepted'],
].map(([term, buyer, v1, v2], i) => ({ id: `T${i}`, term, buyer, v1, v2 }));

export const ATTACHMENTS = {
  pr: [{ id: 'a1', detail: 'PR Attachment', pr: '2000016182', spec: 'Certificate', link: 'O&M TEMPLET_CT.XLSX' }],
  rfq: [{ id: 'a2', sno: '1', spec: 'Scope Of Work', link: 'Sample PDF.pdf' }],
  bid: [],
};

// ───────────────────────── GNFA DASHBOARD ─────────────────────────
// One NFA per status so every badge, the Recall rule and each approval state can be exercised.
const nfa = (nfaId, eventId, group, buyer, status, pendingWith, pendingSince, created, po = '') =>
  ({ id: nfaId, nfaId, eventId, group, scope: '', buyer, status, pendingWith, pendingSince, created, po });

export const NFA_LIST = [
  nfa('0000050022', '0000010038', '014 (O&M Services)', 'Deepak Kumar Jha', 'Under Approval', 'AZ1553 Sourin Nandi', '22 Oct 2026, 19:41', '22 Oct 2026, 19:41'),
  nfa('0000050031', '0000010052', '011 (Mechanical Spares)', 'Anita Rao', 'Approved', '', '', '14 Oct 2026, 11:20', 'Purchase Order'),
  nfa('0000050040', '0000010061', '012 (Valves & Fittings)', 'Rohit Mehta', 'Rejected', '', '', '09 Oct 2026, 16:05'),
  nfa('0000050047', '0000010061', '012 (Valves & Fittings)', 'Rohit Mehta', 'Query Raised', 'AZ1620 Chandan Raina', '21 Oct 2026, 09:12', '20 Oct 2026, 15:48'),
  nfa('0000050053', '0000010052', '011 (Mechanical Spares)', 'Anita Rao', 'Recalled', '', '', '12 Oct 2026, 10:30'),
  nfa('0000050058', '0000010038', '014 (O&M Services)', 'Deepak Kumar Jha', 'Overdue', 'AZ1553 Sourin Nandi', '02 Oct 2026, 10:15', '02 Oct 2026, 10:15'),
];

/** Badge tone per NFA status (StatusBadge `status` values) */
export const NFA_STATUS_TONE = {
  'Under Approval': 'warning', Approved: 'success', Rejected: 'error',
  'Query Raised': 'progress', Recalled: 'inactive', Overdue: 'error',
};

const SIX = [
  { id: 'w1', role: 'HOD-USER DEPARTMENT', name: 'Sourin Nandi' },
  { id: 'w2', role: 'HOD-SCM', name: 'Chandan Raina' },
  { id: 'w3', role: 'BUDGET CONTROLLER', name: 'Sakshi Sonthalia' },
];
const flow = (...states) => SIX.map((w, i) => ({ ...w, state: states[i] }));   // done | current | waiting | rejected

const SUMMARY = {
  plant: 'Sabarkantha', budget: '3,88,000.00', nfaAmount: '1,378.99', quoted: '2.00', shortlisted: '1', diff: '1,151.94',
};
export const EXEC_SUMMARY = SUMMARY;   // alias used by the Detailed view

/** Per-NFA Executive Summary, Work Flow and Raise Query data. Unlisted NFAs fall back to the first entry. */
export const NFA_DETAILS = {
  '0000050022': { exec: SUMMARY, workflow: flow('current', 'waiting', 'waiting'), queries: [] },
  '0000050031': { exec: { plant: 'Dolvi Works', budget: '2,10,000.00', nfaAmount: '1,86,400.00', quoted: '3.00', shortlisted: '1', diff: '14,200.00' }, workflow: flow('done', 'done', 'done'), queries: [] },
  '0000050040': { exec: { plant: 'Vijayanagar Works', budget: '4,50,000.00', nfaAmount: '4,07,700.00', quoted: '2.00', shortlisted: '1', diff: '31,500.00' }, workflow: flow('done', 'rejected', 'waiting'), queries: [] },
  '0000050047': { exec: { plant: 'Vijayanagar Works', budget: '4,50,000.00', nfaAmount: '4,07,700.00', quoted: '2.00', shortlisted: '1', diff: '31,500.00' }, workflow: flow('done', 'current', 'waiting'), queries: [
    { id: 'q1', inquiry: 'Please confirm the delivery schedule for the valve lots.', response: 'Lots 1–2 in 30 days, lot 3 in 45 days.', by: 'Chandan Raina', on: '21 Oct 2026, 09:12' },
    { id: 'q2', inquiry: 'Why is the gasket rate higher than the last PO?', response: '', by: 'Chandan Raina', on: '21 Oct 2026, 09:40' },
  ] },
  '0000050053': { exec: { plant: 'Dolvi Works', budget: '2,10,000.00', nfaAmount: '1,86,400.00', quoted: '3.00', shortlisted: '1', diff: '14,200.00' }, workflow: flow('waiting', 'waiting', 'waiting'), queries: [] },
  '0000050058': { exec: SUMMARY, workflow: flow('current', 'waiting', 'waiting'), queries: [] },
};
export const WORKFLOW = NFA_DETAILS['0000050022'].workflow;   // kept for compatibility

// ───────────────────────── TEST CASES ─────────────────────────
// Each row says which mock record exercises it. Mirrors src/gnfa.test.jsx.
export const TEST_CASES = [
  { id: 'NAV-1', area: 'Navigation', scenario: 'Sidebar shows only GNFA Create and GNFA Dashboard; /gnfa lands on Create', data: '—' },
  { id: 'CR-1', area: 'GNFA Create', scenario: 'Default event loads 2 lines; Create GNFA disabled until a row is selected', data: 'Event 10038' },
  { id: 'CR-2', area: 'GNFA Create', scenario: 'Search by short id (10038) and full id (0000010038) return the same lines', data: 'Event 10038' },
  { id: 'CR-3', area: 'GNFA Create', scenario: 'Single-line event: select-all selects the only row', data: 'Event 10052' },
  { id: 'CR-4', area: 'GNFA Create', scenario: 'Five-line event: partial selection shows "2 / 5"; select-all shows "5 / 5"', data: 'Event 10061' },
  { id: 'CR-5', area: 'GNFA Create', scenario: 'Unknown event shows "No lines found for event …"; Clear resets to "Search for an event"', data: 'Event 10077' },
  { id: 'CD-1', area: 'Create Detail', scenario: 'Create GNFA opens detail in the same panel; all 9 tabs render; sidebar unchanged', data: 'Event 10038' },
  { id: 'CD-2', area: 'Create Detail', scenario: 'Deviations / Others inputs accept typing; Yes/No radios switch', data: '—' },
  { id: 'CD-3', area: 'Create Detail', scenario: 'Submit NFA returns to the dashboard', data: '—' },
  { id: 'DB-1', area: 'Dashboard', scenario: 'All 6 NFAs listed, one per status, each with the right badge tone', data: 'NFA_LIST' },
  { id: 'DB-2', area: 'Dashboard', scenario: 'Filter by Event ID 10061 returns 2 NFAs; by NFA ID 50022 returns 1; no match shows "No NFAs found"', data: '10061 / 50022 / 1234' },
  { id: 'DB-3', area: 'Dashboard', scenario: 'Recall enabled only for Under Approval and Overdue; recalling sets status Recalled', data: '0000050022' },
  { id: 'DB-4', area: 'Dashboard', scenario: 'PO Number link shows only for Approved', data: '0000050031' },
  { id: 'DD-1', area: 'NFA views', scenario: 'Executive Summary, Detailed (6 sections), Attachment, Work Flow all render', data: '0000050022' },
  { id: 'DD-2', area: 'NFA views', scenario: 'Approved: all three approvers marked approved', data: '0000050031' },
  { id: 'DD-3', area: 'NFA views', scenario: 'Rejected: second approver marked rejected, third waiting', data: '0000050040' },
  { id: 'DD-4', area: 'NFA views', scenario: 'Query Raised: Raise Query table lists 2 queries (one without a buyer response)', data: '0000050047' },
  { id: 'DD-5', area: 'NFA views', scenario: 'Unknown NFA id shows "No NFA …" empty state', data: '/gnfa/dashboard/9999999999' },
];

// Awarded Vendors Information and VDD. The screenshots show only the table header and the first row labels
// ("Incorporation Year", "Business…"); the values below are ILLUSTRATIVE placeholders — replace with the vendor master data.
export const VENDOR_INFO = [
  { id: 'v1', attribute: 'Incorporation Year', value: '2012' },
  { id: 'v2', attribute: 'Business Type', value: 'Private Limited' },
];
