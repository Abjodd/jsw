import { useRef, useState } from 'react';
import {
  Download,
  Search,
  RotateCcw,
  Info,
  Columns3,
  Layers,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Trophy,
  TrendingUp,
  AlertTriangle,
  MoveHorizontal,
} from 'lucide-react';
import { Card, PageHeader, Button, QuickStats, useToast } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors, radius, rise, text, transition } from '@/theme/theme';
import { downloadCSV } from '@/utils/format';
import CircularStepTabs from '../components/CircularStepTabs';
import { COMPARISON_DATA_MAP } from '../data/mockData';

const TABS = [
  { id: 'general', label: 'General Details', icon: Info },
  { id: 'items', label: 'Items', icon: Columns3 },
  { id: 'detail', label: 'Detail Comparison', icon: Layers },
];

export default function BidComparison() {
  const { toast } = useToast();
  const isMobile = useMediaQuery(bp.mobile);

  const [searchEventId, setSearchEventId] = useState('10038');
  const [currentEventId, setCurrentEventId] = useState('10038');
  const [activeTab, setActiveTab] = useState('items');
  const [commercialTermsOpen, setCommercialTermsOpen] = useState(true);

  // References for horizontal scrolling
  const itemsTableRef = useRef(null);
  const detailTableRef = useRef(null);

  const data = COMPARISON_DATA_MAP[currentEventId] || COMPARISON_DATA_MAP['10038'];

  // Scroll helpers
  const scrollTable = (ref, offset) => {
    if (ref.current) {
      ref.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Quick stats summary cards
  const comparisonStats = [
    {
      key: 'l1',
      label: 'Rank L1 (Lowest)',
      value: `₹${data.summary.sixDegreesWithGst}`,
      caption: 'SIX DEGREES BCW PVT LTD',
      icon: Trophy,
      tone: 'success',
    },
    {
      key: 'l2',
      label: 'Rank L2 (Runner up)',
      value: `₹${data.summary.integratedWithGst}`,
      caption: 'INTEGRATED SOLUTIONS',
      icon: TrendingUp,
      tone: 'navy',
    },
    {
      key: 'variance',
      label: 'Price Variance Gap',
      value: `₹${data.summary.diffL1L2}`,
      caption: 'Absolute difference (L1 vs L2)',
      icon: Layers,
      tone: 'error',
    },
    {
      key: 'check10',
      label: 'L1/L2 Gap > 10%?',
      value: data.summary.isDiffMoreThan10Percent,
      caption: 'Requires HOD Review / Justification',
      icon: AlertTriangle,
      tone: 'warning',
    },
  ];

  const handleSearch = () => {
    if (COMPARISON_DATA_MAP[searchEventId.trim()]) {
      setCurrentEventId(searchEventId.trim());
      toast({ title: 'Event Loaded', description: `Showing bid comparison for Event #${searchEventId.trim()}` });
    } else {
      setCurrentEventId('10038');
      toast({ title: 'Default Event Loaded', description: 'Showing Event #10038 comparison data.' });
    }
  };

  const handleClear = () => {
    setSearchEventId('');
    toast({ title: 'Search Cleared', description: 'Event search input reset.' });
  };

  const handleDownload = () => {
    downloadCSV(
      `bid-comparison-matrix-${currentEventId}.csv`,
      [
        { label: 'Procurement Type', value: (r) => r.procurementType },
        { label: 'Line Item', value: (r) => r.lineItem },
        { label: 'Description', value: (r) => r.description },
        { label: 'Quantity', value: (r) => r.quantity },
        { label: 'UOM', value: (r) => r.uom },
        { label: 'Delivery Location', value: (r) => r.deliveryLocation },
        { label: 'Integrated Initial Quote', value: (r) => r.integratedInitial },
        { label: 'Integrated Final Quote', value: (r) => r.integratedFinal },
        { label: 'Six Degrees Initial Quote', value: (r) => r.sixDegreesInitial },
        { label: 'Six Degrees Final Quote', value: (r) => r.sixDegreesFinal },
        { label: 'Line Wise Lowest Vendor', value: (r) => r.lineWiseLowestVendor },
        { label: 'Line Wise Lowest Final', value: (r) => r.lineWiseLowestFinal },
        { label: 'Last PO Value', value: (r) => r.poValue },
        { label: 'Last PO Date', value: (r) => r.poDate },
        { label: 'Last Vendor Name', value: (r) => r.lastVendorName },
      ],
      data.items
    );
    toast({ title: 'Export Ready', description: `Bid Comparison Matrix for Event #${currentEventId} exported to CSV.` });
  };

  const thStyle = {
    padding: '10px 14px',
    background: colors.bgSubtle,
    color: colors.textSecondary,
    fontWeight: 600,
    ...text.caption,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    textAlign: 'left',
    borderBottom: `1px solid ${colors.border}`,
    borderRight: `1px solid ${colors.border}`,
    whiteSpace: 'nowrap',
  };

  const tdStyle = {
    padding: '12px 14px',
    borderBottom: `1px solid ${colors.border}`,
    borderRight: `1px solid ${colors.border}`,
    ...text.body,
    fontSize: 13,
    color: colors.textPrimary,
    whiteSpace: 'nowrap',
  };

  const pillStyle = (bg, color) => ({
    background: bg,
    color,
    padding: '4px 12px',
    borderRadius: 6,
    fontWeight: 600,
    fontSize: 12,
    display: 'inline-block',
    letterSpacing: '0.01em',
    border: `1px solid ${color}33`,
  });

  // Red badge for summary rows matching reference screenshot
  const redSummaryBadgeStyle = {
    background: '#D9383A',
    color: '#FFFFFF',
    padding: '5px 12px',
    borderRadius: 6,
    fontWeight: 700,
    fontSize: 11,
    display: 'inline-block',
    boxShadow: '0 1px 3px rgba(217, 56, 58, 0.3)',
    whiteSpace: 'nowrap',
  };

  return (
    <>
      <PageHeader
        crumbs={[
          { label: 'Applications', to: '/' },
          { label: 'BID', to: '/bid' },
          { label: 'Bid Comparison' },
        ]}
        title="Bid Comparison"
        subtitle="Compare multi-vendor techno-commercial bids side-by-side with L1/L2 ranks and cost breakdowns."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, ...rise(0) }}>
        {/* Executive Comparison Summary KPI Cards */}
        <QuickStats items={comparisonStats} active="l1" onChange={() => {}} />

        {/* Search & Filter Bar */}
        <Card>
          <div
            style={{
              display: 'flex',
              alignItems: isMobile ? 'stretch' : 'center',
              justifyContent: 'space-between',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ ...text.label }}>Event ID:</span>
              <div style={{ position: 'relative', width: isMobile ? '100%' : 220 }}>
                <input
                  type="text"
                  placeholder="e.g. 10038"
                  value={searchEventId}
                  onChange={(e) => setSearchEventId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  style={{
                    width: '100%',
                    height: 38,
                    padding: '0 34px 0 12px',
                    borderRadius: radius.sm,
                    border: `1px solid ${colors.border}`,
                    background: colors.bgCard,
                    ...text.input,
                    outline: 'none',
                    transition,
                  }}
                />
                <Search size={15} style={{ position: 'absolute', right: 10, top: 11, color: colors.textDisabled, pointerEvents: 'none' }} />
              </div>
              <Button size="sm" variant="primary" onClick={handleSearch}>Go</Button>
              <Button size="sm" variant="secondary" onClick={handleClear} icon={<RotateCcw size={14} />}>Clear</Button>
            </div>

            <Button size="sm" variant="secondary" icon={<Download size={15} />} onClick={handleDownload}>
              Download
            </Button>
          </div>
        </Card>

        {/* Main Card with Stepper Tabs */}
        <Card flush style={rise(60)}>
          <CircularStepTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

          <div style={{ padding: isMobile ? 16 : 24, animation: 'jsw-fade-in 300ms ease' }}>
            {/* ─── TAB 1: GENERAL DETAILS ─── */}
            {activeTab === 'general' && (
              <div style={{ animation: 'jsw-slide-in 350ms ease' }}>
                <h4 style={{ ...text.cardTitle, color: colors.navy, marginBottom: 16 }}>RFQ Details</h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: 16,
                    background: colors.bgSubtle,
                    padding: isMobile ? 16 : 24,
                    borderRadius: radius.md,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  {[
                    { label: 'Event ID', value: data.eventId },
                    { label: 'General Category', value: data.generalCategory },
                    { label: 'Commercial Reviewer', value: data.commercialReviewer },
                    { label: 'RFQ Subject', value: data.rfqSubject },
                    { label: 'Commodity', value: data.commodity },
                    { label: 'Base Currency', value: data.baseCurrency },
                    { label: 'RFQ Description', value: data.rfqDescription },
                    { label: 'Buyer Name', value: data.buyerName },
                  ].map((field) => (
                    <div key={field.label}>
                      <span style={{ ...text.caption, color: colors.textSecondary }}>{field.label}</span>
                      <p style={{ ...text.body, fontWeight: 600, margin: '4px 0 0' }}>{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── TAB 2: ITEMS SIDE-BY-SIDE MATRIX COMPARISON ─── */}
            {activeTab === 'items' && (
              <div style={{ animation: 'jsw-slide-in 350ms ease' }}>
                {/* Horizontal Scroll Navigation Toolbar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                    marginBottom: 12,
                    padding: '8px 14px',
                    background: colors.steel50,
                    borderRadius: radius.md,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: colors.steel }}>
                    <MoveHorizontal size={16} />
                    <span style={{ ...text.caption, fontWeight: 600, color: colors.navy }}>
                      Scrollable Comparison Matrix
                    </span>
                    <span style={{ ...text.caption, color: colors.textSecondary }}>
                      (Drag scrollbar or use buttons to navigate all vendors, lowest bids, and PO details)
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={<ChevronLeft size={16} />}
                      onClick={() => scrollTable(itemsTableRef, -450)}
                    >
                      Scroll Left
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      iconRight={<ChevronRight size={16} />}
                      onClick={() => scrollTable(itemsTableRef, 450)}
                    >
                      Scroll Right
                    </Button>
                  </div>
                </div>

                {/* Wide Table with Guaranteed Free Scrolling */}
                <div
                  ref={itemsTableRef}
                  className="table-scroll-container"
                  style={{
                    width: '100%',
                    border: `1px solid ${colors.border}`,
                    borderRadius: radius.md,
                    background: colors.bgCard,
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 2100 }}>
                    <thead>
                      {/* Grouped vendor headers */}
                      <tr>
                        {/* Base Line Item Columns */}
                        <th style={{ ...thStyle, verticalAlign: 'middle', width: 140 }} rowSpan={2}>Procurement Type</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle', width: 90 }} rowSpan={2}>Line Item</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle', minWidth: 260 }} rowSpan={2}>Description</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle', textAlign: 'right', width: 100 }} rowSpan={2}>Quantity</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle', width: 70 }} rowSpan={2}>UOM</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle', width: 160 }} rowSpan={2}>Delivery Location</th>

                        {/* Vendor 1 Column Header */}
                        <th
                          style={{
                            ...thStyle,
                            textAlign: 'center',
                            background: '#F0F9FF',
                            borderBottom: `1px solid ${colors.border}`,
                          }}
                          colSpan={2}
                        >
                          <span style={pillStyle('#DCFCE7', '#15803D')}>
                            INTEGRATED SOLUTIONS
                          </span>
                        </th>

                        {/* Vendor 2 Column Header */}
                        <th
                          style={{
                            ...thStyle,
                            textAlign: 'center',
                            background: '#F0FDF4',
                            borderBottom: `1px solid ${colors.border}`,
                          }}
                          colSpan={2}
                        >
                          <span style={pillStyle('#DCFCE7', '#15803D')}>
                            SIX DEGREES BCW PRIVATE LIMITED
                          </span>
                        </th>

                        {/* Line Wise Lowest */}
                        <th
                          style={{
                            ...thStyle,
                            textAlign: 'center',
                            background: '#FEFCE8',
                            borderBottom: `1px solid ${colors.border}`,
                          }}
                          colSpan={2}
                        >
                          <span style={pillStyle('#DCFCE7', '#15803D')}>
                            Line Wise Lowest
                          </span>
                        </th>

                        {/* PO Detail */}
                        <th
                          style={{
                            ...thStyle,
                            textAlign: 'center',
                            background: '#F8FAFC',
                            borderBottom: `1px solid ${colors.border}`,
                          }}
                          colSpan={4}
                        >
                          <span style={pillStyle('#DCFCE7', '#15803D')}>
                            PO Detail
                          </span>
                        </th>
                      </tr>

                      {/* Sub-columns */}
                      <tr>
                        {/* Integrated Solutions */}
                        <th style={{ ...thStyle, textAlign: 'right', background: '#F8FAFC', width: 120 }}>Initial Quote</th>
                        <th style={{ ...thStyle, textAlign: 'right', background: '#F8FAFC', width: 120 }}>Final Quote</th>

                        {/* Six Degrees */}
                        <th style={{ ...thStyle, textAlign: 'right', background: '#F8FAFC', width: 120 }}>Initial Quote</th>
                        <th style={{ ...thStyle, textAlign: 'right', background: '#F8FAFC', width: 120 }}>Final Quote</th>

                        {/* Line Wise Lowest */}
                        <th style={{ ...thStyle, background: '#F8FAFC', width: 220 }}>Vendor</th>
                        <th style={{ ...thStyle, textAlign: 'right', background: '#F8FAFC', width: 120 }}>Final Quote</th>

                        {/* PO Detail */}
                        <th style={{ ...thStyle, textAlign: 'right', background: '#F8FAFC', width: 130 }}>PO Value</th>
                        <th style={{ ...thStyle, background: '#F8FAFC', width: 120 }}>PO Date</th>
                        <th style={{ ...thStyle, background: '#F8FAFC', width: 220 }}>Vendor Name</th>
                        <th style={{ ...thStyle, background: '#F8FAFC', width: 160 }}>Delivery Location</th>
                      </tr>
                    </thead>

                    <tbody>
                      {/* Line Item Rows */}
                      {data.items.map((row) => (
                        <tr key={row.lineItem}>
                          <td style={tdStyle}>{row.procurementType}</td>
                          <td style={{ ...tdStyle, fontWeight: 600, color: colors.navy }}>{row.lineItem}</td>
                          <td style={{ ...tdStyle, fontWeight: 500 }}>{row.description}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.quantity}</td>
                          <td style={tdStyle}>{row.uom}</td>
                          <td style={tdStyle}>{row.deliveryLocation}</td>

                          {/* Integrated Solutions */}
                          <td style={{ ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.integratedInitial}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{row.integratedFinal}</td>

                          {/* Six Degrees */}
                          <td style={{ ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.sixDegreesInitial}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, color: '#15803D', fontVariantNumeric: 'tabular-nums' }}>{row.sixDegreesFinal}</td>

                          {/* Line Wise Lowest */}
                          <td style={{ ...tdStyle, fontWeight: 500 }}>{row.lineWiseLowestVendor}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, color: '#15803D', fontVariantNumeric: 'tabular-nums' }}>
                            {row.lineWiseLowestFinal}
                          </td>

                          {/* PO Detail */}
                          <td style={{ ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.poValue}</td>
                          <td style={tdStyle}>{row.poDate}</td>
                          <td style={tdStyle}>{row.lastVendorName}</td>
                          <td style={tdStyle}>{row.lastDeliveryLocation}</td>
                        </tr>
                      ))}

                      {/* Summary Row 1: Total Price(Without GST) */}
                      <tr style={{ background: colors.bgSubtle }}>
                        <td style={tdStyle} colSpan={5}></td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                          <span style={redSummaryBadgeStyle}>Total Price(Without GST)</span>
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>—</td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                          {data.summary.integratedWithoutGst}
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>—</td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                          {data.summary.sixDegreesWithoutGst}
                        </td>
                        <td style={tdStyle} colSpan={6}></td>
                      </tr>

                      {/* Summary Row 2: Total Price(With GST) */}
                      <tr style={{ background: colors.bgSubtle }}>
                        <td style={tdStyle} colSpan={5}></td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                          <span style={redSummaryBadgeStyle}>Total Price(With GST)</span>
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>—</td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: colors.navy, fontVariantNumeric: 'tabular-nums' }}>
                          {data.summary.integratedWithGst}
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>—</td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: '#23845B', fontVariantNumeric: 'tabular-nums' }}>
                          {data.summary.sixDegreesWithGst}
                        </td>
                        <td style={tdStyle} colSpan={6}></td>
                      </tr>

                      {/* Summary Row 3: Commercial Rank(with GST) */}
                      <tr style={{ background: colors.bgSubtle }}>
                        <td style={tdStyle} colSpan={5}></td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                          <span style={redSummaryBadgeStyle}>Commercial Rank(with GST)</span>
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>—</td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700 }}>
                          {data.summary.integratedRank}
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>—</td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: '#23845B' }}>
                          {data.summary.sixDegreesRank}
                        </td>
                        <td style={tdStyle} colSpan={6}></td>
                      </tr>

                      {/* Summary Row 4: Difference between final quotes of L1 L2 */}
                      <tr style={{ background: colors.bgSubtle }}>
                        <td style={tdStyle} colSpan={5}></td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                          <span style={redSummaryBadgeStyle}>Difference between final quotes of L1 L2</span>
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>—</td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: colors.navy, fontVariantNumeric: 'tabular-nums' }}>
                          {data.summary.diffL1L2}
                        </td>
                        <td style={tdStyle} colSpan={8}></td>
                      </tr>

                      {/* Summary Row 5: Is difference between L1 & L2 more than 10%? */}
                      <tr style={{ background: colors.bgSubtle }}>
                        <td style={tdStyle} colSpan={5}></td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                          <span style={redSummaryBadgeStyle}>Is difference between L1 & L2 more than 10%?</span>
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>—</td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: '#C44747' }}>
                          {data.summary.isDiffMoreThan10Percent}
                        </td>
                        <td style={tdStyle} colSpan={8}></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Commercial Terms Comparison Accordion */}
                <div
                  style={{
                    border: `1px solid ${colors.border}`,
                    borderRadius: radius.md,
                    overflow: 'hidden',
                    background: colors.bgCard,
                    marginTop: 24,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setCommercialTermsOpen(!commercialTermsOpen)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 20px',
                      background: colors.bgSubtle,
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: 6, background: '#E0F2FE', color: '#0369A1' }}>
                        {commercialTermsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </span>
                      <span style={{ ...text.cardTitle, fontSize: 15, color: colors.navy }}>Commercial Terms Comparison</span>
                    </div>
                    <span style={{ ...text.caption, color: colors.textSecondary }}>
                      {data.commercialTermsComparison.length} standard clauses evaluated
                    </span>
                  </button>

                  {commercialTermsOpen && (
                    <div className="table-scroll-container">
                      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 850 }}>
                        <thead>
                          <tr style={{ background: colors.bgSubtle }}>
                            <th style={{ ...thStyle, width: '25%' }}>Commercial Terms</th>
                            <th style={{ ...thStyle, width: '25%' }}>Azure Power Standard</th>
                            <th style={{ ...thStyle, width: '25%' }}>SIX DEGREES BCW PRIVATE...</th>
                            <th style={{ ...thStyle, width: '25%' }}>INTEGRATED SOLUTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.commercialTermsComparison.map((row, idx) => (
                            <tr key={row.term} style={{ background: idx % 2 === 0 ? 'transparent' : colors.bgSubtle }}>
                              <td style={{ ...tdStyle, fontWeight: 500 }}>{row.term}</td>
                              <td style={{ ...tdStyle, color: colors.textSecondary }}>
                                {row.term === 'GCC Terms' ? (
                                  <a href="#gcc" style={{ color: colors.steel, textDecoration: 'underline', fontWeight: 600 }}>{row.azure}</a>
                                ) : row.azure}
                              </td>
                              <td style={{ ...tdStyle, color: '#23845B', fontWeight: 500 }}>{row.sixDegrees}</td>
                              <td style={{ ...tdStyle, color: '#23845B', fontWeight: 500 }}>{row.integrated}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── TAB 3: DETAIL COMPARISON (ITEMIZED COST BREAKDOWN ACROSS VENDORS) ─── */}
            {activeTab === 'detail' && (
              <div style={{ animation: 'jsw-slide-in 350ms ease' }}>
                {/* Horizontal Scroll Navigation Toolbar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                    marginBottom: 12,
                    padding: '8px 14px',
                    background: colors.steel50,
                    borderRadius: radius.md,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: colors.steel }}>
                    <MoveHorizontal size={16} />
                    <span style={{ ...text.caption, fontWeight: 600, color: colors.navy }}>
                      Full Detailed Breakdown Across All Vendors
                    </span>
                    <span style={{ ...text.caption, color: colors.textSecondary }}>
                      (Includes Unit Price, Freight, P&F, Discounts, Basic Amount, Taxes & Totals)
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={<ChevronLeft size={16} />}
                      onClick={() => scrollTable(detailTableRef, -500)}
                    >
                      Scroll Left
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      iconRight={<ChevronRight size={16} />}
                      onClick={() => scrollTable(detailTableRef, 500)}
                    >
                      Scroll Right
                    </Button>
                  </div>
                </div>

                <div
                  ref={detailTableRef}
                  className="table-scroll-container"
                  style={{
                    width: '100%',
                    border: `1px solid ${colors.border}`,
                    borderRadius: radius.md,
                    background: colors.bgCard,
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 2400 }}>
                    <thead>
                      {/* Top level headers */}
                      <tr>
                        {/* Base Columns */}
                        <th style={{ ...thStyle, verticalAlign: 'middle', width: 140 }} rowSpan={2}>RFQ ID</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle', width: 110 }} rowSpan={2}>RFQ Line Item</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle', width: 120 }} rowSpan={2}>PR Number</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle', width: 110 }} rowSpan={2}>PR Line Item</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle', width: 120 }} rowSpan={2}>Material Code</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle', minWidth: 240 }} rowSpan={2}>Material Description</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle', textAlign: 'right', width: 90 }} rowSpan={2}>RFQ Qty</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle', width: 70 }} rowSpan={2}>UoM</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle', width: 90 }} rowSpan={2}>Plant Code</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle', width: 140 }} rowSpan={2}>Plant Address</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle', width: 90 }} rowSpan={2}>Tax Code</th>

                        {/* SIX DEGREES Group Header */}
                        <th
                          style={{
                            ...thStyle,
                            textAlign: 'center',
                            background: '#F0FDF4',
                            borderBottom: `1px solid ${colors.border}`,
                          }}
                          colSpan={7}
                        >
                          <div style={{ fontWeight: 700, color: '#15803D', fontSize: 13 }}>
                            SIX DEGREES BCW PRIVATE LIMITED
                          </div>
                          <div style={{ ...text.caption, color: colors.textSecondary, marginTop: 2 }}>
                            Round R01
                          </div>
                        </th>

                        {/* INTEGRATED SOLUTIONS Group Header */}
                        <th
                          style={{
                            ...thStyle,
                            textAlign: 'center',
                            background: '#F0F9FF',
                            borderBottom: `1px solid ${colors.border}`,
                          }}
                          colSpan={7}
                        >
                          <div style={{ fontWeight: 700, color: '#0369A1', fontSize: 13 }}>
                            INTEGRATED SOLUTIONS
                          </div>
                          <div style={{ ...text.caption, color: colors.textSecondary, marginTop: 2 }}>
                            Round R01
                          </div>
                        </th>
                      </tr>

                      {/* Sub-header columns */}
                      <tr>
                        {/* Six Degrees */}
                        <th style={{ ...thStyle, textAlign: 'right', width: 100 }}>Unit Price</th>
                        <th style={{ ...thStyle, textAlign: 'right', width: 130 }}>Freight & Insurance</th>
                        <th style={{ ...thStyle, textAlign: 'right', width: 130 }}>Packing & Forwarding</th>
                        <th style={{ ...thStyle, textAlign: 'right', width: 100 }}>Discount (%)</th>
                        <th style={{ ...thStyle, textAlign: 'right', width: 110 }}>Basic Amount</th>
                        <th style={{ ...thStyle, textAlign: 'right', width: 110 }}>Tax Amount</th>
                        <th style={{ ...thStyle, textAlign: 'right', width: 120 }}>Total Amount</th>

                        {/* Integrated Solutions */}
                        <th style={{ ...thStyle, textAlign: 'right', width: 100 }}>Unit Price</th>
                        <th style={{ ...thStyle, textAlign: 'right', width: 130 }}>Freight & Insurance</th>
                        <th style={{ ...thStyle, textAlign: 'right', width: 130 }}>Packing & Forwarding</th>
                        <th style={{ ...thStyle, textAlign: 'right', width: 100 }}>Discount (%)</th>
                        <th style={{ ...thStyle, textAlign: 'right', width: 110 }}>Basic Amount</th>
                        <th style={{ ...thStyle, textAlign: 'right', width: 110 }}>Tax Amount</th>
                        <th style={{ ...thStyle, textAlign: 'right', width: 120 }}>Total Amount</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data.detailComparisonRows.map((row) => (
                        <tr key={row.rfqLineItem}>
                          <td style={tdStyle}>{row.rfqId}</td>
                          <td style={{ ...tdStyle, fontWeight: 600, color: colors.navy }}>{row.rfqLineItem}</td>
                          <td style={tdStyle}>{row.prNumber}</td>
                          <td style={tdStyle}>{row.prLineItem}</td>
                          <td style={tdStyle}>{row.materialCode}</td>
                          <td style={{ ...tdStyle, fontWeight: 500 }}>{row.materialDescription}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.rfqQty}</td>
                          <td style={tdStyle}>{row.uom}</td>
                          <td style={tdStyle}>{row.plantCode}</td>
                          <td style={tdStyle}>{row.plantAddress}</td>
                          <td style={{ ...tdStyle, fontWeight: 600, color: colors.navy }}>{row.taxCode}</td>

                          {/* Six Degrees */}
                          <td style={{ ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.sixDegrees.unitPrice}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.sixDegrees.freight}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.sixDegrees.packing}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.sixDegrees.discount}%</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{row.sixDegrees.basicAmount}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.sixDegrees.taxAmount}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: '#15803D', fontVariantNumeric: 'tabular-nums' }}>
                            {row.sixDegrees.totalAmount}
                          </td>

                          {/* Integrated */}
                          <td style={{ ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.integrated.unitPrice}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.integrated.freight}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.integrated.packing}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.integrated.discount}%</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{row.integrated.basicAmount}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.integrated.taxAmount}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: '#0369A1', fontVariantNumeric: 'tabular-nums' }}>
                            {row.integrated.totalAmount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
