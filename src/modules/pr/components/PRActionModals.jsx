import AssignBuyerModal from './modals/AssignBuyerModal';
import ChangePriorityModal from './modals/ChangePriorityModal';
import DirectNfaModal from './modals/DirectNfaModal';
import RepeatOrderModal from './modals/RepeatOrderModal';
import SendBackModal from './modals/SendBackModal';

const MODALS = {
  assign: AssignBuyerModal,
  reassign: AssignBuyerModal,
  priority: ChangePriorityModal,
  sendBack: SendBackModal,
  repeat: RepeatOrderModal,
  nfa: DirectNfaModal,
};

/** Renders the active action modal. modal = { type, ids } | null */
export default function PRActionModals({ modal, lines, onClose, onDone }) {
  if (!modal) return null;
  const M = MODALS[modal.type];
  if (!M) return null;
  const selected = lines.filter((l) => modal.ids.includes(l.id));
  return <M open lines={selected} onClose={onClose} onDone={onDone} />;
}
