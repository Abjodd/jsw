import { Mail, Phone } from 'lucide-react';
import { Avatar, DataTable, StatusBadge, Tag } from '@/components/ui';
import { colors, text } from '@/theme/theme';
import { formatDateTime, formatINR } from '@/utils/format';
import { BID_STATUS_TONE, VENDOR_STATUS_TONE } from '../../data/constants';
import getEventStats from '../../data/eventStats';
import { vendorByCode } from '../../data/mockData';

export default function VendorsTab({ event }) {
  const s = getEventStats(event);
  const rows = event.vendors.map((v) => ({ ...v, ...vendorByCode(v.code), id: v.code }));
  const columns = [
    {
      key: 'name', label: 'Vendor', sortable: true,
      render: (r) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={r.name} size={32} />
          <span>
            <span style={{ display: 'block', fontWeight: 500 }}>{r.name}</span>
            <span style={text.caption}>Ref {r.ref} · Code {r.code}</span>
          </span>
        </span>
      ),
    },
    {
      key: 'contact', label: 'Contact',
      render: (r) => (
        <div style={{ ...text.caption, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', color: colors.textPrimary }}><Mail size={12} />{r.email}</span>
          <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><Phone size={12} />{r.phone}</span>
        </div>
      ),
    },
    { key: 'vendorStatus', label: 'Vendor status', render: (r) => <StatusBadge status={VENDOR_STATUS_TONE[r.vendorStatus]}>{r.vendorStatus}</StatusBadge> },
    { key: 'quotationId', label: 'Quotation ID', render: (r) => <span style={{ color: colors.steel, fontWeight: 500 }}>{r.quotationId}</span> },
    { key: 'bidStatus', label: 'Quotation status', render: (r) => <StatusBadge status={BID_STATUS_TONE[r.bidStatus]}>{r.bidStatus}</StatusBadge> },
    { key: 'submittedAt', label: 'Submitted', render: (r) => <span style={{ ...text.caption, whiteSpace: 'nowrap' }}>{r.submittedAt ? formatDateTime(r.submittedAt) : '—'}</span> },
    {
      key: 'amount', label: 'Quoted value', align: 'right', sortable: true, sortValue: (r) => r.amount ?? Infinity,
      render: (r) => (
        <span style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
          {s.l1?.code === r.code && <Tag tone="success" size="sm" style={{ marginRight: 8 }}>L1</Tag>}
          {r.amount ? formatINR(r.amount) : <span style={{ color: colors.textDisabled, fontWeight: 400 }}>—</span>}
        </span>
      ),
    },
  ];
  return <DataTable columns={columns} rows={rows} minWidth={980} />;
}
