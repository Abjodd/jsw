import { useSyncExternalStore } from 'react';

/**
 * Tiny global store for mock data (no backend yet).
 *   const store = createStore({ lines: [] });
 *   const { lines } = store.useStore();
 *   store.set((s) => ({ ...s, lines: [...] }));
 * Replace with API calls / React Query when services are ready.
 */
export function createStore(initial) {
  let state = initial;
  const listeners = new Set();
  const get = () => state;
  const set = (updater) => {
    state = typeof updater === 'function' ? updater(state) : updater;
    listeners.forEach((l) => l());
  };
  const subscribe = (l) => {
    listeners.add(l);
    return () => listeners.delete(l);
  };
  const useStore = () => useSyncExternalStore(subscribe, get);
  return { get, set, subscribe, useStore };
}
