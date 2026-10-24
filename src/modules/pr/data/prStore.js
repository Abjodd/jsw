import { createStore } from '@/utils/createStore';
import { PR_LINES } from './mockData';

/**
 * In-memory PR store (mock). Every action mirrors a future API call.
 * Read:   const { lines } = prStore.useStore();
 * Write:  assignBuyer(ids, 'Sahil Arora')
 */
export const prStore = createStore({ lines: PR_LINES });

const now = () => new Date().toISOString();
const update = (ids, fn) =>
  prStore.set((s) => ({ ...s, lines: s.lines.map((l) => (ids.includes(l.id) ? fn(l) : l)) }));
const log = (l, text, tone = 'progress') => [...l.activity, { at: now(), text, tone }];

export const assignBuyer = (ids, buyer, note) =>
  update(ids, (l) => {
    const reassign = Boolean(l.activeBuyer) && l.activeBuyer !== buyer;
    return {
      ...l,
      previousBuyer: reassign ? l.activeBuyer : l.previousBuyer,
      activeBuyer: buyer,
      assignmentStatus: reassign ? 'Re-Assigned' : 'Assigned',
      activity: log(l, `${reassign ? 'Re-assigned' : 'Assigned'} to ${buyer}${note ? ` — “${note}”` : ''}`),
    };
  });

export const changePriority = (ids, priority) =>
  update(ids, (l) => ({ ...l, priority, activity: log(l, `Priority changed ${l.priority} → ${priority}`, 'warning') }));

export const sendBackToUser = (ids, reason, comment) =>
  update(ids, (l) => ({ ...l, sendBack: { reason, comment }, activity: log(l, `Sent back to ${l.requisitioner} — ${reason}`, 'error') }));

export const markRfqCreated = (ids, eventId) =>
  update(ids, (l) => ({ ...l, rfqStatus: 'RFQ Created', rfqEventId: eventId, activity: log(l, `RFQ event ${eventId} created`, 'success') }));

export const processRepeatOrder = (ids) =>
  update(ids, (l) => ({ ...l, rfqStatus: 'Repeat Order', activity: log(l, `Repeat order raised against PO ${l.lastPoNo}`, 'success') }));

export const raiseDirectNfa = (ids, nfaType) =>
  update(ids, (l) => ({ ...l, rfqStatus: 'Direct NFA', nfaType, activity: log(l, `Direct NFA raised (${nfaType})`, 'success') }));
