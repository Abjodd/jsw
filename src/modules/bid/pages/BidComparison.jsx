import { useState } from 'react';
import {
  Download,
  Search,
  RotateCcw,
  Info,
  Columns3,
  Layers,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
} from 'lucide-react';
import { Card, PageHeader, Button } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors, radius, rise, text, transition } from '@/theme/theme';
import CircularStepTabs from '../components/CircularStepTabs';
import { COMPARISON_DATA_MAP } from '../data/mockData';

const TABS = [
  { id: 'general', label: 'General Details', icon: Info },
  { id: 'items', label: 'Items', icon: Columns3 },
  { id: 'detail', label: 'Detail Comparison', icon: Layers },
];

export default function BidComparison() {
  const isMobile = useMediaQuery(bp.mobile);

  const [searchEventId, setSearchEventId] = useState('10038');
  const [currentEventId, setCurrentEventId] = useState('10038');
  const [activeTab, setActiveTab] = useState('items');
  const [commercialTermsOpen, setCommercialTermsOpen] = useState(true);
  const [exportNotice, setExportNotice] = useState(false);

  const data = COMPARISON_DATA_MAP[currentEventId] || COMPARISON_DATA_MAP['10038'];

  const handleSearch = () => {
    if (COMPARISON_DATA_MAP[searchEventId.trim()]) {
      setCurrentEventId(searchEventId.trim());
    } else {
      setCurrentEventId('10038');
    }
  };

  const handleClear = () => {
    setSearchEventId('');
  };

  const handleDownload = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  const thStyle = {
    padding: '10px 12px',
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
    padding: '10px 12px',
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
    padding: '3px 10px',
    borderRadius: 999,
    fontWeight: 600,
    fontSize: 11,
    display: 'inline-block',
    letterSpacing: '0.01em',
  });

  const summaryLabelStyle = {
    ...text.caption,
    fontWeight: 600,
    color: colors.navy,
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

        {/* Export Toast */}
        {exportNotice && (
          <div
            style={{
              position: 'fixed',
              bottom: 30,
              right: 30,
              background: colors.navy,
              color: colors.white,
              padding: '14px 22px',
              borderRadius: radius.md,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 8px 24px rgba(18,48,74,0.25)',
              zIndex: 9999,
              ...text.caption,
              fontWeight: 500,
              animation: 'jsw-rise 300ms ease',
            }}
          >
            <FileSpreadsheet size={18} color="#23845B" />
            <span>Bid Comparison exported to Excel successfully!</span>
          </div>
        )}

        {/* Main Card */}
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

            {/* ─── TAB 2: ITEMS SIDE-BY-SIDE ─── */}
            {activeTab === 'items' && (
              <div style={{ animation: 'jsw-slide-in 350ms ease' }}>
                <div
                  className="jsw-scroll-x"
                  style={{ border: `1px solid ${colors.border}`, borderRadius: radius.md, overflow: 'hidden' }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 1600 }}>
                    <thead>
                      {/* Grouped vendor headers */}
                      <tr>
                        <th style={{ ...thStyle, verticalAlign: 'middle' }} rowSpan={2}>Procurement Type</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle' }} rowSpan={2}>Line Item</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle' }} rowSpan={2}>Description</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle', textAlign: 'right' }} rowSpan={2}>Quantity</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle' }} rowSpan={2}>UOM</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle' }} rowSpan={2}>Delivery Location</th>

                        <th style={{ ...thStyle, textAlign: 'center', background: '#F0F9FF' }} colSpan={2}>
                          <span style={pillStyle('#E0F2FE', '#0369A1')}>INTEGRATED SOLUTIONS</span>
                        </th>
                        <th style={{ ...thStyle, textAlign: 'center', background: '#F0FDF4' }} colSpan={2}>
                          <span style={pillStyle('#DCFCE7', '#15803D')}>SIX DEGREES BCW PVT LTD</span>
                        </th>
                        <th style={{ ...thStyle, textAlign: 'center', background: '#FEFCE8' }} colSpan={2}>
                          <span style={pillStyle('#FEF9C3', '#854D0E')}>Line Wise Lowest</span>
                        </th>
                        <th style={{ ...thStyle, textAlign: 'center', background: '#F8FAFC' }} colSpan={4}>
                          <span style={pillStyle('#E2E8F0', '#475569')}>Last PO Detail</span>
                        </th>
                      </tr>
                      {/* Sub-columns */}
                      <tr>
                        <th style={{ ...thStyle, textAlign: 'right', background: '#F8FAFC' }}>Initial Quote</th>
                        <th style={{ ...thStyle, textAlign: 'right', background: '#F8FAFC' }}>Final Quote</th>
                        <th style={{ ...thStyle, textAlign: 'right', background: '#F8FAFC' }}>Initial Quote</th>
                        <th style={{ ...thStyle, textAlign: 'right', background: '#F8FAFC' }}>Final Quote</th>
                        <th style={{ ...thStyle, background: '#F8FAFC' }}>Vendor</th>
                        <th style={{ ...thStyle, textAlign: 'right', background: '#F8FAFC' }}>Final Quote</th>
                        <th style={{ ...thStyle, textAlign: 'right', background: '#F8FAFC' }}>PO Value</th>
                        <th style={{ ...thStyle, background: '#F8FAFC' }}>PO Date</th>
                        <th style={{ ...thStyle, background: '#F8FAFC' }}>Vendor Name</th>
                        <th style={{ ...thStyle, background: '#F8FAFC' }}>Del. Location</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data.items.map((row, idx) => (
                        <tr key={row.lineItem} style={{ animation: `jsw-rise 350ms ease both`, animationDelay: `${idx * 50}ms` }}>
                          <td style={tdStyle}>{row.procurementType}</td>
                          <td style={{ ...tdStyle, fontWeight: 600, color: colors.navy }}>{row.lineItem}</td>
                          <td style={{ ...tdStyle, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.description}</td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>{row.quantity}</td>
                          <td style={tdStyle}>{row.uom}</td>
                          <td style={tdStyle}>{row.deliveryLocation}</td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>{row.integratedInitial}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600 }}>{row.integratedFinal}</td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>{row.sixDegreesInitial}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, color: '#15803D' }}>{row.sixDegreesFinal}</td>
                          <td style={{ ...tdStyle, fontWeight: 500 }}>{row.lineWiseLowestVendor}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, color: '#15803D' }}>{row.lineWiseLowestFinal}</td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>{row.poValue}</td>
                          <td style={tdStyle}>{row.poDate}</td>
                          <td style={tdStyle}>{row.lastVendorName}</td>
                          <td style={tdStyle}>{row.lastDeliveryLocation}</td>
                        </tr>
                      ))}

                      {/* ─── Summary Rows ─── */}
                      {[
                        {
                          label: 'Total Price (Without GST)',
                          intVal: data.summary.integratedWithoutGst,
                          sixVal: data.summary.sixDegreesWithoutGst,
                        },
                        {
                          label: 'Total Price (With GST)',
                          intVal: data.summary.integratedWithGst,
                          sixVal: data.summary.sixDegreesWithGst,
                          highlight: true,
                        },
                      ].map((s) => (
                        <tr key={s.label} style={{ background: colors.bgSubtle }}>
                          <td style={tdStyle} colSpan={5} />
                          <td style={{ ...tdStyle, ...summaryLabelStyle }}>{s.label}</td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>—</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: s.highlight ? colors.navy : undefined }}>{s.intVal}</td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>—</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: s.highlight ? '#23845B' : undefined }}>{s.sixVal}</td>
                          <td style={tdStyle} colSpan={6} />
                        </tr>
                      ))}

                      {/* Rank */}
                      <tr style={{ background: colors.bgSubtle }}>
                        <td style={tdStyle} colSpan={5} />
                        <td style={{ ...tdStyle, ...summaryLabelStyle }}>Commercial Rank (with GST)</td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>—</td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          <span style={pillStyle('#EEF4F9', colors.steel)}>{data.summary.integratedRank}</span>
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>—</td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          <span style={pillStyle('#E9F4EE', '#23845B')}>{data.summary.sixDegreesRank}</span>
                        </td>
                        <td style={tdStyle} colSpan={6} />
                      </tr>

                      {/* Difference */}
                      <tr style={{ background: colors.bgSubtle }}>
                        <td style={tdStyle} colSpan={5} />
                        <td style={{ ...tdStyle, ...summaryLabelStyle }}>Difference (L1 & L2 final quotes)</td>
                        <td style={{ ...tdStyle, textAlign: 'right' }} colSpan={2}>
                          <strong style={{ color: colors.navy, fontSize: 13 }}>{data.summary.diffL1L2}</strong>
                        </td>
                        <td style={tdStyle} colSpan={8} />
                      </tr>

                      {/* >10% check */}
                      <tr style={{ background: colors.bgSubtle }}>
                        <td style={tdStyle} colSpan={5} />
                        <td style={{ ...tdStyle, ...summaryLabelStyle }}>Is L1–L2 difference &gt; 10%?</td>
                        <td style={{ ...tdStyle, textAlign: 'right' }} colSpan={2}>
                          <span style={pillStyle(data.summary.isDiffMoreThan10Percent === 'YES' ? '#FAECEC' : '#E9F4EE', data.summary.isDiffMoreThan10Percent === 'YES' ? '#C44747' : '#23845B')}>
                            {data.summary.isDiffMoreThan10Percent}
                          </span>
                        </td>
                        <td style={tdStyle} colSpan={8} />
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Commercial Terms Comparison */}
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
                      {data.commercialTermsComparison.length} clauses
                    </span>
                  </button>

                  {commercialTermsOpen && (
                    <div className="jsw-scroll-x" style={{ animation: 'jsw-fade-in 250ms ease' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                        <thead>
                          <tr style={{ background: colors.bgSubtle }}>
                            <th style={{ ...thStyle, width: '25%' }}>Commercial Terms</th>
                            <th style={{ ...thStyle, width: '25%' }}>Azure Power Standard</th>
                            <th style={{ ...thStyle, width: '25%' }}>SIX DEGREES BCW PVT...</th>
                            <th style={{ ...thStyle, width: '25%' }}>INTEGRATED SOLUTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.commercialTermsComparison.map((row, idx) => (
                            <tr key={row.term} style={{ background: idx % 2 === 0 ? 'transparent' : colors.bgSubtle }}>
                              <td style={{ ...tdStyle, fontWeight: 500 }}>{row.term}</td>
                              <td style={{ ...tdStyle, color: colors.textSecondary }}>
                                {row.term === 'GCC Terms' ? (
                                  <a href="#gcc" style={{ color: colors.steel, textDecoration: 'underline' }}>{row.azure}</a>
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

            {/* ─── TAB 3: DETAIL COMPARISON ─── */}
            {activeTab === 'detail' && (
              <div style={{ animation: 'jsw-slide-in 350ms ease' }}>
                <div
                  className="jsw-scroll-x"
                  style={{ border: `1px solid ${colors.border}`, borderRadius: radius.md, overflow: 'hidden' }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 1800 }}>
                    <thead>
                      <tr>
                        <th style={{ ...thStyle, verticalAlign: 'middle' }} rowSpan={2}>RFQ ID</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle' }} rowSpan={2}>RFQ Line</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle' }} rowSpan={2}>PR Number</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle' }} rowSpan={2}>PR Line</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle' }} rowSpan={2}>Material Code</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle' }} rowSpan={2}>Material Description</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle', textAlign: 'right' }} rowSpan={2}>RFQ Qty</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle' }} rowSpan={2}>UoM</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle' }} rowSpan={2}>Plant Code</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle' }} rowSpan={2}>Plant Address</th>
                        <th style={{ ...thStyle, verticalAlign: 'middle' }} rowSpan={2}>Tax Code</th>

                        <th style={{ ...thStyle, textAlign: 'center', background: '#F0FDF4' }} colSpan={7}>
                          <span style={{ fontWeight: 700, color: '#15803D' }}>SIX DEGREES BCW PVT LTD (R01)</span>
                        </th>
                        <th style={{ ...thStyle, textAlign: 'center', background: '#F0F9FF' }} colSpan={7}>
                          <span style={{ fontWeight: 700, color: '#0369A1' }}>INTEGRATED SOLUTIONS (R01)</span>
                        </th>
                      </tr>
                      <tr>
                        {/* Six Degrees sub-cols */}
                        <th style={{ ...thStyle, textAlign: 'right' }}>Unit Price</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Freight</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>P & F</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Disc.(%)</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Basic Amt</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Tax Amt</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Total Amt</th>
                        {/* Integrated sub-cols */}
                        <th style={{ ...thStyle, textAlign: 'right' }}>Unit Price</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Freight</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>P & F</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Disc.(%)</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Basic Amt</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Tax Amt</th>
                        <th style={{ ...thStyle, textAlign: 'right' }}>Total Amt</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data.detailComparisonRows.map((row, idx) => (
                        <tr key={row.rfqLineItem} style={{ animation: `jsw-rise 350ms ease both`, animationDelay: `${idx * 50}ms` }}>
                          <td style={tdStyle}>{row.rfqId}</td>
                          <td style={{ ...tdStyle, fontWeight: 600, color: colors.navy }}>{row.rfqLineItem}</td>
                          <td style={tdStyle}>{row.prNumber}</td>
                          <td style={tdStyle}>{row.prLineItem}</td>
                          <td style={tdStyle}>{row.materialCode}</td>
                          <td style={{ ...tdStyle, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.materialDescription}</td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>{row.rfqQty}</td>
                          <td style={tdStyle}>{row.uom}</td>
                          <td style={tdStyle}>{row.plantCode}</td>
                          <td style={tdStyle}>{row.plantAddress}</td>
                          <td style={{ ...tdStyle, fontWeight: 600 }}>{row.taxCode}</td>

                          {/* Six Degrees */}
                          <td style={{ ...tdStyle, textAlign: 'right' }}>{row.sixDegrees.unitPrice}</td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>{row.sixDegrees.freight}</td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>{row.sixDegrees.packing}</td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>{row.sixDegrees.discount}%</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600 }}>{row.sixDegrees.basicAmount}</td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>{row.sixDegrees.taxAmount}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: '#15803D' }}>{row.sixDegrees.totalAmount}</td>

                          {/* Integrated */}
                          <td style={{ ...tdStyle, textAlign: 'right' }}>{row.integrated.unitPrice}</td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>{row.integrated.freight}</td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>{row.integrated.packing}</td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>{row.integrated.discount}%</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600 }}>{row.integrated.basicAmount}</td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>{row.integrated.taxAmount}</td>
                          <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: '#0369A1' }}>{row.integrated.totalAmount}</td>
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
