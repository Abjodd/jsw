import { vendorByCode } from '../data/mockData';

/** Derived numbers for an RFQ event (bids, L1, ceiling value…). */
export default function getEventStats(e) {
  const bids = e.vendors.filter((v) => v.bidStatus === 'Submitted' || v.bidStatus === 'Revised');
  const l1 = bids.reduce((m, v) => (!m || v.amount < m.amount ? v : m), null);
  const ceiling = e.items.reduce((s, i) => s + i.ceilingPrice * i.qty, 0);
  return {
    bids: bids.length,
    invited: e.vendors.length,
    l1,
    l1Vendor: l1 && vendorByCode(l1.code),
    ceiling,
    savingsPct: l1 && ceiling ? ((ceiling - l1.amount) / ceiling) * 100 : null,
  };
}
