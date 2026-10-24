import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { card, colors, radius, status, text } from '@/theme/theme';

/** <KpiCard label="Open PRs" value="128" delta={4.2} icon={FileText} caption="vs last month" invertDelta /> */
export default function KpiCard({ label, value, delta, icon: Icon, caption, invertDelta = false }) {
  const up = delta > 0;
  const good = invertDelta ? !up : up;
  return (
    <div style={{ ...card, padding: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ ...text.label, color: colors.textSecondary }}>{label}</span>
        {Icon && (
          <span
            style={{
              width: 36, height: 36, borderRadius: radius.md, display: 'grid', placeItems: 'center',
              background: colors.steel50, color: colors.steel,
            }}
          >
            <Icon size={18} />
          </span>
        )}
      </div>
      <span style={text.kpi}>{value}</span>
      {(delta !== undefined || caption) && (
        <span style={{ ...text.caption, display: 'flex', gap: 6, alignItems: 'center' }}>
          {delta !== undefined && (
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', fontWeight: 500,
                color: good ? status.success.color : status.error.color,
              }}
            >
              {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(delta)}%
            </span>
          )}
          {caption}
        </span>
      )}
    </div>
  );
}
