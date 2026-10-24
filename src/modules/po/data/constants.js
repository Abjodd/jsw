// PO module — option lists & status → colour mapping.

export const PO_STATUS_TONE = {
  New: 'progress',
  'Pending Acknowledgement': 'warning',
  Acknowledged: 'success',
  'Partially Delivered': 'progress',
  Closed: 'inactive',
};
export const PO_STATUSES = Object.keys(PO_STATUS_TONE);
/** Compact labels for tables (full label shown on hover). */
export const STATUS_SHORT = { 'Pending Acknowledgement': 'Pending ack.', 'Partially Delivered': 'Part delivered' };

export const DELIVERY_CHANGE_TONE = { Pending: 'warning', Approved: 'success', Rejected: 'error' };
export const ASN_STATUS_TONE = { 'In Transit': 'progress', 'Gate Entry': 'warning', Received: 'success' };

export const PO_TYPES = ['STD PO U1', 'STD PO U2', 'Service PO', 'Capex PO'];
export const PLANTS = [
  { code: 'TA02', name: 'TATPL Unit-I', state: 'Gujarat' },
  { code: 'TA07', name: 'TATPL Unit-II', state: 'Gujarat' },
];
export const PURCHASE_GROUPS = [
  { code: '001', name: 'General Purchasing' },
  { code: '110', name: 'Maintenance Purchase' },
  { code: 'CPS', name: 'Strategic Sourcing' },
  { code: 'CP2', name: 'Consumables – Indirect' },
];
export const ASN_DOCUMENTS = [
  { key: 'invoice', label: 'Invoice', required: true, hint: 'Tax invoice PDF signed by supplier' },
  { key: 'pdi', label: 'PDI report', required: false, hint: 'Pre-dispatch inspection report' },
  { key: 'mtc', label: 'Material test certificate', required: false, hint: 'Required for RM Import / critical items' },
  { key: 'others', label: 'Others', required: false, hint: 'E-way bill, LR copy, packing list…' },
];
export const REMARKS_LIMIT = 500;
