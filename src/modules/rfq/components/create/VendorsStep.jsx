import { useState } from 'react';
import { Mail, MapPin, Search, Star } from 'lucide-react';
import { Button, Checkbox, Input, Tag } from '@/components/ui';
import useHover from '@/hooks/useHover';
import { colors, radius, status, text, transition } from '@/theme/theme';
import { initials } from '@/utils/format';
import { VENDORS } from '../../data/mockData';

function VendorCard({ v, selected, onToggle }) {
  const [hovered, hoverProps] = useHover();
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggle())}
      {...hoverProps}
      style={{
        position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, padding: 16, cursor: 'pointer', transition,
        borderRadius: radius.lg, border: `1.5px solid ${selected ? colors.navy : hovered ? colors.borderStrong : colors.border}`,
        background: selected ? colors.steel50 : colors.bgCard,
        boxShadow: selected ? `0 0 0 3px ${colors.steel100}` : hovered ? '0 4px 16px rgba(18,48,74,0.08)' : 'none',
      }}
    >
      <span style={{ position: 'absolute', top: 14, right: 14 }}><Checkbox checked={selected} onChange={onToggle} ariaLabel={`Invite ${v.name}`} /></span>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', paddingRight: 28 }}>
        <span style={{ width: 42, height: 42, borderRadius: 12, display: 'grid', placeItems: 'center', background: selected ? colors.navy : colors.bgPage, color: selected ? colors.white : colors.navy, fontWeight: 700, fontSize: 14, transition }}>
          {initials(v.name)}
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ ...text.body, fontWeight: 600, color: colors.textPrimary }}>{v.name}</div>
          <div style={text.caption}>Code {v.code} · Ref {v.ref}</div>
        </div>
      </div>
      <div style={{ ...text.caption, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><MapPin size={12} />{v.city}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><Mail size={12} />{v.email}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingTop: 10, borderTop: `1px solid ${colors.border}` }}>
        <span style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{v.categories.map((c) => <Tag key={c} size="sm">{c}</Tag>)}</span>
        <span style={{ ...text.caption, display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
          <Star size={12} fill={status.warning.color} color={status.warning.color} /> <strong style={{ color: colors.textPrimary }}>{v.rating}</strong> · {v.pastRfqs} RFQs
        </span>
      </div>
    </div>
  );
}

/** Step 4 — pick suppliers to invite. */
export default function VendorsStep({ vendorCodes, setVendorCodes, showErrors }) {
  const [q, setQ] = useState('');
  const s = q.trim().toLowerCase();
  const list = VENDORS.filter((v) => !s || [v.name, v.code, v.city, ...v.categories].some((x) => x.toLowerCase().includes(s)));
  const toggle = (code) => setVendorCodes((xs) => (xs.includes(code) ? xs.filter((x) => x !== code) : [...xs, code]));
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <Input value={q} onChange={setQ} icon={<Search size={15} />} placeholder="Search by name, code, city or category" style={{ width: 'min(380px, 100%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ ...text.body, color: showErrors && !vendorCodes.length ? status.error.color : colors.textSecondary }}>
            {vendorCodes.length ? <><strong style={{ color: colors.navy }}>{vendorCodes.length}</strong> vendor{vendorCodes.length > 1 ? 's' : ''} selected</> : 'Select at least one vendor'}
          </span>
          {vendorCodes.length > 0 && <Button variant="ghost" size="sm" onClick={() => setVendorCodes([])}>Clear</Button>}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 14 }}>
        {list.map((v) => <VendorCard key={v.code} v={v} selected={vendorCodes.includes(v.code)} onToggle={() => toggle(v.code)} />)}
      </div>
    </div>
  );
}
