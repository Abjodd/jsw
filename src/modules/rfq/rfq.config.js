/**
 * RFQ MODULE — sidebar navigation.
 * Add a new screen: 1) create the page in ./pages  2) add it here  3) add a <Route> in RFQModule.jsx
 * `match` keeps "RFQ Dashboard" highlighted on event detail pages.
 */
import { FilePlus2, LayoutDashboard } from 'lucide-react';

export const BASE = '/rfq';

export const RFQ_NAV = [
  { label: 'RFQ Dashboard', path: BASE, icon: LayoutDashboard, match: (p) => p === BASE || p.startsWith(`${BASE}/events`) },
  { label: 'Create RFQ', path: `${BASE}/create`, icon: FilePlus2 },
];
