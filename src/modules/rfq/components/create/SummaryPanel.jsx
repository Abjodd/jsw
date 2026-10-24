import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { AvatarStack, Card } from '@/components/ui';
import { colors, radius, status, text } from '@/theme/theme';
import { formatDateTime, formatINR, shortDuration } from '@/utils/format';
import { vendorByCode } from '../../data/mockData';

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: `1px solid ${colors.border}` }}>
    <span style={text.caption}>{label}</span>
    <span style={{ ...text.body, fontWeight: 500, color: colors.textPrimary, textAlign: 'right' }}>{children}</span>
  </div>
);

/** Sticky right-hand summary + readiness checklist for Create RFQ. */
export default function SummaryPanel({ general, items, vendorCodes, attachments, steps, validity, onJump, showErrors }) {
  const value = items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.ceilingPrice) || 0), 0);
  const required = steps.filter((s) => s.required);
  const done = required.filter((s) => validity[s.key]).length;
  const duration = new Date(general.endAt) - new Date(general.startAt);

  return (
    <div style={{ position: 'sticky', top: 84, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card title="RFQ summary" subtitle={general.subject || 'Untitled RFQ'}>
        <div style={{ marginTop: -10 }}>
          <Row label="Line items">{items.length}</Row>
          <Row label="Estimated value">{formatINR(value)}</Row>
          <Row label="Vendors invited">
            {vendorCodes.length ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <AvatarStack names={vendorCodes.map((c) => vendorByCode(c).name)} max={4} size={24} />
                {vendorCodes.length}
              </span>
            ) : '—'}
          </Row>
          <Row label="Closes">{general.endAt ? formatDateTime(general.endAt) : '—'}</Row>
          <Row label="Bid window">{duration > 0 ? shortDuration(duration) : '—'}</Row>
          <Row label="Attachments">{attachments.filter((a) => a.file).length}</Row>
        </div>
      </Card>

      <Card title="Ready to submit?" subtitle={`${done} of ${required.length} required sections complete`}>
        <div style={{ height: 6, borderRadius: 999, background: colors.bgPage, overflow: 'hidden', marginBottom: 14 }}>
          <span style={{ display: 'block', height: '100%', width: `${(done / required.length) * 100}%`, borderRadius: 999, background: done === required.length ? status.success.color : `linear-gradient(90deg, ${colors.navy}, ${colors.steel})`, transition: 'width 300ms' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {steps.map((s, i) => {
            const ok = validity[s.key];
            const bad = showErrors && s.required && !ok;
            const Icon = ok ? CheckCircle2 : bad ? AlertCircle : Circle;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => onJump(i)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', margin: '0 -10px', borderRadius: radius.sm, border: 0, background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
              >
                <Icon size={18} color={ok ? status.success.color : bad ? status.error.color : colors.textDisabled} />
                <span style={{ ...text.body, flex: 1, color: ok ? colors.textPrimary : colors.textSecondary }}>{s.label}</span>
                {!s.required && <span style={text.caption}>Optional</span>}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
