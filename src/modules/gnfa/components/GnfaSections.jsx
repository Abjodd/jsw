/**
 * Section bodies shared by GNFA Create Detail (tabs) and the dashboard Detailed view (collapsibles).
 * Each returns content only; the page decides the wrapping Card / Collapsible.
 */
import { useState } from 'react';
import { StatusBadge } from '@/components/ui';
import * as d from '../data/mockData';
import { tok, type } from './gnfaTokens';
import { FieldGrid, GnfaDataTable, InputField, LinkText, ReadField, YesNo, rightAlign } from './GnfaPrimitives';

const table = (columns, rows) => <GnfaDataTable columns={columns} rows={rows} />;
const link = (t) => <LinkText>{t}</LinkText>;
const bold = { fontWeight: 600 };

export function UserRequirement({ nfaId }) {
  const u = d.USER_REQUIREMENT;
  return (
    <>
      <FieldGrid>
        <ReadField label="NFA ID" value={nfaId ?? u.nfaId} />
        <ReadField label="NFA Type" value={u.nfaType} />
        <ReadField label="Purchase Group" value={u.purchaseGroup} />
        <ReadField label="Event ID" value={u.eventId} />
        <ReadField label="Contract/PO Type" value={u.contractType} />
        <ReadField label="Group Details" value={u.groupDetails} />
      </FieldGrid>
      <p style={{ margin: '12px 0 16px' }}>{link('Add Scope')}</p>
      {table([
        { key: 'pr', label: 'PR Number' }, { key: 'line', label: 'PR Line Item' },
        { key: 'description', label: 'Material Description' }, { key: 'release', label: 'PR Release Date' },
        { key: 'company', label: 'Company Code' }, { key: 'plant', label: 'Plant Code' }, { key: 'plantName', label: 'Plant Name' },
        { key: 'budget', label: 'PR Budgeted Amount', style: { ...rightAlign, ...bold } },
      ], d.PR_LINES)}
      <div style={{ marginTop: 16 }}>
        <FieldGrid>
          <ReadField label="Total PR Amount" value={u.totalPr} />
          <ReadField label="Total NFA Amount" value={u.totalNfa} />
          <div><span style={{ ...type.label, display: 'block', marginBottom: 6 }}>Justification</span>{link('Add Justification')}</div>
        </FieldGrid>
      </div>
    </>
  );
}

export const Bidding = () => (
  <FieldGrid min={300}>{d.BIDDING.map(([l, v]) => <ReadField key={l} label={l} value={v} />)}</FieldGrid>
);

export const ProposedVendor = ({ showRationale = false }) => (
  <>
    <div style={{ marginBottom: 16 }}>
      <FieldGrid><ReadField label="Total Vendors Quoted" value={d.PROPOSED.quoted} /><ReadField label="Vendors Shortlisted" value={d.PROPOSED.shortlisted} /></FieldGrid>
    </div>
    {table([
      { key: 'supplier', label: 'Awarded Supplier' }, { key: 'amount', label: 'Contract Amount', style: rightAlign },
      { key: 'currency', label: 'Currency' }, { key: 'rank', label: 'Commercial Rank' },
      { key: 'savings', label: 'Savings', style: rightAlign }, { key: 'existing', label: 'Existing/New' }, { key: 'lastPoDate', label: 'Last PO Date' },
    ], d.AWARDED)}
    {showRationale && (
      <div style={{ marginTop: 16, ...type.body, color: tok.text }}>
        <p style={{ margin: '0 0 6px' }}><b>Selection Rationale :</b> —</p>
        <p style={{ margin: 0 }}><b>Commercial Diff from Others (L1 vs L2) :</b> {d.EXEC_SUMMARY.diff}</p>
      </div>
    )}
  </>
);

export const Comparative = () => {
  const n = (key, label) => ({ key, label, style: rightAlign, render: (r) => <span style={r.total ? bold : undefined}>{r[key]}</span> });
  return table([
    { key: 'type', label: 'Procurement Type' }, { key: 'line', label: 'Line Item' },
    { key: 'description', label: 'Description', render: (r) => <span style={r.total ? bold : undefined}>{r.description}</span> },
    { key: 'qty', label: 'Quantity', style: rightAlign }, { key: 'uom', label: 'UoM' }, { key: 'delivery', label: 'Delivery Location' },
    n('sdI', 'Six Degrees BCW · Initial'), n('sdF', 'Six Degrees BCW · Final'),
    n('isI', 'Integrated Solutions · Initial'), n('isF', 'Integrated Solutions · Final'),
    { key: 'lowV', label: 'Lowest · Vendor' }, n('lowF', 'Lowest · Final Quote'),
    n('poVal', 'Last PO · Value'), { key: 'poDate', label: 'Last PO · Date' }, { key: 'poVen', label: 'Last PO · Vendor' },
  ], d.COMPARATIVE);
};

const termBadge = (v) => <StatusBadge status={v === 'Accepted' ? 'success' : 'warning'} label={v} />;
export const CommercialTerms = () =>
  table([
    { key: 'term', label: 'Commercial Terms' },
    { key: 'buyer', label: 'Buyer Terms', render: (r) => (r.buyer === 'GCC' ? link('GCC') : r.buyer) },
    { key: 'v1', label: 'Six Degrees BCW', render: (r) => termBadge(r.v1) },
    { key: 'v2', label: 'Integrated Solutions', render: (r) => termBadge(r.v2) },
  ], d.TERMS);

export const AwardedVendorInfo = () =>
  table([
    { key: 'attribute', label: 'Vendor Information' },
    { key: 'value', label: 'Integrated Solutions (awarded)' },
  ], d.VENDOR_INFO);

export function Deviations() {
  const [bc, setBc] = useState('No');
  const [v, setV] = useState({ pr: '', quotes: '', other: '' });
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e?.target?.value ?? e }));
  return (
    <>
      <FieldGrid>
        <InputField label="Purchase Requisition" value={v.pr} onChange={set('pr')} />
        <InputField label="Less than 3 Quotes Invited" value={v.quotes} onChange={set('quotes')} />
        <ReadField label="Budget Status" value="Within Budget" />
        <InputField label="Other Deviations" value={v.other} onChange={set('other')} />
      </FieldGrid>
      <div style={{ marginTop: 16 }}><YesNo legend="Business Case Approval" name="bc" value={bc} onChange={setBc} /></div>
    </>
  );
}

export function Others() {
  const [cb, setCb] = useState('No');
  const [v, setV] = useState({ split: '', remarks: '' });
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e?.target?.value ?? e }));
  return (
    <>
      <YesNo legend="Cost Benefit Analysis (If Applicable)" name="cb" value={cb} onChange={setCb} />
      <div style={{ marginTop: 16 }}>
        <FieldGrid min={300}>
          <InputField label="Rationale for Splitting the Order (If Applicable)" value={v.split} onChange={set('split')} />
          <InputField label="General Remarks" value={v.remarks} onChange={set('remarks')} />
        </FieldGrid>
      </div>
    </>
  );
}

const H = ({ children }) => <h3 style={{ ...type.cardHeading, color: tok.text, margin: '0 0 8px' }}>{children}</h3>;
export function Attachments() {
  const file = (r) => link(r.link);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div><H>PR Attachments</H>{table([
        { key: 'detail', label: 'Detail' }, { key: 'pr', label: 'Purchase Requisition Number' },
        { key: 'spec', label: 'Specification' }, { key: 'link', label: 'Link', render: file },
      ], d.ATTACHMENTS.pr)}</div>
      <div><H>RFQ Attachments</H>{table([
        { key: 'sno', label: 'S.No' }, { key: 'spec', label: 'Specification' }, { key: 'link', label: 'Link', render: file },
      ], d.ATTACHMENTS.rfq)}</div>
      <div><H>BID Attachments</H>{table([
        { key: 'sno', label: 'S.No' }, { key: 'spec', label: 'Specification' }, { key: 'link', label: 'Link' },
      ], d.ATTACHMENTS.bid)}</div>
    </div>
  );
}
