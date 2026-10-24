import { useState } from 'react';
import { ArrowRight, CalendarClock, Check, X } from 'lucide-react';
import { Button, Modal, useToast } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import useHover from '@/hooks/useHover';
import { colors, radius, status, text, transition } from '@/theme/theme';
import { formatDate, formatDateTime } from '@/utils/format';
import { pendingChanges } from '../../data/poMath';
import { decideDeliveryChanges } from '../../data/poStore';

function Choice({ active, tone, icon, children, onClick }) {
  const [hovered, hoverProps] = useHover();
  const s = status[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      {...hoverProps}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px', borderRadius: radius.md, cursor: 'pointer', transition,
        fontSize: 13, fontWeight: 500, border: `1.5px solid ${active ? s.color : colors.border}`,
        background: active ? s.bg : hovered ? colors.bgSubtle : colors.bgCard, color: active ? s.color : colors.textSecondary,
      }}
    >
      {icon}{children}
    </button>
  );
}

/** Buyer approves / rejects supplier requests to move delivery dates. */
export default function DeliveryDecisionModal({ po, onClose }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [d, setD] = useState({});
  const items = pendingChanges(po);
  const n = Object.keys(d).length;

  const save = () => {
    decideDeliveryChanges(po.poNumber, d, user?.name);
    const ok = Object.values(d).filter((x) => x === 'Approved').length;
    toast({ title: 'Decisions saved', description: `${ok} approved · ${n - ok} rejected — supplier notified` });
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      width={720}
      icon={<CalendarClock size={20} />}
      title="Decision for delivery date change"
      subtitle={`PO ${po.poNumber} · ${items.length} pending request${items.length === 1 ? '' : 's'}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button disabled={!n} onClick={save}>Save {n || ''} decision{n === 1 ? '' : 's'}</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((i) => {
          const days = Math.round((new Date(i.deliveryChange.requestedDate) - new Date(i.deliveryDate)) / 86400000);
          return (
            <div key={i.itemNo} style={{ padding: 16, borderRadius: radius.md, border: `1px solid ${colors.border}`, background: d[i.itemNo] ? colors.bgSubtle : colors.bgCard }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ ...text.body, fontWeight: 600 }}>Item {i.itemNo} · {i.description}</div>
                  <div style={text.caption}>{i.materialCode} · requested {formatDateTime(i.deliveryChange.requestedAt)}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Choice tone="success" active={d[i.itemNo] === 'Approved'} icon={<Check size={14} />} onClick={() => setD((x) => ({ ...x, [i.itemNo]: 'Approved' }))}>Approve</Choice>
                  <Choice tone="error" active={d[i.itemNo] === 'Rejected'} icon={<X size={14} />} onClick={() => setD((x) => ({ ...x, [i.itemNo]: 'Rejected' }))}>Reject</Choice>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                <span style={{ ...text.body, padding: '4px 10px', borderRadius: radius.sm, background: colors.bgPage }}>{formatDate(i.deliveryDate)}</span>
                <ArrowRight size={16} color={colors.textDisabled} />
                <span style={{ ...text.body, fontWeight: 600, padding: '4px 10px', borderRadius: radius.sm, background: status.warning.bg, color: status.warning.color }}>{formatDate(i.deliveryChange.requestedDate)}</span>
                <span style={text.caption}>+{days} days</span>
              </div>
              <div style={{ ...text.body, color: colors.textSecondary, marginTop: 8 }}>“{i.deliveryChange.reason}”</div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
