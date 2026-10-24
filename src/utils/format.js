// Shared formatters — use these so numbers & dates look identical in every module.
export const formatINR = (n, digits = 0) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: digits }).format(n ?? 0);

/** ₹86.4 Cr / ₹3.72 L / ₹16,000 */
export const formatCompactINR = (n = 0) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2).replace(/\.?0+$/, '')} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2).replace(/\.?0+$/, '')} L`;
  return formatINR(n);
};

export const formatNumber = (n, digits = 0) =>
  new Intl.NumberFormat('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n ?? 0);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pad = (n) => String(n).padStart(2, '0');
// ISO date-only strings ("2026-09-23") are read as local dates, not UTC.
const toDate = (d) => (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(`${d}T00:00:00`) : new Date(d));

/** 23 Sep 2026 */
export const formatDate = (d) => {
  if (!d) return '—';
  const x = toDate(d);
  return `${pad(x.getDate())} ${MONTHS[x.getMonth()]} ${x.getFullYear()}`;
};

/** 22 Oct 2026, 19:23 */
export const formatDateTime = (d) => {
  if (!d) return '—';
  const x = toDate(d);
  return `${formatDate(x)}, ${pad(x.getHours())}:${pad(x.getMinutes())}`;
};

export const initials = (name = '') =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('') || '?';

export const daysSince = (d) => Math.max(0, Math.floor((Date.now() - toDate(d).getTime()) / 86400000));

/** YYYY-MM-DD in local time */
export const toISODate = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
};

/** YYYY-MM-DDTHH:mm for <input type="datetime-local"> */
export const toLocalInput = (d) => {
  const x = new Date(d);
  return `${toISODate(x)}T${String(x.getHours()).padStart(2, '0')}:${String(x.getMinutes()).padStart(2, '0')}`;
};

/** { d, h, m, s, total } from milliseconds */
export const splitDuration = (ms) => {
  const total = Math.max(0, ms);
  const s = Math.floor(total / 1000);
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60, total };
};

export const shortDuration = (ms) => {
  const { d, h, m, total } = splitDuration(ms);
  if (total <= 0) return '0m';
  if (d > 0) return `${d}d ${String(h).padStart(2, '0')}h`;
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
  return `${m}m`;
};

/** Download rows as CSV (client-side, mock data). */
export const downloadCSV = (filename, columns, rows) => {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [columns.map((c) => esc(c.label)).join(','), ...rows.map((r) => columns.map((c) => esc(c.value(r))).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

/** 46536.84 → "Forty-six thousand five hundred thirty-six rupees and eighty-four paise only" (Indian system). */
export const amountInWords = (amount) => {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const two = (n) => (n < 20 ? ones[n] : `${tens[Math.floor(n / 10)]}${n % 10 ? `-${ones[n % 10]}` : ''}`);
  const three = (n) => [n >= 100 ? `${ones[Math.floor(n / 100)]} hundred` : '', two(n % 100)].filter(Boolean).join(' ');
  const words = (n) => {
    if (n === 0) return 'zero';
    const parts = [];
    const crore = Math.floor(n / 1e7); n %= 1e7;
    const lakh = Math.floor(n / 1e5); n %= 1e5;
    const thousand = Math.floor(n / 1e3); n %= 1e3;
    if (crore) parts.push(`${words(crore)} crore`);
    if (lakh) parts.push(`${two(lakh)} lakh`);
    if (thousand) parts.push(`${two(thousand)} thousand`);
    if (n) parts.push(three(n));
    return parts.join(' ');
  };
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  const s = `${words(rupees)} rupees${paise ? ` and ${two(paise)} paise` : ''} only`;
  return s.charAt(0).toUpperCase() + s.slice(1);
};
