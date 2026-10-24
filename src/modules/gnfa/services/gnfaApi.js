/**
 * GNFA API layer — all network calls for this module live here.
 * Replace the stubs with real endpoints. Keep components free of fetch() calls.
 */
import { apiClient } from '@/utils/apiClient';

const BASE = '/gnfa';

export const gnfaApi = {
  list: (params) => apiClient.get(BASE, { params }),
  getById: (id) => apiClient.get(`${BASE}/${id}`),
  create: (payload) => apiClient.post(BASE, payload),
  update: (id, payload) => apiClient.put(`${BASE}/${id}`, payload),
  // Screens added for GNFA Create / Dashboard (pages still read ../data/mockData until these are wired)
  getEventLines: (eventId) => apiClient.get(`${BASE}/events/${eventId}/lines`),
  awardSupplier: (eventId, lineIds) => apiClient.post(`${BASE}/events/${eventId}/award`, { lineIds }),
  searchNfa: (params) => apiClient.get(`${BASE}/nfa`, { params }),
  recall: (nfaId) => apiClient.post(`${BASE}/nfa/${nfaId}/recall`),
};
