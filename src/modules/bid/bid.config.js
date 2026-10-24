/**
 * BID MODULE — sidebar navigation.
 * Add a new screen: 1) create the page in ./pages  2) add it here  3) add a <Route> in BIDModule.jsx
 */
import { LayoutDashboard, ListChecks, FilePlus2, ClipboardCheck, Columns3, Trophy } from 'lucide-react';

export const BASE = '/bid';

export const BID_NAV = [
  { label: 'Overview', path: BASE, icon: LayoutDashboard, end: true },
  { label: 'Bid Events', path: `${BASE}/events`, icon: ListChecks },
  { label: 'Create Bid', path: `${BASE}/create`, icon: FilePlus2 },
  { label: 'Techno-Commercial Evaluation', path: `${BASE}/evaluation`, icon: ClipboardCheck },
  { label: 'Bid Comparison', path: `${BASE}/comparison`, icon: Columns3 },
  { label: 'Award & Closure', path: `${BASE}/award`, icon: Trophy },
];
