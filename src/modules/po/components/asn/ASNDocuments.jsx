import { useRef, useState } from 'react';
import { CheckCircle2, FileText, UploadCloud, X } from 'lucide-react';
import { IconButton, Tabs } from '@/components/ui';
import { colors, radius, status, text } from '@/theme/theme';
import { ASN_DOCUMENTS } from '../../data/constants';

const size = (b) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

/** Invoice / PDI report / MTC / Others uploads. docs = { [key]: { name, size } } */
export default function ASNDocuments({ docs, setDocs, showErrors }) {
  const [tab, setTab] = useState('invoice');
  const ref = useRef(null);
  const d = ASN_DOCUMENTS.find((x) => x.key === tab);
  const file = docs[tab];
  const missing = showErrors && d.required && !file;

  return (
    <div>
      <div style={{ padding: '0 20px', borderBottom: `1px solid ${colors.border}` }}>
        <Tabs
          value={tab}
          onChange={setTab}
          style={{ borderBottom: 0 }}
          items={ASN_DOCUMENTS.map((x) => ({ key: x.key, label: `${x.label}${x.required ? ' *' : ''}`, icon: docs[x.key] ? CheckCircle2 : undefined }))}
        />
      </div>
      <div style={{ padding: 20 }}>
        <input ref={ref} type="file" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) setDocs((x) => ({ ...x, [tab]: { name: f.name, size: size(f.size) } })); e.target.value = ''; }} />
        {file ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: radius.md, border: `1px solid ${status.success.color}`, background: status.success.bg }}>
            <span style={{ width: 42, height: 42, borderRadius: 10, display: 'grid', placeItems: 'center', background: colors.bgCard, color: status.error.color }}><FileText size={20} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...text.body, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
              <div style={text.caption}>{d.label} · {file.size} · uploaded</div>
            </div>
            <IconButton label="Remove file" onClick={() => setDocs((x) => ({ ...x, [tab]: null }))}><X size={16} /></IconButton>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => ref.current?.click()}
            style={{
              width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '28px 16px', cursor: 'pointer',
              borderRadius: radius.md, border: `1.5px dashed ${missing ? status.error.color : colors.borderStrong}`, background: missing ? status.error.bg : colors.bgSubtle,
            }}
          >
            <span style={{ width: 44, height: 44, borderRadius: 12, display: 'grid', placeItems: 'center', background: colors.bgCard, color: colors.steel }}><UploadCloud size={22} /></span>
            <span style={{ ...text.body, fontWeight: 600, color: colors.textPrimary }}>Upload {d.label.toLowerCase()}</span>
            <span style={{ ...text.caption, color: missing ? status.error.color : colors.textSecondary }}>{missing ? 'Required to submit the ASN' : d.hint} · PDF, JPG or PNG</span>
          </button>
        )}
      </div>
    </div>
  );
}
