// Shared formatters — use these so numbers & dates look identical in every module.
export const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export const formatNumber = (n) => new Intl.NumberFormat('en-IN').format(n);

export const formatDate = (d) =>
  new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d));
