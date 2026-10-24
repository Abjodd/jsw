/**
 * GNFA local building blocks for things the module could not confirm in the shared library
 * (Tabs, Field/Input, FilterBar, Timeline, Checkbox). Each one maps to a shared component —
 * when you confirm the shared API, swap the body for the shared component and keep the same props.
 */
import { useState } from 'react';
import {
  AlertTriangle, CalendarCheck, ChevronDown, ChevronRight, ClipboardList, FileText, LayoutGrid, MoreHorizontal,
  Paperclip, Scale, ShieldCheck, UserCheck, UserRound, Workflow, UserRound as ApprovalUser,
} from 'lucide-react';
import * as ui from '@/components/ui';
import { Card } from '@/components/ui';
import { tok, type } from './gnfaTokens';

const TAB_ICONS = {
  'User Requirements': UserRound, 'Bidding/RFQ': CalendarCheck, 'Proposed Vendor': UserCheck, Comparative: Scale,
  'Commercial Terms': ClipboardList, 'Awarded Vendor': ShieldCheck, 'Deviations from Standard Terms': AlertTriangle,
  Others: MoreHorizontal, Attachment: Paperclip,
  'Executive Summary': LayoutGrid, Detailed: FileText, 'Work Flow': Workflow,
};

/**
 * Numbered circular icon tabs (matches the Bid Management tabs): icon circle with a number badge, label underneath,
 * active tab = filled navy circle + green badge + underline. -> shared Tabs once its API is confirmed.
 */
export function TabBar({ tabs, value, onChange }) {
  return (
    <div role="tablist" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '20px 16px 0', background: tok.card, border: `1px solid ${tok.border}`, borderRadius: 12, marginBottom: 16 }}>
      {tabs.map((t) => {
        const on = t === value;
        const Icon = TAB_ICONS[t] ?? FileText;
        return (
          <button
            key={t} role="tab" aria-selected={on} aria-label={t} onClick={() => onChange(t)}
            style={{ flex: 'none', minWidth: 112, padding: '0 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: 'none', border: 0, cursor: 'pointer' }}
          >
            <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: on ? 60 : 52, height: on ? 60 : 52, borderRadius: '50%', transition: 'all 150ms',
              background: on ? tok.navy : tok.page, border: on ? 0 : `1px solid ${tok.border}`, boxShadow: on ? '0 6px 14px rgba(18, 48, 74, 0.28)' : 'none' }}>
              <Icon size={on ? 24 : 22} color={on ? '#fff' : tok.navy} strokeWidth={1.8} />
            </span>
            <span style={{ ...type.nav, fontWeight: on ? 600 : 500, color: on ? tok.text : tok.muted, whiteSpace: 'nowrap' }}>{t}</span>
            <span aria-hidden="true" style={{ alignSelf: 'stretch', height: 3, borderRadius: 3, background: on ? tok.steel : 'transparent' }} />
          </button>
        );
      })}
    </div>
  );
}

const labelStyle = { ...type.label, color: tok.text, display: 'block', marginBottom: 6 };

/** -> shared FormField + Input (read-only display variant) */
export function ReadField({ label, value }) {
  return (
    <div>
      <span style={labelStyle}>{label}</span>
      <div style={{ ...type.input, minHeight: 40, display: 'flex', alignItems: 'center', padding: '0 12px', borderRadius: tok.radius, border: `1px solid ${tok.border}`, background: tok.page, color: tok.text }}>
        {value || '—'}
      </div>
    </div>
  );
}

/**
 * Labelled text input -> shared FormField.
 * FormField renders its own <input>, so it must be self-closing: pass label/value/onChange/placeholder as props and NO children.
 * (Wrapping a shared <Input> inside it made React throw "input is a void element tag and must neither have children…".)
 * `style` goes on a wrapper div so the min-width does not depend on FormField's props.
 */
export function InputField({ label, value, onChange, placeholder, style }) {
  if (ui.FormField) {
    return (
      <div style={style}>
        <ui.FormField label={label} value={value} onChange={onChange} placeholder={placeholder} />
      </div>
    );
  }
  return (
    <label style={style}>
      <span style={labelStyle}>{label}</span>
      <input
        value={value} onChange={onChange} placeholder={placeholder}
        style={{ ...type.input, width: '100%', boxSizing: 'border-box', height: 40, padding: '0 12px', borderRadius: tok.radius, border: `1px solid ${tok.border}`, background: tok.card, color: tok.text }}
      />
    </label>
  );
}

export const FieldGrid = ({ children, min = 220 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`, gap: 16 }}>{children}</div>
);

/** -> shared FilterBar */
export const FilterRow = ({ children }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 12 }}>{children}</div>
);

export const LinkText = ({ children, onClick, to }) => (
  <button type="button" onClick={onClick} data-to={to} style={{ ...type.button, background: 'none', border: 0, padding: 0, cursor: 'pointer', color: tok.progress }}>
    {children}
  </button>
);

export function YesNo({ legend, name, value, onChange }) {
  return (
    <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
      <legend style={{ ...labelStyle, padding: 0 }}>{legend}</legend>
      <div style={{ display: 'flex', gap: 24, ...type.body, color: tok.text }}>
        {['Yes', 'No'].map((o) => (
          <label key={o} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="radio" name={name} checked={value === o} onChange={() => onChange(o)} style={{ accentColor: tok.navy }} />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Collapsible dashboard section (screenshot: chevron + section title) */
export function Collapsible({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const Icon = open ? ChevronDown : ChevronRight;
  return (
    <Card flush>
      <button
        type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}
        style={{ ...type.cardHeading, width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', background: 'none', border: 0, cursor: 'pointer', color: tok.text, textAlign: 'left' }}
      >
        <Icon size={16} color={tok.progress} /> {title}
      </button>
      {open && <div style={{ padding: '0 20px 20px' }}>{children}</div>}
    </Card>
  );
}

/** -> shared Timeline */
export function ApprovalSteps({ steps }) {
  const color = { current: tok.warning, waiting: '#8aa0b8', done: tok.success, rejected: tok.danger };
  const statusText = { current: 'Pending', done: 'Approved', rejected: 'Rejected', waiting: '' };
  return (
    <div style={{ width: '100%', overflowX: 'auto', padding: '8px 8px 4px' }}>
      <ol aria-label="Approval workflow" style={{ listStyle: 'none', margin: 0, padding: '0 4px', display: 'flex', alignItems: 'flex-start', position: 'relative', minWidth: Math.max(760, steps.length * 250), width: '100%' }}>
        <span aria-hidden="true" style={{ position: 'absolute', left: 18, right: 18, top: 21, height: 1, background: '#9bb0c6' }} />
        {steps.map((s, i) => (
          <li key={s.id} style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <span style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
              <span style={{ width: 42, height: 42, flex: 'none', borderRadius: '50%', border: `3px double ${color[s.state] || '#8aa0b8'}`, background: tok.card, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', color: color[s.state] || '#8aa0b8', boxShadow: s.state === 'current' ? '0 0 0 2px rgba(230,120,0,.10)' : 'none' }}>
                <ApprovalUser size={21} strokeWidth={1.8} />
              </span>
            </span>
            {i < steps.length - 1 && <span aria-hidden="true" style={{ position: 'absolute', zIndex: 2, top: 9, right: -7, padding: '0 2px', background: tok.card, color: tok.steel, fontSize: 15, lineHeight: '24px' }}>››</span>}
            <div style={{ ...type.caption, color: tok.text, textAlign: 'center', marginTop: 7, width: '100%', maxWidth: 210, lineHeight: 1.35, overflowWrap: 'normal' }}>
              <div>{s.role}{statusText[s.state] ? ` · ${statusText[s.state]}` : ''}</div>
              <div>{s.name}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Native table with aligned columns and horizontal scrolling for wide data sets. */
export function GnfaDataTable({ columns = [], rows = [] }) {
  if (!columns.length) return null;
  const wide = columns.length > 7;
  return (
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'auto' }}>
      <table style={{ width: wide ? 'max-content' : '100%', minWidth: wide ? 1450 : '100%', borderCollapse: 'collapse', tableLayout: 'auto', color: tok.text }}>
        <thead><tr>{columns.map((c) => <th key={c.key} scope="col" style={{ padding: '10px 12px', textAlign: c.style?.textAlign || 'left', whiteSpace: 'nowrap', fontWeight: 600, background: tok.page, borderBottom: `1px solid ${tok.border}`, verticalAlign: 'bottom' }}>{c.label}</th>)}</tr></thead>
        <tbody>{rows.length ? rows.map((r, ri) => <tr key={r.id ?? r.nfaId ?? r.rfqLine ?? ri}>{columns.map((c) => <td key={c.key} style={{ padding: '10px 12px', textAlign: c.style?.textAlign || 'left', whiteSpace: 'nowrap', borderBottom: `1px solid ${tok.border}`, verticalAlign: 'top' }}>{c.render ? c.render(r) : (r[c.key] ?? '')}</td>)}</tr>) : <tr><td colSpan={columns.length} style={{ padding: 16, textAlign: 'center', color: tok.muted }}>No data</td></tr>}</tbody>
      </table>
    </div>
  );
}

export const rightAlign = { textAlign: 'right', whiteSpace: 'nowrap' };

/** Toast helper that never breaks a page if the shared hook has a different shape */
export function useNotify() {
  let t = null;
  try { t = ui.useToast ? ui.useToast() : null; } catch { t = null; }
  return (message) => {
    try { const fn = t?.success ?? t?.show ?? t?.toast ?? (typeof t === 'function' ? t : null); fn?.(message); } catch { /* ignore */ }
  };
}
