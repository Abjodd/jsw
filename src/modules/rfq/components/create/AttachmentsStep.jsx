import { useRef } from 'react';
import { FileText, Paperclip, Plus, Trash2, UploadCloud, X } from 'lucide-react';
import { Button, IconButton, Select, Toggle } from '@/components/ui';
import { colors, radius, status, text } from '@/theme/theme';
import { ATTACHMENT_SPECS } from '../../data/constants';

const size = (b) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

function UploadCell({ file, onFile }) {
  const ref = useRef(null);
  if (file) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 8px 6px 10px', borderRadius: radius.md, border: `1px solid ${colors.border}`, background: colors.bgCard, maxWidth: 280 }}>
        <FileText size={18} color={status.error.color} />
        <span style={{ minWidth: 0 }}>
          <span style={{ ...text.body, fontWeight: 500, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
          <span style={text.caption}>{file.size}</span>
        </span>
        <IconButton label="Remove file" size={28} onClick={() => onFile(null)}><X size={14} /></IconButton>
      </span>
    );
  }
  return (
    <>
      <input ref={ref} type="file" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile({ name: f.name, size: size(f.size) }); }} />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', borderRadius: radius.md, border: `1.5px dashed ${colors.borderStrong}`, background: colors.bgSubtle, color: colors.textSecondary, cursor: 'pointer', ...text.button }}
      >
        <UploadCloud size={16} /> Choose file
      </button>
    </>
  );
}

/** Step 5 — PR attachments (read-only) + RFQ attachments. */
export default function AttachmentsStep({ rows, setRows }) {
  const set = (id, k, v) => setRows((xs) => xs.map((r) => (r.id === id ? { ...r, [k]: v } : r)));
  const add = () => setRows((xs) => [...xs, { id: Math.random().toString(36).slice(2), spec: 'Technical specification', file: null, sendToSupplier: true }]);
  const head = { ...text.tableHead, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'left', padding: '10px 12px', background: colors.bgSubtle, borderBottom: `1px solid ${colors.border}` };
  const cell = { padding: '12px', borderBottom: `1px solid ${colors.border}`, verticalAlign: 'middle' };

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <section>
        <h4 style={{ ...text.cardTitle, marginBottom: 10 }}>PR attachments</h4>
        <div style={{ ...text.body, color: colors.textSecondary, display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px', border: `1px dashed ${colors.borderStrong}`, borderRadius: radius.md }}>
          <Paperclip size={16} /> The selected PR lines have no attachments.
        </div>
      </section>

      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <h4 style={text.cardTitle}>RFQ attachments <span style={{ ...text.caption, marginLeft: 6 }}>Optional</span></h4>
          <Button variant="ghost" size="sm" icon={<Plus size={15} />} onClick={add}>Add row</Button>
        </div>
        <div style={{ border: `1px solid ${colors.border}`, borderRadius: radius.md, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
            <thead>
              <tr>{['#', 'Specification', 'File', 'Send to supplier', ''].map((h) => <th key={h} style={head}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id}>
                  <td style={{ ...cell, ...text.body, width: 40, fontWeight: 600 }}>{i + 1}</td>
                  <td style={{ ...cell, width: 230 }}><Select value={r.spec} onChange={(v) => set(r.id, 'spec', v)} options={ATTACHMENT_SPECS} size="sm" /></td>
                  <td style={cell}><UploadCell file={r.file} onFile={(f) => set(r.id, 'file', f)} /></td>
                  <td style={{ ...cell, width: 160 }}><Toggle checked={r.sendToSupplier} onChange={(v) => set(r.id, 'sendToSupplier', v)} label={r.sendToSupplier ? 'Shared' : 'Internal'} /></td>
                  <td style={{ ...cell, width: 52 }}><IconButton label="Delete row" tone="danger" onClick={() => setRows((xs) => xs.filter((x) => x.id !== r.id))}><Trash2 size={16} /></IconButton></td>
                </tr>
              ))}
              {!rows.length && (
                <tr><td colSpan={5} style={{ ...cell, ...text.body, color: colors.textSecondary, textAlign: 'center' }}>No attachments — add a row to upload drawings, specs or SOW.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
