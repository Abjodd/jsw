/**
 * PO MODULE — sidebar navigation.
 * Add a new screen: 1) create the page in ./pages  2) add it here  3) add a <Route> in POModule.jsx
 */
import { LayoutDashboard, ListChecks, FilePlus2, FileSearch, FilePen, Truck } from 'lucide-react';

export const BASE = '/po';

export const PO_NAV = [
  { label: 'Overview', path: BASE, icon: LayoutDashboard, end: true },
  { label: 'All Purchase Orders', path: `${BASE}/list`, icon: ListChecks },
  { label: 'Create PO', path: `${BASE}/create`, icon: FilePlus2 },
  { label: 'PO Details', path: `${BASE}/details`, icon: FileSearch },
  { label: 'Amendments', path: `${BASE}/amendments`, icon: FilePen },
  { label: 'Delivery Tracking', path: `${BASE}/deliveries`, icon: Truck },
];
