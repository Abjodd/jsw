import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-react';
import useHover from '@/hooks/useHover';
import { colors, radius, text } from '@/theme/theme';
import Checkbox from './Checkbox';

/**
 * Standard table used in every module.
 *
 *   <DataTable
 *     columns={[{ key, label, render?: (row) => node, sortValue?: (row) => any, sortable?, align?: 'right', width?, style? }]}
 *     rows={data}
 *     rowKey="id"
 *     selectable selected={ids} onSelectionChange={setIds}
 *     onRowClick={(row) => ...}
 *     pageSize={10}
 *     empty={<EmptyState .../>}
 *   />
 */
export const thStyle = {
  ...text.tableHead,
  textAlign: 'left', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em',
  padding: '10px 12px', background: colors.bgSubtle, borderBottom: `1px solid ${colors.border}`, whiteSpace: 'nowrap',
};
export const tdStyle = { ...text.body, padding: '14px 12px', borderBottom: `1px solid ${colors.border}`, verticalAlign: 'middle' };

function Row({ row, columns, selectable, selected, onToggle, onRowClick, dense }) {
  const [hovered, hoverProps] = useHover();
  return (
    <tr
      {...hoverProps}
      onClick={onRowClick ? () => onRowClick(row) : undefined}
      style={{ background: selected ? colors.steel50 : hovered ? '#FAFBFC' : 'transparent', cursor: onRowClick ? 'pointer' : undefined, transition: 'background 120ms' }}
    >
      {selectable && (
        <td style={{ ...tdStyle, width: 44, paddingLeft: 16, paddingRight: 0, boxShadow: selected ? `inset 3px 0 0 ${colors.steel}` : 'none' }}>
          <Checkbox checked={selected} onChange={() => onToggle(row)} ariaLabel="Select row" />
        </td>
      )}
      {columns.map((c) => (
        <td key={c.key} style={{ ...tdStyle, padding: dense ? '10px 12px' : tdStyle.padding, textAlign: c.align, width: c.width, ...c.style }}>
          {c.render ? c.render(row) : row[c.key]}
        </td>
      ))}
    </tr>
  );
}

function PageBtn({ children, active, disabled, onClick, label }) {
  const [hovered, hoverProps] = useHover();
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      {...hoverProps}
      style={{
        minWidth: 32, height: 32, padding: '0 8px', borderRadius: radius.sm, cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-grid', placeItems: 'center', fontSize: 13, fontWeight: 500,
        border: `1px solid ${active ? colors.navy : colors.border}`,
        background: active ? colors.navy : hovered && !disabled ? colors.bgPage : colors.bgCard,
        color: active ? colors.white : disabled ? colors.textDisabled : colors.textPrimary,
      }}
    >
      {children}
    </button>
  );
}

export default function DataTable({
  columns, rows, rowKey = 'id', selectable, selected = [], onSelectionChange, onRowClick, pageSize, empty, dense, minWidth,
}) {
  const [sort, setSort] = useState(null); // { key, dir }
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    const get = col?.sortValue ?? ((r) => r[sort.key]);
    return [...rows].sort((a, b) => {
      const x = get(a); const y = get(b);
      const r = typeof x === 'number' && typeof y === 'number' ? x - y : String(x ?? '').localeCompare(String(y ?? ''), undefined, { numeric: true });
      return sort.dir === 'asc' ? r : -r;
    });
  }, [rows, sort, columns]);

  const pages = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const safePage = Math.min(page, pages - 1);
  const visible = pageSize ? sorted.slice(safePage * pageSize, safePage * pageSize + pageSize) : sorted;

  const selectedSet = new Set(selected);
  const allSelected = rows.length > 0 && rows.every((r) => selectedSet.has(r[rowKey]));
  const someSelected = !allSelected && rows.some((r) => selectedSet.has(r[rowKey]));

  const toggle = (row) => {
    const id = row[rowKey];
    onSelectionChange?.(selectedSet.has(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  };
  const toggleAll = () => onSelectionChange?.(allSelected ? [] : rows.map((r) => r[rowKey]));

  const onSort = (c) => {
    if (!c.sortable) return;
    setSort((s) => (s?.key !== c.key ? { key: c.key, dir: 'asc' } : s.dir === 'asc' ? { key: c.key, dir: 'desc' } : null));
  };

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth }}>
          <thead>
            <tr>
              {selectable && (
                <th style={{ ...thStyle, width: 44, paddingLeft: 16, paddingRight: 0 }}>
                  <Checkbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} ariaLabel="Select all" />
                </th>
              )}
              {columns.map((c) => {
                const active = sort?.key === c.key;
                const SortIcon = !active ? ChevronsUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown;
                return (
                  <th
                    key={c.key}
                    onClick={() => onSort(c)}
                    style={{ ...thStyle, textAlign: c.align, width: c.width, cursor: c.sortable ? 'pointer' : undefined, color: active ? colors.navy : thStyle.color }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexDirection: c.align === 'right' ? 'row-reverse' : 'row' }}>
                      {c.label}
                      {c.sortable && <SortIcon size={13} style={{ opacity: active ? 1 : 0.45 }} />}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <Row
                key={r[rowKey]}
                row={r}
                columns={columns}
                selectable={selectable}
                selected={selectedSet.has(r[rowKey])}
                onToggle={toggle}
                onRowClick={onRowClick}
                dense={dense}
              />
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <div style={{ padding: 24 }}>{empty ?? <p style={{ ...text.body, color: colors.textSecondary, textAlign: 'center', margin: 0 }}>No records found.</p>}</div>}
      </div>

      {pageSize && rows.length > pageSize && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 16px', flexWrap: 'wrap' }}>
          <span style={text.caption}>
            Showing {safePage * pageSize + 1}–{Math.min(sorted.length, (safePage + 1) * pageSize)} of {sorted.length}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <PageBtn label="Previous page" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}><ChevronLeft size={16} /></PageBtn>
            {Array.from({ length: pages }).map((_, i) => (
              <PageBtn key={i} active={i === safePage} onClick={() => setPage(i)} label={`Page ${i + 1}`}>{i + 1}</PageBtn>
            ))}
            <PageBtn label="Next page" disabled={safePage >= pages - 1} onClick={() => setPage(safePage + 1)}><ChevronRight size={16} /></PageBtn>
          </div>
        </div>
      )}
    </div>
  );
}
