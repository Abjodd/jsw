import { useState } from 'react';
import { Flag } from 'lucide-react';
import { Button, Modal, useToast } from '@/components/ui';
import useHover from '@/hooks/useHover';
import { colors, radius, status, text, transition } from '@/theme/theme';
import { PRIORITIES } from '../../data/constants';
import { changePriority } from '../../data/prStore';
import PriorityPill from '../PriorityPill';

function Option({ k, p, selected, onSelect, count }) {
  const [hovered, hoverProps] = useHover();
  const s = status[p.tone];
  return (
    <button
      type="button"
      onClick={onSelect}
      {...hoverProps}
      style={{
        display: 'flex', flexDirection: 'column', gap: 8, padding: 16, textAlign: 'left', cursor: 'pointer', transition,
        borderRadius: radius.md, border: `1.5px solid ${selected ? s.color : colors.border}`,
        background: selected ? s.bg : hovered ? colors.bgSubtle : colors.bgCard,
      }}
    >
      <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <PriorityPill priority={k} />
        {count > 0 && <span style={text.caption}>{count} now</span>}
      </span>
      <span style={{ ...text.cardTitle }}>{p.name}</span>
      <span style={text.caption}>{p.description}</span>
    </button>
  );
}

export default function ChangePriorityModal({ open, onClose, lines, onDone }) {
  const { toast } = useToast();
  const [priority, setPriority] = useState('');
  const counts = lines.reduce((m, l) => ({ ...m, [l.priority]: (m[l.priority] ?? 0) + 1 }), {});

  const confirm = () => {
    changePriority(lines.map((l) => l.id), priority);
    toast({ title: `Priority set to ${priority}`, description: `${lines.length} PR line${lines.length > 1 ? 's' : ''} updated` });
    setPriority('');
    onDone?.();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      width={640}
      icon={<Flag size={20} />}
      title="Change priority"
      subtitle={`${lines.length} line${lines.length > 1 ? 's' : ''} selected`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button disabled={!priority} onClick={confirm}>Apply priority</Button>
        </>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        {Object.entries(PRIORITIES).map(([k, p]) => (
          <Option key={k} k={k} p={p} count={counts[k] ?? 0} selected={priority === k} onSelect={() => setPriority(k)} />
        ))}
      </div>
    </Modal>
  );
}
