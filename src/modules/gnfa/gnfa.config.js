/**
 * GNFA MODULE — sidebar navigation.
 * Only two entries. GNFA Create Detail and the dashboard detail views live INSIDE the right panel
 * (routes below these two items), so they are intentionally not listed here.
 */
import { FilePlus2, LayoutDashboard } from 'lucide-react';

export const BASE = '/gnfa';

export const GNFA_NAV = [
  { label: 'GNFA Create', path: `${BASE}/create`, icon: FilePlus2 },
  { label: 'GNFA Dashboard', path: `${BASE}/dashboard`, icon: LayoutDashboard },
];
