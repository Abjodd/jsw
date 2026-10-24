import { colors, text } from '@/theme/theme';

/**
 * Read-only label/value grid — use instead of disabled inputs for view screens.
 * <DescriptionList columns={3} items={[{ label: 'Event ID', value: '0000010039', span: 1 }]} />
 */
export default function DescriptionList({ items, columns = 2, style }) {
  return (
    <dl style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: '18px 24px', margin: 0, ...style }}>
      {items.map((it) => (
        <div key={it.label} style={{ gridColumn: it.span ? `span ${Math.min(it.span, columns)}` : undefined, minWidth: 0 }}>
          <dt style={{ ...text.caption, marginBottom: 4 }}>{it.label}</dt>
          <dd style={{ ...text.body, margin: 0, color: it.value === undefined || it.value === null || it.value === '' ? colors.textDisabled : colors.textPrimary, fontWeight: 500, overflowWrap: 'anywhere' }}>
            {it.value === undefined || it.value === null || it.value === '' ? '—' : it.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
