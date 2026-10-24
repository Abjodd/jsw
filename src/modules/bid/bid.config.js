/**
 * BID MODULE — sidebar navigation.
 * Only screens referenced in the specification are listed here.
 */
import { LayoutDashboard, Send, Columns3 } from 'lucide-react';

export const BASE = '/bid';

export const BID_NAV = [
  { label: 'Overview', path: BASE, icon: LayoutDashboard, end: true },
  { label: 'Bid Submission', path: `${BASE}/submission`, icon: Send },
  { label: 'Bid Comparison', path: `${BASE}/comparison`, icon: Columns3 },
];
