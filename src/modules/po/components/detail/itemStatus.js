import { isOverdue, toBeDelivered } from '../../data/poMath';

/** Line-level status shown in the items table. */
export const itemStatus = (po, i) => {
  if (po.status === 'Pending Acknowledgement' || po.status === 'New') return { label: 'Awaiting ack.', tone: 'warning' };
  if (toBeDelivered(i) === 0) return { label: 'Delivered', tone: 'success' };
  if (isOverdue(i)) return { label: 'Overdue', tone: 'error' };
  if (i.deliveredQty > 0) return { label: 'Partially delivered', tone: 'progress' };
  return { label: 'Open', tone: 'inactive' };
};
