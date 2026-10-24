import { createPortal } from 'react-dom';
import { ArrowLeft, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui';
import { colors, radius, shadow, status, text } from '@/theme/theme';
import { formatINR } from '@/utils/format';

export default function ASNSuccessModal({ asn, poNumber, onViewPo, onBack }) {
  if (!asn) return null;
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'grid', placeItems: 'center', padding: 16, background: colors.overlay, backdropFilter: 'blur(3px)', animation: 'jsw-fade 160ms ease both' }}>
      <div role="dialog" aria-modal="true" style={{ width: 'min(460px, 100%)', background: colors.bgCard, borderRadius: radius.xl, boxShadow: shadow.lg, textAlign: 'center', animation: 'jsw-pop 260ms cubic-bezier(0.2,0.7,0.2,1) both' }}>
        <div style={{ padding: '32px 28px 8px' }}>
          <span style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 16px', display: 'grid', placeItems: 'center', background: status.success.bg, color: status.success.color }}><CheckCircle2 size={36} /></span>
          <h2 style={text.section}>ASN created</h2>
          <p style={{ ...text.subtitle, marginTop: 6 }}>The plant has been notified of the incoming shipment.</p>
          <div style={{ margin: '20px 0 8px', padding: 16, borderRadius: radius.md, background: colors.bgSubtle, border: `1px solid ${colors.border}` }}>
            <div style={text.caption}>ASN number</div>
            <div style={{ fontSize: 28, lineHeight: '36px', fontWeight: 600, letterSpacing: '0.04em', color: colors.navy }}>{asn.asnNo}</div>
            <div style={text.caption}>PO {poNumber} · invoice {asn.invoiceNo} · {formatINR(asn.value, 2)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '16px 28px 28px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={onBack}>All purchase orders</Button>
          <Button icon={<ExternalLink size={16} />} onClick={onViewPo}>View PO</Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
