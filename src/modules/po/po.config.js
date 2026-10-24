/**
 * PO MODULE — sidebar navigation.
 * Add a new screen: 1) create the page in ./pages  2) add it here  3) add a <Route> in POModule.jsx
 */
import { ClipboardList, Truck } from 'lucide-react';

export const BASE = '/po';

export const PO_NAV = [
  // stays active on /po/:poNumber and /po/:poNumber/asn
  { label: 'Purchase Orders', path: BASE, icon: ClipboardList, match: (p) => p === BASE || (/^\/po\/\d+/.test(p)) },
  { label: 'ASN Register', path: `${BASE}/asns`, icon: Truck },
];
