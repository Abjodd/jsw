/**
 * GNFA MODULE — sidebar navigation.
 * Add a new screen: 1) create the page in ./pages  2) add it here  3) add a <Route> in GNFAModule.jsx
 */
import { LayoutDashboard, ListChecks, FilePlus2, BadgeCheck, FileSearch, BarChart3 } from 'lucide-react';

export const BASE = '/gnfa';

export const GNFA_NAV = [
  { label: 'Overview', path: BASE, icon: LayoutDashboard, end: true },
  { label: 'GNFA Requests', path: `${BASE}/requests`, icon: ListChecks },
  { label: 'Create GNFA', path: `${BASE}/create`, icon: FilePlus2 },
  { label: 'Approvals', path: `${BASE}/approvals`, icon: BadgeCheck },
  { label: 'GNFA Details', path: `${BASE}/details`, icon: FileSearch },
  { label: 'Reports', path: `${BASE}/reports`, icon: BarChart3 },
];
