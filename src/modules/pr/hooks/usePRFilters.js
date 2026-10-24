import { useMemo, useState } from 'react';

/**
 * Filtering for PR dashboards: panel filters + quick-stat filter + free-text search.
 *
 * quickFilters: [{ key, predicate(line) }]   (key 'all' = no-op)
 * dateField:    which line field the From/To dates apply to
 */
export default function usePRFilters(lines, { defaults, quickFilters, dateField = 'prDate', initialQuick = 'all' }) {
  const [filters, setFilters] = useState(defaults);
  const [quick, setQuick] = useState(initialQuick);
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      lines.filter((l) => {
        const f = filters;
        if (f.prNumber && !l.prNumber.includes(f.prNumber.trim())) return false;
        if (f.priority && l.priority !== f.priority) return false;
        if (f.fromDate && (!l[dateField] || l[dateField] < f.fromDate)) return false;
        if (f.toDate && (!l[dateField] || l[dateField] > f.toDate)) return false;
        if (f.purchaseGroup && l.purGroup !== f.purchaseGroup) return false;
        if (f.docType && l.docType !== f.docType) return false;
        if (f.releaseStatus && l.releaseStatus !== f.releaseStatus) return false;
        if (f.buyer && l.activeBuyer !== f.buyer) return false;
        if (f.assignmentStatus && l.assignmentStatus !== f.assignmentStatus) return false;
        if (f.rfqStatus && l.rfqStatus !== f.rfqStatus) return false;
        return true;
      }),
    [lines, filters, dateField]
  );

  const counts = useMemo(
    () => Object.fromEntries(quickFilters.map((q) => [q.key, filtered.filter(q.predicate).length])),
    [filtered, quickFilters]
  );

  const rows = useMemo(() => {
    const q = quickFilters.find((x) => x.key === quick)?.predicate ?? (() => true);
    const s = search.trim().toLowerCase();
    return filtered.filter(q).filter(
      (l) =>
        !s ||
        [l.prNumber, l.materialDesc, l.materialCode, l.requisitioner, l.activeBuyer, l.city, l.plantCode].some((v) => String(v ?? '').toLowerCase().includes(s))
    );
  }, [filtered, quick, search, quickFilters]);

  return { filters, setFilters, quick, setQuick, search, setSearch, filtered, rows, counts };
}
