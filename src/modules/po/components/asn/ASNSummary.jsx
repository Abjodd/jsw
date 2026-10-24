import { AlertTriangle, CheckCircle2, Circle } from 'lucide-react';
import { Card } from '@/components/ui';
import { colors, radius, status, text } from '@/theme/theme';
import { formatINR, formatNumber } from '@/utils/format';
import { gstSplit } from '../../data/poMath';

const Row = ({ label, value, strong }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', ...text.body, fontWeight: strong ? 600 : 400, color: strong ? colors.textPrimary : colors.textSecondary }}>
    <span>{label}</span><span style={{ color: colors.textPrimary, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
  </div>
);

/** Right-hand ASN summary: lines, GST split (IGST vs CGST+SGST), invoice-amount match, readiness. */
export default function ASNSummary({ po, qty, intraState, invoiceAmount, checks }) {
  const lines = po.items.filter((i) => Number(qty[i.itemNo]) > 0).map((i) => {
    const taxable = Number(qty[i.itemNo]) * i.netPrice;
    return { i, q: Number(qty[i.itemNo]), taxable, ...gstSplit(taxable, i.gstRate, intraState) };
  });
  const sum = (k) => lines.reduce((s, l) => s + l[k], 0);
  const total = sum('taxable') + sum('igst') + sum('cgst') + sum('sgst');
  const inv = Number(invoiceAmount) || 0;
  const diff = inv - total;
  const match = inv > 0 && Math.abs(diff) <= 1;

  return (
    <div style={{ position: 'sticky', top: 84, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card title="ASN summary" subtitle={intraState ? 'Intra-state supply · CGST + SGST' : 'Inter-state supply · IGST'}>
        {!lines.length && <p style={{ ...text.body, color: colors.textSecondary, margin: 0 }}>Enter ASN quantities to see the tax breakup.</p>}
        {lines.map((l) => (
          <div key={l.i.itemNo} style={{ padding: '10px 0', borderBottom: `1px solid ${colors.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ ...text.body, fontWeight: 500, color: colors.textPrimary, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.i.itemNo} · {l.i.description}</span>
              <strong style={{ ...text.body, whiteSpace: 'nowrap' }}>{formatINR(l.taxable, 2)}</strong>
            </div>
            <div style={text.caption}>{formatNumber(l.q)} {l.i.uom} × {formatINR(l.i.netPrice, 2)} · HSN {l.i.hsn} · GST {l.i.gstRate}%</div>
          </div>
        ))}
        {lines.length > 0 && (
          <div style={{ paddingTop: 8 }}>
            <Row label="Taxable value" value={formatINR(sum('taxable'), 2)} />
            {intraState ? (
              <>
                <Row label="CGST" value={formatINR(sum('cgst'), 2)} />
                <Row label="SGST" value={formatINR(sum('sgst'), 2)} />
              </>
            ) : <Row label="IGST" value={formatINR(sum('igst'), 2)} />}
            <div style={{ borderTop: `1px solid ${colors.border}`, marginTop: 6, paddingTop: 6 }}>
              <Row label="ASN value" value={formatINR(total, 2)} strong />
            </div>
            {inv > 0 && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 10, padding: '10px 12px', borderRadius: radius.md, background: match ? status.success.bg : status.warning.bg }}>
                {match ? <CheckCircle2 size={16} color={status.success.color} /> : <AlertTriangle size={16} color={status.warning.color} />}
                <span style={{ ...text.caption, color: colors.textPrimary }}>
                  {match ? 'Invoice amount matches the ASN value.' : `Invoice amount differs by ${formatINR(Math.abs(diff), 2)} (${diff > 0 ? 'higher' : 'lower'}).`}
                </span>
              </div>
            )}
          </div>
        )}
      </Card>

      <Card title="Ready to submit?">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {checks.map((c) => (
            <span key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10, ...text.body, color: c.ok ? colors.textPrimary : colors.textSecondary }}>
              {c.ok ? <CheckCircle2 size={18} color={status.success.color} /> : <Circle size={18} color={colors.textDisabled} />}{c.label}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
