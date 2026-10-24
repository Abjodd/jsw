import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, FilePlus2, ListChecks, RotateCcw, Wallet } from 'lucide-react';
import { Button, Card, EmptyState, KpiCard, PageHeader } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp } from '@/theme/theme';
import { EVENTS } from '../data/mockData';
import { tok, type } from '../components/gnfaTokens';
import { FilterRow, GnfaDataTable, InputField, rightAlign } from '../components/GnfaPrimitives';

/**
 * GNFA › GNFA Create        Route: /gnfa/create
 * Event ID search -> RFQ/PR line table -> select rows -> Create GNFA (opens GNFA Create Detail in the same panel).
 */
const digits = (v) => String(v).replace(/\D/g, '').replace(/^0+/, '');
const DEFAULT_EVENT = EVENTS[10038];

export default function GNFACreate() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery(bp.mobile);
  const isLaptop = useMediaQuery(bp.laptop);
  const [input, setInput] = useState(DEFAULT_EVENT.short);
  const [eventId, setEventId] = useState(DEFAULT_EVENT.short);   // the event currently loaded
  const [selected, setSelected] = useState(new Set());

  const ev = EVENTS[digits(eventId)];
  const rows = ev ? ev.lines : [];
  const search = () => { setEventId(input.trim()); setSelected(new Set()); };
  const clear = () => { setInput(''); setEventId(''); setSelected(new Set()); };
  const toggle = (id) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allOn = rows.length > 0 && selected.size === rows.length;
  const toggleAll = () => setSelected(allOn ? new Set() : new Set(rows.map((r) => r.id)));

  const createGnfa = () => navigate('/gnfa/create/detail', { state: { eventId: ev.id, lineIds: [...selected] } });

  const columns = [
    { key: 'sel', label: 'Select', style: { width: 56 }, render: (r) => (
      <input type="checkbox" aria-label={`Select RFQ line ${r.rfqLine}`} checked={selected.has(r.id)} onChange={() => toggle(r.id)} style={{ accentColor: tok.navy, width: 16, height: 16 }} />
    ) },
    { key: 'rfqId', label: 'RFQ ID', style: { whiteSpace: 'nowrap' } },
    { key: 'rfqLine', label: 'RFQ Line Item' },
    { key: 'pr', label: 'PR Number' },
    { key: 'prLine', label: 'PR Line Item' },
    { key: 'total', label: 'Total Amount with GST', style: rightAlign },
    { key: 'material', label: 'Material Code' },
    { key: 'description', label: 'Material Description' },
    { key: 'qty', label: 'RFQ Qty', style: rightAlign },
    { key: 'uom', label: 'UoM' },
  ];

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'GNFA', to: '/gnfa' }, { label: 'GNFA Create' }]}
        title="GNFA Create"
        subtitle="Find a sourcing event, select the lines to include and create the GNFA."
        actions={<Button icon={<FilePlus2 size={16} />} disabled={!selected.size} onClick={createGnfa}>Create GNFA</Button>}
      />

      <Card style={{ marginBottom: 20 }}>
        <FilterRow>
          <InputField label="Event ID" value={input} onChange={(e) => setInput(e?.target?.value ?? e)} placeholder="e.g. 10038" style={{ minWidth: 240 }} />
          <Button onClick={search}>Go</Button>
          <Button variant="secondary" icon={<RotateCcw size={16} />} onClick={clear}>Clear</Button>
        </FilterRow>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 1 : isLaptop ? 2 : 3}, 1fr)`, gap: 16, marginBottom: 20 }}>
        <KpiCard label="Event ID" value={ev ? ev.id : '—'} icon={ListChecks} caption={ev ? `RFQ round ${ev.round}` : 'No event loaded'} />
        <KpiCard label="Selected lines" value={`${selected.size} / ${rows.length}`} icon={CheckSquare} caption="Choose lines to include" />
        <KpiCard label="Total NFA Amount" value="0.00" icon={Wallet} caption="Updates once the GNFA is created" />
      </div>

      <Card title="RFQ / PR line items" flush>
        {rows.length ? (
          <>
            <label style={{ ...type.button, display: 'flex', alignItems: 'center', gap: 8, color: tok.text, padding: '0 20px 12px' }}>
              <input type="checkbox" checked={allOn} onChange={toggleAll} style={{ accentColor: tok.navy }} /> Select all lines
            </label>
            <GnfaDataTable columns={columns} rows={rows} />
          </>
        ) : (
          <EmptyState title={eventId ? `No lines found for event ${eventId}` : 'Search for an event'} description="Enter an Event ID and choose Go to list its RFQ and PR line items." />
        )}
      </Card>
    </>
  );
}
