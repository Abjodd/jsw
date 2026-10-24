import { Code2 } from 'lucide-react';
import { colors, radius, text } from '@/theme/theme';

/** Placeholder shown on screens that are not built yet. */
export default function EmptyState({ title = 'Screen ready for development', description, filePath, icon: Icon = Code2 }) {
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10,
        padding: '56px 24px', borderRadius: radius.lg, border: '1.5px dashed #CBD3DB',
        background: `radial-gradient(circle at 1px 1px, #E3E8ED 1px, transparent 0) 0 0 / 18px 18px, ${colors.bgCard}`,
      }}
    >
      <span
        style={{
          width: 52, height: 52, borderRadius: 14, display: 'grid', placeItems: 'center', marginBottom: 4,
          background: colors.steel50, color: colors.steel,
        }}
      >
        <Icon size={24} />
      </span>
      <h3 style={text.cardTitle}>{title}</h3>
      {description && <p style={{ ...text.body, color: colors.textSecondary, margin: 0, maxWidth: 480 }}>{description}</p>}
      {filePath && (
        <code
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12,
            background: colors.bgPage, border: `1px solid ${colors.border}`,
            padding: '4px 8px', borderRadius: radius.sm, color: colors.graphite,
          }}
        >
          {filePath}
        </code>
      )}
    </div>
  );
}
