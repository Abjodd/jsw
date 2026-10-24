// Demo data for the home hub — replace with API responses.
export const SUMMARY = [
  { label: 'Open requisitions', value: '128', delta: 4.2 },
  { label: 'Live bid events', value: '12', delta: 9.1 },
  { label: 'Active RFQs', value: '47', delta: -2.4 },
  { label: 'POs released (MTD)', value: '214', delta: 12.6 },
  { label: 'Spend committed', value: '₹86.4 Cr', delta: 6.8 },
];

export const PENDING = [
  { id: 'PR-24-01873', module: 'PR', title: 'Refractory bricks — Blast Furnace 3', owner: 'Vijayanagar Works', due: 'Today', status: 'error', statusLabel: 'Overdue' },
  { id: 'RFQ-24-0412', module: 'RFQ', title: 'Hydraulic cylinders (12 nos.)', owner: 'Dolvi Works', due: 'Today, 5:00 PM', status: 'warning', statusLabel: 'Closing' },
  { id: 'BID-24-0098', module: 'BID', title: 'Conveyor belt annual rate contract', owner: 'Salem Works', due: '26 Oct', status: 'progress', statusLabel: 'Evaluation' },
  { id: 'GNFA-24-0231', module: 'GNFA', title: 'Safety PPE — emergency procurement', owner: 'Corporate', due: '27 Oct', status: 'warning', statusLabel: 'Pending' },
  { id: 'PO-24-07719', module: 'PO', title: 'Amendment: delivery schedule revision', owner: 'Vijayanagar Works', due: '29 Oct', status: 'progress', statusLabel: 'In Progress' },
];

export const ACTIVITY = [
  { module: 'PO', text: 'PO-24-07702 released to Larsen Industrial Supplies', time: '12 min ago', status: 'success' },
  { module: 'BID', text: 'Technical evaluation completed for BID-24-0095', time: '48 min ago', status: 'success' },
  { module: 'RFQ', text: '4 new vendor quotes received on RFQ-24-0408', time: '1 hr ago', status: 'progress' },
  { module: 'PR', text: 'PR-24-01866 sent back for clarification', time: '2 hr ago', status: 'warning' },
  { module: 'GNFA', text: 'GNFA-24-0228 approved by Plant Head', time: 'Yesterday', status: 'success' },
];
