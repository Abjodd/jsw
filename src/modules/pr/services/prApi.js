/**
 * PR API layer — all network calls for this module live here.
 * Replace the stubs with real endpoints. Keep components free of fetch() calls.
 */
import { apiClient } from '@/utils/apiClient';

const BASE = '/pr';

export const prApi = {
  list: (params) => apiClient.get(BASE, { params }),
  getById: (id) => apiClient.get(`${BASE}/${id}`),
  create: (payload) => apiClient.post(BASE, payload),
  update: (id, payload) => apiClient.put(`${BASE}/${id}`, payload),
};
