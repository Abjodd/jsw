import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { colors, radius, text, transition } from '@/theme/theme';

export default function AttachmentManager({
  prAttachments = [],
  rfqAttachments = [],
  bidAttachments = [],
  onChangeBidAttachments,
}) {
  const [prOpen, setPrOpen] = useState(true);
  const [rfqOpen, setRfqOpen] = useState(true);
  const [bidOpen, setBidOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddRow = () => {
    const newRow = {
      sNo: bidAttachments.length + 1,
      specification: 'Certificate',
      fileName: '',
    };
    onChangeBidAttachments([...bidAttachments, newRow]);
  };

  const handleDeleteRow = (index) => {
    const updated = bidAttachments.filter((_, i) => i !== index).map((row, idx) => ({
      ...row,
      sNo: idx + 1,
    }));
    onChangeBidAttachments(updated);
  };

  const handleSpecChange = (index, value) => {
    const updated = [...bidAttachments];
    updated[index] = { ...updated[index], specification: value };
    onChangeBidAttachments(updated);
  };

  const handleSimulatedUpload = (index, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const updated = [...bidAttachments];
      updated[index] = { ...updated[index], fileName: file.name };
      onChangeBidAttachments(updated);
      showToast(`File '${file.name}' uploaded successfully!`);
    }
  };

  const cellStyle = {
    padding: '12px 14px',
    borderBottom: `1px solid ${colors.border}`,
    ...text.body,
    fontSize: 13,
  };

  const accordionHeader = (title, count, isOpen, toggle) => (
    <button
      type="button"
      onClick={toggle}
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
        <span style={{ ...text.cardTitle, fontSize: 15, color: colors.navy }}>{title}</span>
      </div>
      <span style={{ ...text.caption, color: colors.textSecondary }}>{count} file(s)</span>
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'relative' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: colors.navy,
            color: colors.white,
            padding: '12px 20px',
            borderRadius: radius.md,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 8px 24px rgba(18, 48, 74, 0.25)',
            zIndex: 9999,
            ...text.caption,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={18} color="#23845B" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. PR Attachments */}
      <div style={{ border: `1px solid ${colors.border}`, borderRadius: radius.md, overflow: 'hidden', background: colors.bgCard }}>
        {accordionHeader('PR Attachments', prAttachments.length, prOpen, () => setPrOpen(!prOpen))}
        {prOpen && (
          <div style={{ padding: '16px 20px' }}>
            {prAttachments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: colors.textSecondary, ...text.caption }}>
                No PR attachments found.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: colors.steel50 }}>
                    <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy }}>Detail</th>
                    <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy }}>PR Number</th>
                    <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy }}>Specification</th>
                    <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy }}>Document Link</th>
                  </tr>
                </thead>
                <tbody>
                  {prAttachments.map((row, idx) => (
                    <tr key={idx}>
                      <td style={cellStyle}>{row.detail || 'PR Attachment'}</td>
                      <td style={cellStyle}>{row.prNumber}</td>
                      <td style={cellStyle}>{row.specification}</td>
                      <td style={cellStyle}>
                        <a href="#download" style={{ color: colors.steel, textDecoration: 'none', fontWeight: 500 }}>
                          {row.link}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* 2. RFQ Attachments */}
      <div style={{ border: `1px solid ${colors.border}`, borderRadius: radius.md, overflow: 'hidden', background: colors.bgCard }}>
        {accordionHeader('RFQ Attachments', rfqAttachments.length, rfqOpen, () => setRfqOpen(!rfqOpen))}
        {rfqOpen && (
          <div style={{ padding: '16px 20px' }}>
            {rfqAttachments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: colors.textSecondary, ...text.caption }}>
                No RFQ attachments found.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: colors.steel50 }}>
                    <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy, width: 80 }}>S.No</th>
                    <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy }}>Specification</th>
                    <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy }}>Document Link</th>
                  </tr>
                </thead>
                <tbody>
                  {rfqAttachments.map((row, idx) => (
                    <tr key={idx}>
                      <td style={cellStyle}>{row.sNo}</td>
                      <td style={cellStyle}>{row.specification}</td>
                      <td style={cellStyle}>
                        <a href="#download" style={{ color: colors.steel, textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <FileText size={15} /> {row.link}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* 3. BID Attachments */}
      <div style={{ border: `1px solid ${colors.border}`, borderRadius: radius.md, overflow: 'hidden', background: colors.bgCard }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: colors.bgSubtle, paddingRight: 16 }}>
          <div style={{ flex: 1 }}>
            {accordionHeader('BID Attachments', bidAttachments.length, bidOpen, () => setBidOpen(!bidOpen))}
          </div>
          {bidOpen && (
            <Button size="sm" variant="accent" icon={<Plus size={14} />} onClick={handleAddRow}>
              Add Row
            </Button>
          )}
        </div>

        {bidOpen && (
          <div style={{ padding: '16px 20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: colors.steel50 }}>
                  <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy, width: 70 }}>S.No</th>
                  <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy, width: '35%' }}>Specification</th>
                  <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy, width: '45%' }}>Upload Document</th>
                  <th style={{ ...cellStyle, fontWeight: 600, color: colors.navy, width: 80, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bidAttachments.map((row, idx) => (
                  <tr key={idx}>
                    <td style={cellStyle}>{row.sNo}</td>
                    <td style={cellStyle}>
                      <select
                        value={row.specification}
                        onChange={(e) => handleSpecChange(idx, e.target.value)}
                        style={{
                          width: '100%',
                          maxWidth: 240,
                          height: 34,
                          padding: '0 8px',
                          borderRadius: radius.sm,
                          border: `1px solid ${colors.border}`,
                          background: colors.bgCard,
                          ...text.caption,
                          outline: 'none',
                        }}
                      >
                        <option value="Certificate">Certificate</option>
                        <option value="Technical Datasheet">Technical Datasheet</option>
                        <option value="Commercial Deviation">Commercial Deviation</option>
                        <option value="Drawings">Drawings</option>
                        <option value="Other">Other</option>
                      </select>
                    </td>
                    <td style={cellStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <label
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '6px 14px',
                            background: colors.bgCard,
                            border: `1px solid ${colors.border}`,
                            borderRadius: radius.sm,
                            cursor: 'pointer',
                            ...text.caption,
                            fontWeight: 500,
                            color: colors.navy,
                          }}
                        >
                          <Upload size={14} /> Browse...
                          <input
                            type="file"
                            style={{ display: 'none' }}
                            onChange={(e) => handleSimulatedUpload(idx, e)}
                          />
                        </label>
                        <span style={{ ...text.caption, color: row.fileName ? colors.textPrimary : colors.textDisabled, fontStyle: row.fileName ? 'normal' : 'italic' }}>
                          {row.fileName || 'No file chosen'}
                        </span>
                      </div>
                    </td>
                    <td style={{ ...cellStyle, textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(idx)}
                        title="Delete attachment"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#C44747',
                          padding: 6,
                          borderRadius: 4,
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
