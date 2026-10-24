import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui';
import { colors, radius, shadow, text } from '@/theme/theme';

const TAX_OPTIONS = [
  { code: 'BC (28% GST)', rate: 28, label: '28% GST (BC)' },
  { code: 'BB (18% GST)', rate: 18, label: '18% GST (BB)' },
  { code: 'BE (12% GST)', rate: 12, label: '12% GST (BE)' },
  { code: 'BG (5% GST)', rate: 5, label: '5% GST (BG)' },
  { code: 'B0 (0% GST)', rate: 0, label: '0% Nil Rate (B0)' },
];

export default function AddCostModal({ isOpen, item, onClose, onSave }) {
  if (!isOpen || !item) return null;

  const [unitPrice, setUnitPrice] = useState(item.unitPrice ?? 200);
  const [taxCode, setTaxCode] = useState(item.taxCode ?? 'BC (28% GST)');
  const [taxRate, setTaxRate] = useState(item.taxRate ?? 28);
  const [freight, setFreight] = useState(item.freight ?? 2);
  const [packing, setPacking] = useState(item.packing ?? 2);
  const [discountPercent, setDiscountPercent] = useState(item.discountPercent ?? 2);

  // Computations matching business logic
  const up = Number(unitPrice) || 0;
  const fr = Number(freight) || 0;
  const pk = Number(packing) || 0;
  const disc = Number(discountPercent) || 0;
  const qty = Number(item.rfqQty) || 1;
  const rate = Number(taxRate) || 0;

  // Discount is subtracted from unit price
  const discountAmount = (up * disc) / 100;
  const unitPriceTotal = +(up + fr + pk - discountAmount).toFixed(2);
  const totalAmount = +(unitPriceTotal * qty).toFixed(2);
  const taxAmount = +((totalAmount * rate) / 100).toFixed(2);
  const totalWithTax = +(totalAmount + taxAmount).toFixed(2);

  const handleTaxChange = (e) => {
    const selected = TAX_OPTIONS.find((t) => t.code === e.target.value);
    setTaxCode(e.target.value);
    if (selected) setTaxRate(selected.rate);
  };

  const handleSave = () => {
    onSave({
      ...item,
      unitPrice: up,
      taxCode,
      taxRate: rate,
      freight: fr,
      packing: pk,
      discountPercent: disc,
      unitPriceTotal,
      totalAmount,
      taxAmount,
      totalWithTaxAmount: totalWithTax,
    });
    onClose();
  };

  const cellStyle = {
    padding: '8px 10px',
    borderBottom: `1px solid ${colors.border}`,
    ...text.caption,
  };

  const inputStyle = {
    width: 80,
    height: 34,
    padding: '4px 8px',
    border: `1px solid ${colors.border}`,
    borderRadius: radius.sm,
    ...text.caption,
    textAlign: 'right',
    color: colors.textPrimary,
    background: colors.bgCard,
    outline: 'none',
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(18, 48, 74, 0.45)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 20,
      }}
    >
      <div
        style={{
          background: colors.bgCard,
          borderRadius: radius.lg,
          boxShadow: shadow.lg,
          border: `1px solid ${colors.border}`,
          width: '100%',
          maxWidth: 980,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: `1px solid ${colors.border}`,
            background: colors.bgSubtle,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h3 style={{ ...text.cardTitle, color: colors.navy }}>Add Cost</h3>
            <span style={{ ...text.caption, color: colors.textSecondary }}>
              Line {item.rfqLineItem} - {item.description}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: colors.textSecondary,
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Table */}
        <div style={{ padding: 24, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: colors.steel50 }}>
                <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy }}>RFQ Line Item</th>
                <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy }}>Description</th>
                <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy, textAlign: 'right' }}>RFQ Qty</th>
                <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy }}>UoM</th>
                <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy, textAlign: 'right' }}>Unit Price</th>
                <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy }}>Tax Code</th>
                <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy, textAlign: 'right' }}>Freight & Ins.</th>
                <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy, textAlign: 'right' }}>Packing & Fwd</th>
                <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy, textAlign: 'right' }}>Discount (%)</th>
                <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy, textAlign: 'right' }}>Unit Price Total</th>
                <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy, textAlign: 'right' }}>Total Amount</th>
                <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy, textAlign: 'right' }}>Tax Amount</th>
                <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy, textAlign: 'right' }}>Total with Tax</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={cellStyle}>{item.rfqLineItem}</td>
                <td style={{ ...cellStyle, maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.description}
                </td>
                <td style={{ ...cellStyle, textAlign: 'right', fontWeight: 500 }}>{item.rfqQty}</td>
                <td style={cellStyle}>{item.uom}</td>
                <td style={{ ...cellStyle, textAlign: 'right' }}>
                  <input
                    type="number"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    style={inputStyle}
                  />
                </td>
                <td style={cellStyle}>
                  <select
                    value={taxCode}
                    onChange={handleTaxChange}
                    style={{
                      height: 34,
                      padding: '4px 6px',
                      borderRadius: radius.sm,
                      border: `1px solid ${colors.border}`,
                      ...text.caption,
                      outline: 'none',
                      background: colors.bgCard,
                    }}
                  >
                    {TAX_OPTIONS.map((opt) => (
                      <option key={opt.code} value={opt.code}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ ...cellStyle, textAlign: 'right' }}>
                  <input
                    type="number"
                    value={freight}
                    onChange={(e) => setFreight(e.target.value)}
                    style={inputStyle}
                  />
                </td>
                <td style={{ ...cellStyle, textAlign: 'right' }}>
                  <input
                    type="number"
                    value={packing}
                    onChange={(e) => setPacking(e.target.value)}
                    style={inputStyle}
                  />
                </td>
                <td style={{ ...cellStyle, textAlign: 'right' }}>
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    style={inputStyle}
                  />
                </td>
                <td style={{ ...cellStyle, textAlign: 'right', fontWeight: 600 }}>{unitPriceTotal.toFixed(2)}</td>
                <td style={{ ...cellStyle, textAlign: 'right', fontWeight: 600 }}>{totalAmount.toFixed(2)}</td>
                <td style={{ ...cellStyle, textAlign: 'right', fontWeight: 600, color: colors.steel }}>{taxAmount.toFixed(2)}</td>
                <td style={{ ...cellStyle, textAlign: 'right', fontWeight: 700, color: colors.navy }}>{totalWithTax.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 12,
            padding: '16px 24px',
            borderTop: `1px solid ${colors.border}`,
            background: colors.bgSubtle,
          }}
        >
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={<Check size={16} />} onClick={handleSave}>
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}
