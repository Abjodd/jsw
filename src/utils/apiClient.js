/**
 * Minimal fetch wrapper shared by every module's services/*Api.js.
 * Set VITE_API_BASE_URL in a .env file. Swap for axios if the team prefers.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(method, url, { params, body } = {}) {
  const qs = params ? `?${new URLSearchParams(params)}` : '';
  const res = await fetch(`${BASE_URL}${url}${qs}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${url} failed: ${res.status}`);
  return res.status === 204 ? null : res.json();
}

export const apiClient = {
  get: (url, opts) => request('GET', url, opts),
  post: (url, body) => request('POST', url, { body }),
  put: (url, body) => request('PUT', url, { body }),
  delete: (url) => request('DELETE', url),
};
