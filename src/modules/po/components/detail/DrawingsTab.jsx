import { useRef, useState } from 'react';
import { FileText, History, Send, UploadCloud, X } from 'lucide-react';
import { Button, IconButton, Modal, Tag, useToast } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, status, text } from '@/theme/theme';
import { formatDateTime } from '@/utils/format';
import { uploadDrawings } from '../../data/poStore';

function Picker({ file, onFile }) {
  const ref = useRef(null);
  if (file) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 4px 4px 10px', borderRadius: radius.md, border: `1px solid ${colors.steel}`, background: colors.steel50, maxWidth: 260 }}>
        <FileText size={15} color={colors.steel} />
        <span style={{ ...text.caption, color: colors.textPrimary, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
        <IconButton label="Remove" size={26} onClick={() => onFile(null)}><X size={13} /></IconButton>
      </span>
    );
  }
  return (
    <>
      <input ref={ref} type="file" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile({ name: f.name, size: f.size }); e.target.value = ''; }} />
      <button type="button" onClick={() => ref.current?.click()} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 34, padding: '0 12px', borderRadius: radius.md, border: `1.5px dashed ${colors.borderStrong}`, background: colors.bgSubtle, color: colors.textSecondary, cursor: 'pointer', ...text.button, fontSize: 13 }}>
        <UploadCloud size={15} /> Browse
      </button>
    </>
  );
}

/** Drawings tab — latest drawing per item, version history, and batch upload ("Send upload"). */
export default function DrawingsTab({ po }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [files, setFiles] = useState({});
  const [history, setHistory] = useState(null);
  const n = Object.values(files).filter(Boolean).length;
  const head = { ...text.tableHead, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'left', padding: '10px 16px', background: colors.bgSubtle, borderBottom: `1px solid ${colors.border}` };
  const cell = { padding: '14px 16px', borderBottom: `1px solid ${colors.border}`, verticalAlign: 'middle' };

  const send = () => {
    uploadDrawings(po.poNumber, Object.fromEntries(Object.entries(files).filter(([, f]) => f)), user?.name);
    toast({ title: `${n} drawing${n > 1 ? 's' : ''} uploaded`, description: 'New revisions are visible to the supplier.' });
    setFiles({});
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 20px', borderBottom: `1px solid ${colors.border}`, flexWrap: 'wrap' }}>
        <span style={text.caption}>Attach a new revision per item, then send them together.</span>
        <Button size="sm" icon={<Send size={15} />} disabled={!n} onClick={send}>Send upload{n ? ` (${n})` : ''}</Button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820 }}>
          <thead><tr>{['Item', 'Material', 'Latest document', 'Upload new revision'].map((h) => <th key={h} style={head}>{h}</th>)}</tr></thead>
          <tbody>
            {po.items.map((i) => {
              const latest = i.drawings[i.drawings.length - 1];
              return (
                <tr key={i.itemNo}>
                  <td style={{ ...cell, ...text.body, fontWeight: 600, width: 70 }}>{i.itemNo}</td>
                  <td style={cell}>
                    <div style={{ ...text.body, fontWeight: 500 }}>{i.materialCode}</div>
                    <div style={text.caption}>{i.description}</div>
                  </td>
                  <td style={cell}>
                    {latest ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 34, height: 34, borderRadius: 8, display: 'grid', placeItems: 'center', background: status.error.bg, color: status.error.color }}><FileText size={17} /></span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ ...text.body, fontWeight: 500, color: colors.steel }}>{latest.name} <Tag size="sm" tone="steel">Rev {latest.rev}</Tag></div>
                          <div style={text.caption}>{formatDateTime(latest.at)} · {latest.by}</div>
                        </div>
                        <Button variant="ghost" size="sm" icon={<History size={14} />} onClick={() => setHistory(i)}>History ({i.drawings.length})</Button>
                      </div>
                    ) : <span style={{ ...text.caption }}>No drawing yet</span>}
                  </td>
                  <td style={{ ...cell, width: 280 }}><Picker file={files[i.itemNo]} onFile={(f) => setFiles((x) => ({ ...x, [i.itemNo]: f }))} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal open={!!history} onClose={() => setHistory(null)} icon={<History size={20} />} title="Document history" subtitle={history && `Item ${history.itemNo} · ${history.materialCode}`} width={520}>
        {history && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...history.drawings].reverse().map((d, k) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: radius.md, border: `1px solid ${colors.border}`, background: k === 0 ? colors.steel50 : colors.bgCard }}>
                <FileText size={18} color={status.error.color} />
                <div style={{ flex: 1 }}>
                  <div style={{ ...text.body, fontWeight: 500 }}>{d.name}</div>
                  <div style={text.caption}>{formatDateTime(d.at)} · {d.by}</div>
                </div>
                <Tag size="sm" tone={k === 0 ? 'navy' : 'neutral'}>Rev {d.rev}{k === 0 ? ' · latest' : ''}</Tag>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
