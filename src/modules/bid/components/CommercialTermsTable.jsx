import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { colors, radius, text, transition } from '@/theme/theme';

export default function CommercialTermsTable({ terms, onChangeTerms }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleFieldChange = (index, field, value) => {
    const updated = [...terms];
    updated[index] = { ...updated[index], [field]: value };
    onChangeTerms(updated);
  };

  const cellStyle = {
    padding: '12px 14px',
    borderBottom: `1px solid ${colors.border}`,
    ...text.body,
    fontSize: 13,
  };

  return (
    <div
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: radius.md,
        overflow: 'hidden',
        background: colors.bgCard,
        marginTop: 20,
      }}
    >
      {/* Accordion Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          background: colors.bgSubtle,
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          transition,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              borderRadius: 4,
              background: '#E9F4EE',
              color: '#23845B',
            }}
          >
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
          <span style={{ ...text.cardTitle, fontSize: 15, color: colors.navy }}>
            Terms and Condition
          </span>
        </div>
        <span style={{ ...text.caption, color: colors.textSecondary }}>
          {terms.length} standard clauses
        </span>
      </button>

      {isOpen && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: colors.steel50 }}>
                <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy, width: '22%' }}>
                  Commercial Terms and Condition
                </th>
                <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy, width: '28%' }}>
                  Azure Power Standard
                </th>
                <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy, width: '16%' }}>
                  Supplier Response
                </th>
                <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy, width: '10%', textAlign: 'center' }}>
                  Supplier LD Min%
                </th>
                <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy, width: '10%', textAlign: 'center' }}>
                  Supplier LD Max%
                </th>
                <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy, width: '14%' }}>
                  Supplier Remarks
                </th>
              </tr>
            </thead>
            <tbody>
              {terms.map((t, idx) => (
                <tr key={t.term} style={{ background: idx % 2 === 0 ? 'transparent' : colors.bgSubtle }}>
                  <td style={{ ...cellStyle, fontWeight: 500, color: colors.textPrimary }}>{t.term}</td>
                  <td style={{ ...cellStyle, color: colors.textSecondary }}>{t.azure}</td>
                  <td style={cellStyle}>
                    <select
                      value={t.response}
                      onChange={(e) => handleFieldChange(idx, 'response', e.target.value)}
                      style={{
                        width: '100%',
                        height: 32,
                        padding: '0 8px',
                        borderRadius: radius.sm,
                        border: `1px solid ${colors.border}`,
                        background: colors.bgCard,
                        color: colors.textPrimary,
                        ...text.caption,
                        outline: 'none',
                      }}
                    >
                      <option value="Accepted">Accepted</option>
                      <option value="Deviated">Deviated</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td style={{ ...cellStyle, textAlign: 'center' }}>
                    <input
                      type="text"
                      placeholder="Min %"
                      value={t.ldMin || ''}
                      onChange={(e) => handleFieldChange(idx, 'ldMin', e.target.value)}
                      style={{
                        width: '100%',
                        maxWidth: 70,
                        height: 30,
                        textAlign: 'center',
                        padding: '0 4px',
                        borderRadius: radius.sm,
                        border: `1px solid ${colors.border}`,
                        background: colors.bgCard,
                        ...text.caption,
                        outline: 'none',
                      }}
                    />
                  </td>
                  <td style={{ ...cellStyle, textAlign: 'center' }}>
                    <input
                      type="text"
                      placeholder="Max %"
                      value={t.ldMax || ''}
                      onChange={(e) => handleFieldChange(idx, 'ldMax', e.target.value)}
                      style={{
                        width: '100%',
                        maxWidth: 70,
                        height: 30,
                        textAlign: 'center',
                        padding: '0 4px',
                        borderRadius: radius.sm,
                        border: `1px solid ${colors.border}`,
                        background: colors.bgCard,
                        ...text.caption,
                        outline: 'none',
                      }}
                    />
                  </td>
                  <td style={cellStyle}>
                    <input
                      type="text"
                      placeholder="Enter remarks..."
                      value={t.remarks || ''}
                      onChange={(e) => handleFieldChange(idx, 'remarks', e.target.value)}
                      style={{
                        width: '100%',
                        height: 30,
                        padding: '0 8px',
                        borderRadius: radius.sm,
                        border: `1px solid ${colors.border}`,
                        background: colors.bgCard,
                        ...text.caption,
                        outline: 'none',
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
