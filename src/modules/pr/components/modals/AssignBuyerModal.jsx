import { useMemo, useState } from 'react';
import { Check, UserPlus } from 'lucide-react';
import { Avatar, Button, Field, Input, Modal, Tag, useToast } from '@/components/ui';
import useHover from '@/hooks/useHover';
import { colors, radius, status, text, transition } from '@/theme/theme';
import { BUYERS } from '../../data/mockData';
import { assignBuyer, prStore } from '../../data/prStore';
import SelectedLines from '../SelectedLines';

function BuyerOption({ buyer, load, selected, current, onSelect }) {
  const [hovered, hoverProps] = useHover();
  const pct = Math.min(100, Math.round((load / buyer.capacity) * 100));
  const tone = pct >= 90 ? status.error.color : pct >= 70 ? status.warning.color : status.success.color;
  return (
    <button
      type="button"
      onClick={onSelect}
      {...hoverProps}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 14px', textAlign: 'left', cursor: 'pointer', transition,
        borderRadius: radius.md, border: `1.5px solid ${selected ? colors.navy : colors.border}`,
        background: selected ? colors.steel50 : hovered ? colors.bgSubtle : colors.bgCard,
      }}
    >
      <Avatar name={buyer.name} size={36} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ ...text.body, fontWeight: 600, color: colors.textPrimary }}>{buyer.name}</span>
          {current && <Tag size="sm" tone="steel">Current</Tag>}
        </div>
        <div style={text.caption}>{buyer.role}</div>
      </div>
      <div style={{ width: 120 }}>
        <div style={{ ...text.caption, display: 'flex', justifyContent: 'space-between' }}>
          <span>Open lines</span>
          <strong style={{ color: colors.textPrimary }}>{load}/{buyer.capacity}</strong>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: colors.bgPage, marginTop: 4, overflow: 'hidden' }}>
          <span style={{ display: 'block', height: '100%', width: `${pct}%`, background: tone, borderRadius: 999 }} />
        </div>
      </div>
      <span style={{ width: 22, height: 22, borderRadius: '50%', display: 'grid', placeItems: 'center', border: `1.5px solid ${selected ? colors.navy : colors.borderStrong}`, background: selected ? colors.navy : 'transparent', color: colors.white }}>
        {selected && <Check size={13} strokeWidth={3} />}
      </span>
    </button>
  );
}

/** Assign or reassign the active buyer for one or more PR lines. */
export default function AssignBuyerModal({ open, onClose, lines, onDone }) {
  const { toast } = useToast();
  const { lines: all } = prStore.useStore();
  const [buyer, setBuyer] = useState('');
  const [note, setNote] = useState('');
  const reassign = lines.some((l) => l.activeBuyer);

  const load = useMemo(() => {
    const m = {};
    all.forEach((l) => { if (l.activeBuyer && l.rfqStatus === 'RFQ Pending') m[l.activeBuyer] = (m[l.activeBuyer] ?? 0) + 1; });
    return m;
  }, [all]);
  const currentBuyers = new Set(lines.map((l) => l.activeBuyer).filter(Boolean));

  const confirm = () => {
    assignBuyer(lines.map((l) => l.id), buyer, note.trim());
    toast({ title: `${reassign ? 'Reassigned' : 'Assigned'} to ${buyer}`, description: `${lines.length} PR line${lines.length > 1 ? 's' : ''} updated` });
    setBuyer(''); setNote('');
    onDone?.();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      width={620}
      icon={<UserPlus size={20} />}
      title={reassign ? 'Reassign buyer' : 'Assign buyer'}
      subtitle="Pick a buyer based on category and current workload."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button disabled={!buyer} onClick={confirm}>{reassign ? 'Reassign' : 'Assign'} {lines.length} line{lines.length > 1 ? 's' : ''}</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <SelectedLines lines={lines} max={3} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={text.label}>Buyer</span>
          {BUYERS.map((b) => (
            <BuyerOption key={b.name} buyer={b} load={load[b.name] ?? 0} selected={buyer === b.name} current={currentBuyers.has(b.name)} onSelect={() => setBuyer(b.name)} />
          ))}
        </div>
        <Field label="Note for buyer" hint="Optional — shown in the PR activity log.">
          <Input value={note} onChange={setNote} placeholder="e.g. Urgent — plant shutdown on 2 Nov" />
        </Field>
      </div>
    </Modal>
  );
}
