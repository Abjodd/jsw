import { createStore } from '@/utils/createStore';
import { EVENTS } from './mockData';

/**
 * In-memory RFQ event store (mock). Each action mirrors a future API call.
 *   const { events } = rfqStore.useStore();
 */
export const rfqStore = createStore({ events: EVENTS });

const nowIso = () => new Date().toISOString();
const update = (eventId, fn) =>
  rfqStore.set((s) => ({ ...s, events: s.events.map((e) => (e.eventId === eventId ? fn(e) : e)) }));
const log = (e, text, tone) => [...e.activity, { at: nowIso(), text, tone }];

export const nextEventId = () =>
  String(Math.max(...rfqStore.get().events.map((e) => Number(e.eventId))) + 1).padStart(10, '0');

export const addEvent = (event) => rfqStore.set((s) => ({ ...s, events: [event, ...s.events] }));

export const pauseEvent = (id) =>
  update(id, (e) => ({ ...e, status: 'Paused', pausedRemaining: Math.max(0, new Date(e.end) - Date.now()), activity: log(e, 'RFQ paused by buyer', 'warning') }));

export const resumeEvent = (id) =>
  update(id, (e) => ({ ...e, status: 'Live', end: new Date(Date.now() + (e.pausedRemaining ?? 0)).toISOString(), pausedRemaining: undefined, activity: log(e, 'RFQ resumed', 'progress') }));

export const endEvent = (id) =>
  update(id, (e) => ({ ...e, status: 'Closed', end: nowIso(), activity: log(e, 'RFQ ended early by buyer', 'inactive') }));

export const cancelEvent = (id, reason) =>
  update(id, (e) => ({ ...e, status: 'Cancelled', cancelReason: reason, activity: log(e, `RFQ cancelled — ${reason}`, 'error') }));
