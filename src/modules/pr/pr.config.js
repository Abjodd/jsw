/**
 * PR MODULE — sidebar navigation.
 * Add a new screen: 1) create the page in ./pages  2) add it here  3) add a <Route> in PRModule.jsx
 */
import { LayoutDashboard, UserCheck } from 'lucide-react';

export const BASE = '/pr';

export const PR_NAV = [
  { label: 'Admin Dashboard', path: BASE, icon: LayoutDashboard, end: true },
  { label: 'Buyer Dashboard', path: `${BASE}/buyer`, icon: UserCheck },
];
