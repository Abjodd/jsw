import { AlertTriangle, ArrowRightLeft, CornerUpLeft, FileStack, Flag, Repeat, UserPlus } from 'lucide-react';
import { Avatar, Button, Card, DescriptionList, Drawer, StatusBadge, Tag } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors, radius, status, text } from '@/theme/theme';
import { daysSince, formatDate, formatDateTime, formatINR, formatNumber } from '@/utils/format';
import { ASSIGNMENT_TONE, RELEASE_TONE, RFQ_STATUS_TONE } from '../data/constants';
import PriorityPill from './PriorityPill';

const Section = ({ title, children }) => (
  <Card title={title} style={{ marginBottom: 16 }} bodyStyle={{ padding: 20 }}>{children}</Card>
);

function BuyerRow({ label, name, active }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: `1px solid ${colors.border}` }}>
      {name ? <Avatar name={name} size={32} /> : <span style={{ width: 32, height: 32, borderRadius: '50%', border: `1.5px dashed ${colors.borderStrong}` }} />}
      <div style={{ flex: 1 }}>
        <div style={{ ...text.body, fontWeight: 500, color: name ? colors.textPrimary : colors.textDisabled }}>{name || 'Not set'}</div>
        <div style={text.caption}>{label}</div>
      </div>
      {active && name && <Tag tone="success" size="sm">Active</Tag>}
    </div>
  );
}

/**
 * Full PR line details (all fields from the SAP grid, grouped).
 * mode: 'admin' | 'buyer' — decides the footer actions.
 * onAction(key) keys: assign | reassign | priority | sendBack | createRfq | repeat | nfa
 */
export default function PRDetailDrawer({ line, open, onClose, mode = 'admin', onAction }) {
  const isMobile = useMediaQuery(bp.mobile);
  if (!line) return null;
  const cols = isMobile ? 1 : 2;
  const rfqDone = line.rfqStatus !== 'RFQ Pending';

  const header = (
    <div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        <PriorityPill priority={line.priority} showName />
        <StatusBadge status={RELEASE_TONE[line.releaseStatus]}>{line.releaseStatus}</StatusBadge>
        <StatusBadge status={RFQ_STATUS_TONE[line.rfqStatus]}>{line.rfqStatus}</StatusBadge>
        {line.prType === 'Service' && <Tag tone="steel" size="sm">Service</Tag>}
      </div>
      <h2 style={{ ...text.section, fontVariantNumeric: 'tabular-nums' }}>PR {line.prNumber} · Line {line.lineItem}</h2>
      <p style={{ ...text.subtitle, marginTop: 2 }}>{line.materialDesc}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 1, marginTop: 16, background: colors.border, borderRadius: radius.md, overflow: 'hidden', border: `1px solid ${colors.border}` }}>
        {[
          ['Line value', formatINR(line.totalValue)],
          ['Quantity', `${formatNumber(line.qty)} ${line.uom}`],
          ['Age since release', line.firstRelease ? `${daysSince(line.firstRelease)} days` : '—'],
        ].map(([k, v]) => (
          <div key={k} style={{ background: colors.bgSubtle, padding: '10px 14px' }}>
            <div style={text.caption}>{k}</div>
            <div style={{ ...text.cardTitle, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const footer =
    mode === 'admin' ? (
      <>
        <Button icon={line.activeBuyer ? <ArrowRightLeft size={16} /> : <UserPlus size={16} />} onClick={() => onAction(line.activeBuyer ? 'reassign' : 'assign')}>
          {line.activeBuyer ? 'Reassign buyer' : 'Assign buyer'}
        </Button>
        <Button variant="secondary" icon={<Flag size={16} />} onClick={() => onAction('priority')}>Change priority</Button>
        <div style={{ flex: 1 }} />
        <Button variant="danger" icon={<CornerUpLeft size={16} />} onClick={() => onAction('sendBack')}>Send back</Button>
      </>
    ) : (
      <>
        <Button icon={<FileStack size={16} />} disabled={rfqDone || !!line.sendBack} onClick={() => onAction('createRfq')}>Create RFQ</Button>
        <Button variant="secondary" icon={<Repeat size={16} />} disabled={rfqDone || !line.lastPoNo} onClick={() => onAction('repeat')}>Repeat order</Button>
        <Button variant="secondary" disabled={rfqDone} onClick={() => onAction('nfa')}>Direct NFA</Button>
        <div style={{ flex: 1 }} />
        <Button variant="danger" icon={<CornerUpLeft size={16} />} onClick={() => onAction('sendBack')}>Send back</Button>
      </>
    );

  return (
    <Drawer open={open} onClose={onClose} header={header} footer={footer} width={640}>
      {line.sendBack && (
        <div style={{ display: 'flex', gap: 12, padding: 16, marginBottom: 16, borderRadius: radius.md, background: status.error.bg, border: '1px solid #EBC5C5' }}>
          <AlertTriangle size={20} color={status.error.color} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ ...text.body, fontWeight: 600, color: status.error.color }}>Sent back to {line.requisitioner} — {line.sendBack.reason}</div>
            {line.sendBack.comment && <div style={{ ...text.body, color: colors.textPrimary, marginTop: 2 }}>{line.sendBack.comment}</div>}
          </div>
        </div>
      )}

      <Section title="Requisition">
        <DescriptionList
          columns={cols}
          items={[
            { label: 'PR type', value: line.prType },
            { label: 'Document type', value: line.docType },
            { label: 'PR date', value: formatDate(line.prDate) },
            { label: 'Requisitioner', value: line.requisitioner },
            { label: 'First release date', value: line.firstRelease && formatDate(line.firstRelease) },
            { label: 'Updated release date', value: line.updatedRelease && formatDate(line.updatedRelease) },
            { label: 'Assignment status', value: <StatusBadge status={ASSIGNMENT_TONE[line.assignmentStatus]}>{line.assignmentStatus}</StatusBadge> },
            { label: 'RFQ event', value: line.rfqEventId },
          ]}
        />
      </Section>

      <Section title="Material & quantity">
        <DescriptionList
          columns={cols}
          items={[
            { label: 'Material code', value: line.materialCode },
            { label: 'Material group', value: line.materialGroup },
            { label: 'Description', value: line.materialDesc, span: 2 },
            { label: 'PR quantity', value: `${formatNumber(line.qty, 3)} ${line.uom}` },
            { label: 'OPEX / CAPEX', value: line.opexCapex },
            { label: 'NFA type', value: line.nfaType },
            { label: 'Total PR value', value: `${formatINR(line.totalValue)} ${line.currency}` },
            ...(line.serviceLines ? [{ label: 'Service line item details', value: line.serviceLines, span: 2 }] : []),
          ]}
        />
      </Section>

      <Section title="Plant & purchasing">
        <DescriptionList
          columns={cols}
          items={[
            { label: 'Plant code', value: line.plantCode },
            { label: 'City', value: line.city },
            { label: 'Purchase group', value: line.purGroup, span: 2 },
          ]}
        />
      </Section>

      <Section title="Buyers">
        <div style={{ marginTop: -10 }}>
          <BuyerRow label="Active buyer" name={line.activeBuyer} active />
          <BuyerRow label="Previous buyer" name={line.previousBuyer} />
          <BuyerRow label="Buyer 2" name={line.buyer2} />
          <BuyerRow label="Buyer 3" name={line.buyer3} />
        </div>
      </Section>

      <Section title="Last purchase order">
        <DescriptionList
          columns={isMobile ? 1 : 3}
          items={[
            { label: 'PO number', value: line.lastPoNo },
            { label: 'PO line item', value: line.lastPoLine },
            { label: 'Vendor', value: line.lastPoVendor },
          ]}
        />
      </Section>

      <Section title="Activity">
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[...line.activity].reverse().map((a, i, arr) => (
            <li key={i} style={{ display: 'grid', gridTemplateColumns: '12px 1fr', gap: 12, position: 'relative' }}>
              {i < arr.length - 1 && <span style={{ position: 'absolute', left: 5, top: 16, bottom: -14, width: 2, background: colors.border }} />}
              <span style={{ width: 12, height: 12, marginTop: 5, borderRadius: '50%', background: status[a.tone]?.color ?? colors.steel, boxShadow: `0 0 0 3px ${colors.bgCard}`, position: 'relative' }} />
              <div>
                <div style={{ ...text.body, color: colors.textPrimary }}>{a.text}</div>
                <div style={text.caption}>{a.at.length > 10 ? formatDateTime(a.at) : formatDate(a.at)}</div>
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </Drawer>
  );
}
