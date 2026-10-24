/**
 * PR MODULE — sidebar navigation.
 * Add a new screen: 1) create the page in ./pages  2) add it here  3) add a <Route> in PRModule.jsx
 */
import { LayoutDashboard, ListChecks, FilePlus2, FileSearch, BadgeCheck, BarChart3 } from 'lucide-react';

export const BASE = '/pr';

export const PR_NAV = [
  { label: 'Overview', path: BASE, icon: LayoutDashboard, end: true },
  { label: 'All Requisitions', path: `${BASE}/list`, icon: ListChecks },
  { label: 'Create Requisition', path: `${BASE}/create`, icon: FilePlus2 },
  { label: 'Requisition Details', path: `${BASE}/details`, icon: FileSearch },
  { label: 'Approvals', path: `${BASE}/approvals`, icon: BadgeCheck },
  { label: 'Reports', path: `${BASE}/reports`, icon: BarChart3 },
];
