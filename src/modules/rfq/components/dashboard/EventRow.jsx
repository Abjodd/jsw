import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { Avatar, AvatarStack, StatusBadge, Tag } from '@/components/ui';
import useHover from '@/hooks/useHover';
import { colors, radius, status, text, transition } from '@/theme/theme';
import { formatDateTime, formatINR } from '@/utils/format';
import { BID_STATUS_TONE, RFQ_STATUS_TONE } from '../../data/constants';
import getEventStats from '../../data/eventStats';
import { vendorByCode } from '../../data/mockData';
import TimeLeft from '../TimeLeft';

export const EVENT_GRID = '32px minmax(130px, 1fr) minmax(160px, 2fr) 150px 165px 110px 130px 96px';

function Bids({ e, s }) {
  const pct = s.invited ? (s.bids / s.invited) * 100 : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ ...text.body, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{s.bids}<span style={{ color: colors.textDisabled }}> / {s.invited}</span></span>
        <AvatarStack names={e.vendors.map((v) => vendorByCode(v.code).name)} max={3} size={22} />
      </div>
      <div style={{ height: 5, borderRadius: 999, background: colors.bgPage, overflow: 'hidden' }}>
        <span style={{ display: 'block', height: '100%', width: `${pct}%`, borderRadius: 999, background: `linear-gradient(90deg, ${colors.navy}, ${colors.steel})` }} />
      </div>
    </div>
  );
}

function Suppliers({ e, s }) {
  return (
    <div style={{ padding: '4px 20px 18px 64px', background: colors.bgSubtle, borderTop: `1px dashed ${colors.border}` }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Supplier', 'Supplier ref.', 'Quotation ID', 'Bid status', 'Submitted', 'Quoted value'].map((h, i) => (
              <th key={h} style={{ ...text.tableHead, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: i === 5 ? 'right' : 'left', padding: '12px 10px 8px' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {e.vendors.map((v) => {
            const vd = vendorByCode(v.code);
            const isL1 = s.l1?.code === v.code;
            return (
              <tr key={v.code} style={{ borderTop: `1px solid ${colors.border}` }}>
                <td style={{ padding: '10px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={vd.name} size={26} />
                    <span>
                      <span style={{ ...text.body, fontWeight: 500, display: 'block' }}>{vd.name}</span>
                      <span style={text.caption}>Code {vd.code} · {vd.city}</span>
                    </span>
                  </span>
                </td>
                <td style={{ ...text.body, padding: 10, fontVariantNumeric: 'tabular-nums' }}>{vd.ref}</td>
                <td style={{ ...text.body, padding: 10, color: colors.steel, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{v.quotationId}</td>
                <td style={{ padding: 10 }}><StatusBadge status={BID_STATUS_TONE[v.bidStatus]}>{v.bidStatus}</StatusBadge></td>
                <td style={{ ...text.caption, padding: 10, whiteSpace: 'nowrap' }}>{v.submittedAt ? formatDateTime(v.submittedAt) : '—'}</td>
                <td style={{ ...text.body, padding: 10, textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {isL1 && <Tag tone="success" size="sm" style={{ marginRight: 8 }}>L1</Tag>}
                  {v.amount ? formatINR(v.amount) : <span style={{ color: colors.textDisabled, fontWeight: 400 }}>—</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** One RFQ event (grouped — suppliers expand underneath instead of repeating the event per row). */
export default function EventRow({ e, compact }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [hovered, hoverProps] = useHover();
  const s = getEventStats(e);
  const go = () => navigate(`/rfq/events/${e.eventId}`);

  const expand = (
    <button
      type="button"
      aria-label={open ? 'Collapse suppliers' : 'Expand suppliers'}
      aria-expanded={open}
      onClick={(ev) => { ev.stopPropagation(); setOpen((o) => !o); }}
      style={{
        width: 28, height: 28, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bgCard, cursor: 'pointer',
        display: 'grid', placeItems: 'center', color: colors.textSecondary,
      }}
    >
      <ChevronDown size={16} style={{ transform: open ? 'rotate(180deg)' : 'none', transition }} />
    </button>
  );

  const eventCell = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      <Link to={`/rfq/events/${e.eventId}`} onClick={(ev) => ev.stopPropagation()} style={{ ...text.body, fontWeight: 600, color: colors.navy, fontVariantNumeric: 'tabular-nums' }}>
        {e.eventId}
      </Link>
      <span><Tag size="sm" tone="steel" mono>{e.rfqId}</Tag></span>
    </div>
  );

  const subjectCell = (
    <div style={{ minWidth: 0 }}>
      <div style={{ ...text.body, fontWeight: 500, color: colors.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={e.subject}>{e.subject}</div>
      <div style={{ ...text.caption, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {e.category} · {e.items.length} line{e.items.length > 1 ? 's' : ''}{s.l1 ? ` · L1 ${formatINR(s.l1.amount)}` : ''}
      </div>
    </div>
  );

  return (
    <div style={{ borderTop: `1px solid ${colors.border}`, background: open ? colors.bgCard : undefined }}>
      {compact ? (
        <div onClick={go} {...hoverProps} style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, cursor: 'pointer', background: hovered ? '#FAFBFC' : undefined }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>{eventCell}<StatusBadge status={RFQ_STATUS_TONE[e.status]}>{e.status}</StatusBadge></div>
          {subjectCell}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <TimeLeft event={e} />
            <div style={{ width: 140 }}><Bids e={e} s={s} /></div>
          </div>
        </div>
      ) : (
        <div
          onClick={go}
          {...hoverProps}
          style={{
            display: 'grid', gridTemplateColumns: EVENT_GRID, alignItems: 'center', gap: 12, padding: '14px 20px', cursor: 'pointer',
            background: hovered ? '#FAFBFC' : 'transparent', transition: 'background 120ms', position: 'relative',
          }}
        >
          <span style={{ position: 'absolute', left: 0, top: 10, bottom: 10, width: 3, borderRadius: '0 3px 3px 0', background: e.status === 'Live' ? status.progress.color : e.status === 'Paused' ? status.warning.color : 'transparent' }} />
          {expand}
          {eventCell}
          {subjectCell}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <Avatar name={e.buyer} size={26} />
            <span style={{ ...text.body, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.buyer}</span>
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ ...text.caption, whiteSpace: 'nowrap' }}><span style={{ color: colors.textDisabled }}>Start</span> {formatDateTime(e.start)}</span>
            <span style={{ ...text.caption, whiteSpace: 'nowrap', color: colors.textPrimary }}><span style={{ color: colors.textDisabled }}>End</span>&nbsp;&nbsp; {formatDateTime(e.end)}</span>
          </div>
          <TimeLeft event={e} />
          <Bids e={e} s={s} />
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            <StatusBadge status={RFQ_STATUS_TONE[e.status]}>{e.status}</StatusBadge>
            <ArrowUpRight size={16} color={hovered ? colors.steel : colors.textDisabled} />
          </span>
        </div>
      )}
      {open && !compact && <Suppliers e={e} s={s} />}
    </div>
  );
}
