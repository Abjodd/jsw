/**
 * RFQ MODULE — sidebar navigation.
 * Add a new screen: 1) create the page in ./pages  2) add it here  3) add a <Route> in RFQModule.jsx
 */
import { LayoutDashboard, ListChecks, FilePlus2, Inbox, Columns3, Users } from 'lucide-react';

export const BASE = '/rfq';

export const RFQ_NAV = [
  { label: 'Overview', path: BASE, icon: LayoutDashboard, end: true },
  { label: 'All RFQs', path: `${BASE}/list`, icon: ListChecks },
  { label: 'Create RFQ', path: `${BASE}/create`, icon: FilePlus2 },
  { label: 'Vendor Responses', path: `${BASE}/responses`, icon: Inbox },
  { label: 'Quote Comparison', path: `${BASE}/comparison`, icon: Columns3 },
  { label: 'Vendors', path: `${BASE}/vendors`, icon: Users },
];
