import useHover from '@/hooks/useHover';
import { colors, text } from '@/theme/theme';

/**
 * Standard table used in every module.
 *   <DataTable
 *     columns={[{ key: 'id', label: 'Reference', render: (row) => ..., style: {...}, hideOnMobile: true }]}
 *     rows={data}
 *     rowKey="id"
 *   />
 */
export const thStyle = {
  ...text.tableHead,
  textAlign: 'left', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em',
  padding: '10px 16px', background: colors.bgSubtle, borderBottom: `1px solid ${colors.border}`, whiteSpace: 'nowrap',
};
export const tdStyle = { ...text.body, padding: '14px 16px', borderBottom: `1px solid ${colors.border}` };

function Row({ row, columns }) {
  const [hovered, hoverProps] = useHover();
  return (
    <tr {...hoverProps} style={{ background: hovered ? '#FAFBFC' : 'transparent' }}>
      {columns.map((c) => (
        <td key={c.key} style={{ ...tdStyle, ...c.style }}>{c.render ? c.render(row) : row[c.key]}</td>
      ))}
    </tr>
  );
}

export default function DataTable({ columns, rows, rowKey = 'id' }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {columns.map((c) => <th key={c.key} style={thStyle}>{c.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => <Row key={r[rowKey]} row={r} columns={columns} />)}
      </tbody>
    </table>
  );
}
