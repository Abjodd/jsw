/**
 * MODULE REGISTRY
 * ---------------------------------------------------------------------
 * Drives: home-page tiles, top-level routes and each module's sidebar.
 * To add a sub-page to a module, edit that module's `<code>.config.js`
 * inside src/modules/<code>/ — not this file.
 *
 * Tile stats below are demo values; replace with API data later.
 */
import { FileText, Gavel, MessageSquareQuote, ShieldCheck, ShoppingCart } from 'lucide-react';

export const MODULES = [
  {
    id: 'pr',
    code: 'PR',
    name: 'Purchase Requisition',
    path: '/pr',
    icon: FileText,
    description: 'Raise, track and approve material & service requisitions across plants.',
    stats: [
      { label: 'Open', value: 128 },
      { label: 'Awaiting approval', value: 34, status: 'warning' },
      { label: 'Overdue', value: 6, status: 'error' },
    ],
    progress: 72,
    progressLabel: 'Approval SLA met',
  },
  {
    id: 'bid',
    code: 'BID',
    name: 'Bid Management',
    path: '/bid',
    icon: Gavel,
    description: 'Run bid events, evaluate techno-commercial offers and award vendors.',
    stats: [
      { label: 'Live events', value: 12, status: 'progress' },
      { label: 'Under evaluation', value: 9, status: 'warning' },
      { label: 'Awarded (MTD)', value: 21, status: 'success' },
    ],
    progress: 64,
    progressLabel: 'Evaluation completed',
  },
  {
    id: 'rfq',
    code: 'RFQ',
    name: 'Request for Quotation',
    path: '/rfq',
    icon: MessageSquareQuote,
    description: 'Float RFQs, collect vendor quotes and compare responses side by side.',
    stats: [
      { label: 'Active RFQs', value: 47, status: 'progress' },
      { label: 'Quotes received', value: 186 },
      { label: 'Closing today', value: 5, status: 'warning' },
    ],
    progress: 81,
    progressLabel: 'Vendor response rate',
  },
  {
    id: 'gnfa',
    code: 'GNFA',
    name: 'GNFA',
    path: '/gnfa',
    icon: ShieldCheck,
    description: 'Manage GNFA requests, approval workflows and compliance reporting.',
    stats: [
      { label: 'Requests', value: 63 },
      { label: 'Pending', value: 17, status: 'warning' },
      { label: 'Approved', value: 41, status: 'success' },
    ],
    progress: 58,
    progressLabel: 'Closed this quarter',
  },
  {
    id: 'po',
    code: 'PO',
    name: 'Purchase Orders',
    path: '/po',
    icon: ShoppingCart,
    description: 'Create, release and amend purchase orders and follow delivery status.',
    stats: [
      { label: 'Released', value: 214, status: 'success' },
      { label: 'In amendment', value: 11, status: 'progress' },
      { label: 'Delivery overdue', value: 8, status: 'error' },
    ],
    progress: 88,
    progressLabel: 'On-time delivery',
  },
];

export const getModule = (id) => MODULES.find((m) => m.id === id);
