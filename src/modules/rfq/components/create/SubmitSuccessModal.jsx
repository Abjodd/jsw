import { createPortal } from 'react-dom';
import { CheckCircle2, ExternalLink, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui';
import { colors, radius, shadow, status, text } from '@/theme/theme';
import { formatDateTime } from '@/utils/format';

/** Celebratory confirmation after an RFQ is published. */
export default function SubmitSuccessModal({ event, onOpenEvent, onBackToQueue }) {
  if (!event) return null;
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'grid', placeItems: 'center', padding: 16, background: colors.overlay, backdropFilter: 'blur(3px)', animation: 'jsw-fade 160ms ease both' }}>
      <div role="dialog" aria-modal="true" style={{ width: 'min(480px, 100%)', background: colors.bgCard, borderRadius: radius.xl, boxShadow: shadow.lg, overflow: 'hidden', animation: 'jsw-pop 260ms cubic-bezier(0.2,0.7,0.2,1) both', textAlign: 'center' }}>
        <div style={{ padding: '32px 28px 8px' }}>
          <span style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 16px', display: 'grid', placeItems: 'center', background: status.success.bg, color: status.success.color, boxShadow: `0 0 0 10px ${status.success.bg}55` }}>
            <CheckCircle2 size={36} />
          </span>
          <h2 style={text.section}>RFQ published</h2>
          <p style={{ ...text.subtitle, marginTop: 6 }}>Suppliers have been notified and can start bidding.</p>
          <div style={{ margin: '20px 0 8px', padding: 16, borderRadius: radius.md, background: colors.bgSubtle, border: `1px solid ${colors.border}` }}>
            <div style={text.caption}>Event ID</div>
            <div style={{ fontSize: 28, lineHeight: '36px', fontWeight: 600, letterSpacing: '0.04em', color: colors.navy, fontVariantNumeric: 'tabular-nums' }}>{event.eventId}</div>
            <div style={text.caption}>{event.vendors.length} vendors invited · closes {formatDateTime(event.end)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '16px 28px 28px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="secondary" icon={<ListChecks size={16} />} onClick={onBackToQueue}>Back to PR queue</Button>
          <Button icon={<ExternalLink size={16} />} onClick={onOpenEvent}>Open RFQ event</Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
