import { createStore } from '@/utils/createStore';
import { POS } from './mockData';

/**
 * In-memory PO store (mock). Each action mirrors a future API call.
 *   const { pos } = poStore.useStore();
 */
export const poStore = createStore({ pos: POS });

const nowIso = () => new Date().toISOString();
const update = (poNumber, fn) => poStore.set((s) => ({ ...s, pos: s.pos.map((p) => (p.poNumber === poNumber ? fn(p) : p)) }));
const log = (p, text, tone, by) => [...p.activity, { at: nowIso(), text, tone, by }];

export const acknowledgePO = (poNumber, by) =>
  update(poNumber, (p) => ({ ...p, status: 'Acknowledged', activity: log(p, 'PO acknowledged', 'success', by) }));

export const addRemark = (poNumber, text, by) =>
  update(poNumber, (p) => ({ ...p, remarks: [...p.remarks, { text, by, at: nowIso() }], activity: log(p, `Remark added: “${text}”`, 'progress', by) }));

/** decisions: { [itemNo]: 'Approved' | 'Rejected' } */
export const decideDeliveryChanges = (poNumber, decisions, by) =>
  update(poNumber, (p) => {
    const entries = Object.entries(decisions);
    return {
      ...p,
      items: p.items.map((i) => {
        const d = decisions[i.itemNo];
        if (!d || !i.deliveryChange) return i;
        return { ...i, deliveryDate: d === 'Approved' ? i.deliveryChange.requestedDate : i.deliveryDate, deliveryChange: { ...i.deliveryChange, status: d } };
      }),
      activity: [
        ...p.activity,
        ...entries.map(([itemNo, d]) => ({ at: nowIso(), text: `Delivery date change for item ${itemNo} ${d.toLowerCase()}`, tone: d === 'Approved' ? 'success' : 'error', by })),
      ],
    };
  });

/** uploads: { [itemNo]: { name, size } } */
export const uploadDrawings = (poNumber, uploads, by) =>
  update(poNumber, (p) => ({
    ...p,
    items: p.items.map((i) => {
      const f = uploads[i.itemNo];
      if (!f) return i;
      const rev = String.fromCharCode(65 + i.drawings.length);
      return { ...i, drawings: [...i.drawings, { name: f.name, rev, at: nowIso(), by }] };
    }),
    activity: log(p, `${Object.keys(uploads).length} drawing(s) uploaded`, 'progress', by),
  }));

export const nextAsnNo = () => String(Math.max(...poStore.get().pos.flatMap((p) => p.asns.map((a) => Number(a.asnNo))), 8000004500) + 1);

/** asn: { asnNo, invoiceNo, invoiceDate, lines: [{ itemNo, qty }], value, ... } */
export const createAsn = (poNumber, asn, by) =>
  update(poNumber, (p) => ({
    ...p,
    status: p.status === 'New' || p.status === 'Pending Acknowledgement' ? 'Acknowledged' : p.status,
    items: p.items.map((i) => {
      const l = asn.lines.find((x) => x.itemNo === i.itemNo);
      return l ? { ...i, asnQty: i.asnQty + l.qty } : i;
    }),
    asns: [...p.asns, { ...asn, createdAt: nowIso(), status: 'In Transit' }],
    activity: log(p, `ASN ${asn.asnNo} created (invoice ${asn.invoiceNo})`, 'success', by),
  }));
