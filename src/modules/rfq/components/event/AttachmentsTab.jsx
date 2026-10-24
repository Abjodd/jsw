import { Download, FileText, Paperclip } from 'lucide-react';
import { IconButton, Tag, useToast } from '@/components/ui';
import { colors, radius, status, text } from '@/theme/theme';

const Section = ({ title, count, children }) => (
  <div style={{ padding: 20, borderTop: `1px solid ${colors.border}` }}>
    <h4 style={{ ...text.cardTitle, marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>{title} <Tag size="sm">{count}</Tag></h4>
    {children}
  </div>
);

export default function AttachmentsTab({ event }) {
  const { toast } = useToast();
  return (
    <div style={{ marginTop: -1 }}>
      <Section title="PR attachments" count={event.prAttachments.length}>
        <div style={{ ...text.body, color: colors.textSecondary, display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px', border: `1px dashed ${colors.borderStrong}`, borderRadius: radius.md }}>
          <Paperclip size={16} /> No attachments on the source PR lines.
        </div>
      </Section>
      <Section title="RFQ attachments" count={event.attachments.length}>
        {event.attachments.length === 0 && <p style={{ ...text.body, color: colors.textSecondary, margin: 0 }}>No RFQ attachments.</p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {event.attachments.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, border: `1px solid ${colors.border}`, borderRadius: radius.md, background: colors.bgCard }}>
              <span style={{ width: 40, height: 40, borderRadius: 10, display: 'grid', placeItems: 'center', background: status.error.bg, color: status.error.color }}><FileText size={20} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...text.body, fontWeight: 500, color: colors.steel, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</div>
                <div style={{ ...text.caption, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  {a.spec} · {a.size}
                  <Tag size="sm" tone={a.sendToSupplier ? 'success' : 'neutral'}>{a.sendToSupplier ? 'Shared with suppliers' : 'Internal'}</Tag>
                </div>
              </div>
              <IconButton label="Download" onClick={() => toast({ title: 'Download started', description: a.name, tone: 'info' })}><Download size={17} /></IconButton>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
