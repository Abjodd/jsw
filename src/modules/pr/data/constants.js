// PR module — option lists & status → colour mapping (keep UI consistent).

export const PRIORITIES = {
  P0: { label: 'P0', name: 'Critical', tone: 'error', description: 'Plant-stopping or safety-critical. Process within 24 hours.' },
  P1: { label: 'P1', name: 'High', tone: 'warning', description: 'Needed this week. Expedite sourcing.' },
  P2: { label: 'P2', name: 'Normal', tone: 'progress', description: 'Standard lead time.' },
};

export const ASSIGNMENT_TONE = { Assigned: 'success', 'Re-Assigned': 'progress', Unassigned: 'warning' };
export const RFQ_STATUS_TONE = { 'RFQ Pending': 'warning', 'RFQ Created': 'success', 'Repeat Order': 'progress', 'Direct NFA': 'progress' };
export const RELEASE_TONE = { Released: 'success', 'Not Released': 'inactive' };

export const PURCHASE_GROUPS = ['014 - O&M Services', '011 - Electrical', '021 - Mechanical Spares', '030 - Civil Works'];
export const DOCUMENT_TYPES = ['ZNB', 'ZSER', 'ZCAP'];
export const RELEASE_STATUSES = ['Released', 'Not Released'];
export const ASSIGNMENT_STATUSES = ['Unassigned', 'Assigned', 'Re-Assigned'];
export const RFQ_STATUSES = ['RFQ Pending', 'RFQ Created', 'Repeat Order', 'Direct NFA'];

export const SEND_BACK_REASONS = [
  'Incomplete technical specification',
  'Incorrect material code / UoM',
  'Budget / cost centre not approved',
  'Duplicate requisition',
  'Other',
];

export const NFA_TYPES = ['Single Source', 'Proprietary (OEM)', 'Emergency', 'Rate Contract Extension'];
