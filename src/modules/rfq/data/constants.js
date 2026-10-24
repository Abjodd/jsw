// RFQ module — option lists & status → colour mapping.

export const RFQ_STATUS_TONE = { Live: 'progress', Paused: 'warning', Closed: 'inactive', Cancelled: 'error' };
export const BID_STATUS_TONE = { Submitted: 'success', Revised: 'progress', 'Not Submitted': 'inactive', Regretted: 'error' };
export const VENDOR_STATUS_TONE = { Created: 'inactive', Viewed: 'progress', Accepted: 'success', Declined: 'error' };

export const RFQ_STATUSES = ['Live', 'Paused', 'Closed', 'Cancelled'];
export const BID_STATUSES = ['Submitted', 'Revised', 'Not Submitted', 'Regretted'];

export const GENERAL_CATEGORIES = ['Asset Management', 'Capital Goods', 'MRO & Spares', 'Services', 'IT & Telecom'];
export const COMMERCIAL_REVIEWERS = ['Ravi Shankar', 'Meera Iyer', 'Ankit Bansal'];
export const ATTACHMENT_SPECS = ['Drawings', 'Technical specification', 'Scope of work', 'BOQ', 'Other'];
export const FUNCTION = '014 (O&M Services)';

const PAYMENT = [
  '0012 - 100% within 45 days of error-free invoice',
  '0010 - 100% within 30 days of invoice',
  '0020 - 10% advance, 90% within 45 days of delivery',
  '0030 - 30% advance against ABG, balance on delivery',
];

/** Commercial T&C rows — used by Create RFQ (editable) and the event page (read-only). */
export const TERMS_FIELDS = [
  { key: 'paymentTerms', label: 'Payment terms', type: 'select', required: true, options: PAYMENT },
  { key: 'deliveryTerms', label: 'Delivery terms', type: 'select', required: true, options: ['DAS - Delivered at site', 'EXW - Ex works', 'FOR - Free on road (destination)', 'CIF - Cost, insurance & freight'] },
  { key: 'deliveryTimeline', label: 'Delivery timeline', type: 'text', required: true, placeholder: 'e.g. 45 Days' },
  { key: 'abg', label: 'ABG (advance bank guarantee)', type: 'text' },
  { key: 'pbg', label: 'PBG / Retention', type: 'text' },
  { key: 'cpbg', label: 'CPBG', type: 'text' },
  { key: 'ld', label: 'Liquidated damages', type: 'select', options: ['L00 - No LD', 'L05 - 0.5% per week, max 5%', 'L10 - 1% per week, max 10%'] },
  { key: 'ldPerformance', label: 'LD performance', type: 'text' },
  { key: 'warranty', label: 'Warranty / DLP', type: 'text' },
  { key: 'remarks', label: 'Remarks', type: 'text' },
];

export const DEFAULT_TERMS = {
  paymentTerms: PAYMENT[0], deliveryTerms: 'DAS - Delivered at site', deliveryTimeline: '45 Days',
  abg: 'NA', pbg: 'NA', cpbg: 'NA', ld: 'L00 - No LD', ldPerformance: 'NA', warranty: 'NA', remarks: 'NA',
};
