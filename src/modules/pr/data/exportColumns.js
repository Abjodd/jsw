import { formatDate } from '@/utils/format';

/** Full column set for CSV download (mirrors the SAP grid). */
export const PR_EXPORT_COLUMNS = [
  ['Priority', (l) => l.priority], ['PR Type', (l) => l.prType], ['Document Type', (l) => l.docType],
  ['Send Back To User', (l) => (l.sendBack ? `Issue in PR – ${l.sendBack.reason}` : '')],
  ['PR Number', (l) => l.prNumber], ['PR Date', (l) => formatDate(l.prDate)], ['Requisitioner', (l) => l.requisitioner],
  ['Active Buyer', (l) => l.activeBuyer], ['Previous Buyer', (l) => l.previousBuyer], ['Buyer 2', (l) => l.buyer2], ['Buyer 3', (l) => l.buyer3],
  ['Release Status', (l) => l.releaseStatus], ['PR Line Item', (l) => l.lineItem], ['Material Code', (l) => l.materialCode],
  ['Material Description', (l) => l.materialDesc], ['Material Group', (l) => l.materialGroup], ['NFA Type', (l) => l.nfaType],
  ['OPEX / CAPEX', (l) => l.opexCapex], ['PR Qty', (l) => l.qty], ['UoM', (l) => l.uom], ['Plant Code', (l) => l.plantCode],
  ['City', (l) => l.city], ['Pur Group & Description', (l) => l.purGroup], ['Total PR Value', (l) => l.totalValue],
  ['First Release Date', (l) => l.firstRelease && formatDate(l.firstRelease)], ['Updated Release Date', (l) => l.updatedRelease && formatDate(l.updatedRelease)],
  ['PR Assignment Status', (l) => l.assignmentStatus], ['PR-RFQ Status', (l) => l.rfqStatus], ['Last PO No', (l) => l.lastPoNo],
  ['Last PO Line Item', (l) => l.lastPoLine], ['Currency', (l) => l.currency], ['Last PO Vendor', (l) => l.lastPoVendor],
  ['Service Line Item Details', (l) => l.serviceLines],
].map(([label, value]) => ({ label, value }));
