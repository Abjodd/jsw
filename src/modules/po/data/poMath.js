// Pure calculations for POs / ASNs — keep UI components free of maths.

export const lineTaxable = (i) => i.qty * i.netPrice;
export const lineTax = (i) => lineTaxable(i) * (i.gstRate / 100);
export const lineTotal = (i) => lineTaxable(i) + lineTax(i);
export const toBeDelivered = (i) => Math.max(0, i.qty - i.deliveredQty);
export const availableForAsn = (i) => Math.max(0, i.qty - i.asnQty);

export const poTotal = (po) => po.items.reduce((s, i) => s + lineTotal(i), 0);
export const poPendingValue = (po) => po.items.reduce((s, i) => s + toBeDelivered(i) * i.netPrice * (1 + i.gstRate / 100), 0);
export const poDeliveredPct = (po) => {
  const q = po.items.reduce((s, i) => s + i.qty, 0);
  return q ? (po.items.reduce((s, i) => s + i.deliveredQty, 0) / q) * 100 : 0;
};
const today = () => new Date().toISOString().slice(0, 10);
export const isOverdue = (i) => toBeDelivered(i) > 0 && i.deliveryDate < today();
export const poOverdueItems = (po) => po.items.filter(isOverdue);
export const pendingChanges = (po) => po.items.filter((i) => i.deliveryChange?.status === 'Pending');

/** Intra-state → CGST + SGST, inter-state → IGST. */
export const gstSplit = (taxable, rate, intraState) =>
  intraState
    ? { igst: 0, cgst: (taxable * rate) / 200, sgst: (taxable * rate) / 200 }
    : { igst: (taxable * rate) / 100, cgst: 0, sgst: 0 };
