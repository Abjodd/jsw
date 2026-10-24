import { useMemo, useState } from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Search,
  RotateCcw,
  Plus,
  FileCheck,
  Info,
  List,
  Paperclip,
  Check,
  Download,
  Layers,
  UserCheck,
  Calculator,
} from 'lucide-react';
import { Card, PageHeader, Button, StatusBadge, QuickStats, useToast } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors, radius, rise, text, transition } from '@/theme/theme';
import { downloadCSV, formatINR } from '@/utils/format';
import CircularStepTabs from '../components/CircularStepTabs';
import AddCostModal from '../components/AddCostModal';
import CommercialTermsTable from '../components/CommercialTermsTable';
import AttachmentManager from '../components/AttachmentManager';
import { BID_SUBMISSION_EVENTS, INITIAL_SUBMISSION_DETAIL } from '../data/mockData';

const TABS = [
  { id: 'items', label: 'Items', icon: List },
  { id: 'general', label: 'General Details', icon: Info },
  { id: 'attachments', label: 'Attachment', icon: Paperclip },
  { id: 'gcc', label: 'GCC Terms', icon: FileCheck },
];

export default function BidSubmission() {
  const { toast } = useToast();
  const isMobile = useMediaQuery(bp.mobile);
  const isTablet = useMediaQuery(bp.tablet);

  // Navigation state: 'list' (dashboard) vs 'detail' (quotation entry)
  const [viewMode, setViewMode] = useState('list');
  const [selectedEventId, setSelectedEventId] = useState('0000010039');

  // Quick filter state
  const [quickFilter, setQuickFilter] = useState('all');

  // Filter state for List view
  const [filterEventId, setFilterEventId] = useState('');
  const [filterRfqNumber, setFilterRfqNumber] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterBuyer, setFilterBuyer] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Active Tab inside Detail view
  const [activeTab, setActiveTab] = useState('items');

  // Detailed quotation state
  const [submissionData, setSubmissionData] = useState(INITIAL_SUBMISSION_DETAIL);
  const [selectedRowId, setSelectedRowId] = useState('00010');
  const [costModalOpen, setCostModalOpen] = useState(false);
  const [submitSuccessModal, setSubmitSuccessModal] = useState(false);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);

  // Filter logic
  const filteredEvents = useMemo(() => {
    return BID_SUBMISSION_EVENTS.filter((ev) => {
      // Quick filter
      if (quickFilter === 'open' && ev.status !== 'Open') return false;
      if (quickFilter === 'quoted' && ev.status !== 'Quoted') return false;
      if (quickFilter === 'deepak' && !ev.buyer.includes('Deepak')) return false;

      // Inputs
      if (filterEventId && !ev.eventNo.toLowerCase().includes(filterEventId.toLowerCase())) return false;
      if (filterRfqNumber && !ev.rfqId.toLowerCase().includes(filterRfqNumber.toLowerCase())) return false;
      if (filterBuyer && !ev.buyer.toLowerCase().includes(filterBuyer.toLowerCase())) return false;
      if (filterStatus !== 'All' && ev.status !== filterStatus) return false;
      return true;
    });
  }, [quickFilter, filterEventId, filterRfqNumber, filterBuyer, filterStatus]);

  // QuickStats metadata matching PR & PO dashboard style
  const quickStatsItems = [
    { key: 'all', label: 'All Bid Events', value: String(BID_SUBMISSION_EVENTS.length), caption: 'Total supplier RFQs', icon: Layers, tone: 'navy' },
    { key: 'open', label: 'Open for Bidding', value: String(BID_SUBMISSION_EVENTS.filter((e) => e.status === 'Open').length), caption: 'Requires quotation', icon: Clock, tone: 'progress' },
    { key: 'quoted', label: 'Quoted Events', value: String(BID_SUBMISSION_EVENTS.filter((e) => e.status === 'Quoted').length), caption: 'Submitted to buyers', icon: CheckCircle, tone: 'success' },
    { key: 'deepak', label: 'Buyer: Deepak Jha', value: String(BID_SUBMISSION_EVENTS.filter((e) => e.buyer.includes('Deepak')).length), caption: 'O&M Services desk', icon: UserCheck, tone: 'warning' },
  ];

  const handleClearFilters = () => {
    setFilterEventId('');
    setFilterRfqNumber('');
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterBuyer('');
    setFilterStatus('All');
    setQuickFilter('all');
    toast({ title: 'Filters reset', description: 'Showing all bid submission events.' });
  };

  const handleOpenDetail = (eventNo) => {
    setSelectedEventId(eventNo);
    setViewMode('detail');
    setActiveTab('items');
  };

  const handleSaveCost = (updatedItem) => {
    setSubmissionData((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === updatedItem.id ? updatedItem : it)),
    }));
    toast({ title: 'Cost updated', description: `Line item ${updatedItem.rfqLineItem} price recalculated.` });
  };

  const handleDeliveryDaysChange = (itemId, val) => {
    setSubmissionData((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === itemId ? { ...it, deliveryDays: val } : it)),
    }));
  };

  const handleGccChange = (field, val) => {
    setSubmissionData((prev) => ({
      ...prev,
      gccTerms: { ...prev.gccTerms, [field]: val },
    }));
  };

  const handleExportEvents = () => {
    downloadCSV(
      'bid-submission-events.csv',
      [
        { label: 'Event No', value: (r) => r.eventNo },
        { label: 'RFQ ID', value: (r) => r.rfqId },
        { label: 'Quotation ID', value: (r) => r.quotationId },
        { label: 'Start Date', value: (r) => r.rfqStartDateTime },
        { label: 'End Date', value: (r) => r.rfqEndDateTime },
        { label: 'Buyer', value: (r) => r.buyer },
        { label: 'Status', value: (r) => r.status },
        { label: 'Bid Extension', value: (r) => r.bidPeriodExtension },
      ],
      filteredEvents
    );
    toast({ title: 'Export ready', description: `${filteredEvents.length} events exported to CSV.` });
  };

  // Quotation metrics summary
  const quoteSummary = useMemo(() => {
    const basic = submissionData.items.reduce((s, it) => s + (it.unitPrice || 0) * (it.rfqQty || 1), 0);
    const tax = submissionData.items.reduce((s, it) => s + (it.taxAmount || 0), 0);
    const total = submissionData.items.reduce((s, it) => s + (it.totalWithTaxAmount || 0), 0);
    return { basic, tax, total };
  }, [submissionData.items]);

  const inputStyle = {
    width: '100%',
    height: 40,
    padding: '0 12px',
    borderRadius: radius.md,
    border: `1px solid ${colors.border}`,
    background: colors.bgCard,
    ...text.input,
    outline: 'none',
    transition,
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
    whiteSpace: 'nowrap',
  };

  const tdStyle = {
    padding: '12px 14px',
    borderBottom: `1px solid ${colors.border}`,
    ...text.body,
    fontSize: 13,
    color: colors.textPrimary,
    whiteSpace: 'nowrap',
  };

  return (
    <>
      <PageHeader
        crumbs={[
          { label: 'Applications', to: '/' },
          { label: 'BID', to: '/bid' },
          { label: 'Bid Submission' },
        ]}
        title={viewMode === 'list' ? 'BID Submission' : 'Bid Submission'}
        subtitle={
          viewMode === 'list'
            ? 'Manage vendor RFQs, respond to quotation requests, and track submission progress.'
            : `Event #${selectedEventId} — ${submissionData.rfqSubject}`
        }
        actions={
          viewMode === 'list' ? (
            <Button variant="secondary" icon={<Download size={16} />} onClick={handleExportEvents}>
              Download
            </Button>
          ) : (
            <Button
              variant="secondary"
              icon={<ArrowLeft size={16} />}
              onClick={() => setViewMode('list')}
            >
              Back to List
            </Button>
          )
        }
      />

      {/* ========================================================================= */}
      {/* VIEW 1: BID SUBMISSION DASHBOARD / LIST VIEW                              */}
      {/* ========================================================================= */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, ...rise(0) }}>
          {/* QuickStats Cards - unified with PR & PO modules */}
          <QuickStats
            items={quickStatsItems}
            active={quickFilter}
            onChange={(key) => setQuickFilter(key)}
          />

          {/* Filters Card */}
          <Card>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile
                  ? '1fr'
                  : isTablet
                  ? 'repeat(2, 1fr)'
                  : 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: 14,
                alignItems: 'flex-end',
              }}
            >
              <div>
                <label style={{ ...text.label, marginBottom: 6, display: 'block' }}>Event ID</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search Event ID..."
                    value={filterEventId}
                    onChange={(e) => setFilterEventId(e.target.value)}
                    style={inputStyle}
                  />
                  <Search size={15} style={{ position: 'absolute', right: 12, top: 12, color: colors.textDisabled, pointerEvents: 'none' }} />
                </div>
              </div>

              <div>
                <label style={{ ...text.label, marginBottom: 6, display: 'block' }}>RFQ Number</label>
                <input
                  type="text"
                  placeholder="e.g. 0000010039_R01"
                  value={filterRfqNumber}
                  onChange={(e) => setFilterRfqNumber(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ ...text.label, marginBottom: 6, display: 'block' }}>RFQ Start Date</label>
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ ...text.label, marginBottom: 6, display: 'block' }}>RFQ End Date</label>
                <input
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ ...text.label, marginBottom: 6, display: 'block' }}>Buyer</label>
                <input
                  type="text"
                  placeholder="Search Buyer..."
                  value={filterBuyer}
                  onChange={(e) => setFilterBuyer(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ ...text.label, marginBottom: 6, display: 'block' }}>Bid Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={inputStyle}
                >
                  <option value="All">All Statuses</option>
                  <option value="Open">Open</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, paddingBottom: 1 }}>
                <Button variant="primary" icon={<Search size={15} />}>
                  Go
                </Button>
                <Button variant="secondary" icon={<RotateCcw size={15} />} onClick={handleClearFilters}>
                  Clear
                </Button>
              </div>
            </div>
          </Card>

          {/* Table Card */}
          <Card flush style={rise(80)}>
            <div className="jsw-scroll-x">
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 960 }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Event No</th>
                    <th style={thStyle}>RFQ Id</th>
                    <th style={thStyle}>Quotation Id</th>
                    <th style={thStyle}>RFQ Start DateTime</th>
                    <th style={thStyle}>RFQ End DateTime</th>
                    <th style={thStyle}>Buyer</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Bid Period Ext.</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((row, idx) => (
                    <tr
                      key={row.quotationId}
                      style={{ animation: `jsw-rise 350ms ease both`, animationDelay: `${idx * 40}ms` }}
                    >
                      <td style={{ ...tdStyle, fontWeight: 600, color: colors.navy }}>{row.eventNo}</td>
                      <td style={{ ...tdStyle, color: colors.steel, fontWeight: 500 }}>{row.rfqId}</td>
                      <td style={tdStyle}>
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(row.eventNo)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: colors.steel,
                            cursor: 'pointer',
                            fontWeight: 600,
                            textDecoration: 'underline',
                            padding: 0,
                            ...text.body,
                            fontSize: 13,
                          }}
                        >
                          {row.quotationId}
                        </button>
                      </td>
                      <td style={tdStyle}>{row.rfqStartDateTime}</td>
                      <td style={tdStyle}>{row.rfqEndDateTime}</td>
                      <td style={tdStyle}>{row.buyer}</td>
                      <td style={tdStyle}>
                        <StatusBadge status={row.status === 'Open' ? 'progress' : 'success'}>
                          {row.status}
                        </StatusBadge>
                      </td>
                      <td style={tdStyle}>{row.bidPeriodExtension || '—'}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <Button
                          size="sm"
                          variant={row.status === 'Open' ? 'accent' : 'secondary'}
                          onClick={() => handleOpenDetail(row.eventNo)}
                        >
                          {row.status === 'Open' ? 'Submit Quote' : 'View'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: BID QUOTATION SUBMISSION DETAIL VIEW                              */}
      {/* ========================================================================= */}
      {viewMode === 'detail' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, ...rise(0) }}>
          {/* Top Banner with Countdown & Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: isMobile ? 'flex-start' : 'center',
              justifyContent: 'space-between',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 16,
              background: `linear-gradient(135deg, ${colors.bgCard} 0%, #FFF8F6 100%)`,
              padding: isMobile ? '16px 18px' : '16px 24px',
              borderRadius: radius.lg,
              border: `1px solid ${colors.border}`,
              boxShadow: '0 2px 8px rgba(196, 71, 71, 0.06)',
            }}
          >
            {/* Countdown Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: '#FAECEC',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Clock size={20} color="#C44747" />
              </div>
              <div>
                <span style={{ ...text.caption, color: colors.textSecondary }}>Remaining Time</span>
                <p style={{ ...text.cardTitle, color: '#C44747', margin: '2px 0 0', fontSize: isMobile ? 14 : 16 }}>
                  {submissionData.remainingTime}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <Button
                variant="accent"
                size={isMobile ? 'sm' : 'md'}
                icon={<CheckCircle size={16} />}
                onClick={() => setSubmitSuccessModal(true)}
                style={{ background: '#23845B', borderColor: '#23845B' }}
              >
                Submit Quotation
              </Button>
              <Button
                variant="secondary"
                size={isMobile ? 'sm' : 'md'}
                icon={<XCircle size={16} />}
                onClick={() => setDeclineModalOpen(true)}
                style={{ color: '#C44747', borderColor: '#FECACA' }}
              >
                Decline RFQ
              </Button>
            </div>
          </div>

          {/* Stepper Tabs & Main Content Card */}
          <Card flush style={rise(60)}>
            <CircularStepTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

            <div style={{ padding: isMobile ? 16 : 24, animation: 'jsw-fade-in 300ms ease' }}>
              {/* TAB 1: ITEMS */}
              {activeTab === 'items' && (
                <div>
                  {/* Executive Metric Cards for Quotation Values */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                      gap: 14,
                      marginBottom: 20,
                    }}
                  >
                    <div style={{ background: colors.steel50, padding: '14px 18px', borderRadius: radius.md, border: `1px solid ${colors.border}` }}>
                      <span style={{ ...text.caption, color: colors.textSecondary }}>Basic Order Value</span>
                      <p style={{ ...text.cardTitle, color: colors.navy, margin: '4px 0 0' }}>{formatINR(quoteSummary.basic, 2)}</p>
                    </div>
                    <div style={{ background: colors.steel50, padding: '14px 18px', borderRadius: radius.md, border: `1px solid ${colors.border}` }}>
                      <span style={{ ...text.caption, color: colors.textSecondary }}>Calculated Tax Amount</span>
                      <p style={{ ...text.cardTitle, color: colors.steel, margin: '4px 0 0' }}>{formatINR(quoteSummary.tax, 2)}</p>
                    </div>
                    <div style={{ background: '#E9F4EE', padding: '14px 18px', borderRadius: radius.md, border: '1px solid #C4E3D2' }}>
                      <span style={{ ...text.caption, color: '#23845B', fontWeight: 600 }}>Total Quotation with Tax</span>
                      <p style={{ ...text.cardTitle, color: '#23845B', fontWeight: 700, margin: '4px 0 0' }}>{formatINR(quoteSummary.total, 2)}</p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: isMobile ? 'flex-start' : 'center',
                      justifyContent: 'space-between',
                      flexDirection: isMobile ? 'column' : 'row',
                      gap: 12,
                      marginBottom: 16,
                    }}
                  >
                    <Button
                      size="sm"
                      variant="primary"
                      icon={<Plus size={14} />}
                      onClick={() => setCostModalOpen(true)}
                    >
                      Add Cost
                    </Button>
                    <span style={{ ...text.caption, color: colors.textSecondary }}>
                      Select a row and click "Add Cost" to configure taxes, freight and pricing.
                    </span>
                  </div>

                  <div
                    className="jsw-scroll-x"
                    style={{
                      border: `1px solid ${colors.border}`,
                      borderRadius: radius.md,
                      overflow: 'hidden',
                    }}
                  >
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1400 }}>
                      <thead>
                        <tr>
                          <th style={{ ...thStyle, width: 40 }}>
                            <input type="checkbox" checked readOnly style={{ cursor: 'pointer', accentColor: colors.steel }} />
                          </th>
                          <th style={thStyle}>RFQ Number</th>
                          <th style={thStyle}>RFQ Type</th>
                          <th style={thStyle}>RFQ Line</th>
                          <th style={thStyle}>PR Number</th>
                          <th style={thStyle}>PR Line</th>
                          <th style={thStyle}>Description</th>
                          <th style={{ ...thStyle, textAlign: 'right' }}>RFQ Qty</th>
                          <th style={thStyle}>UoM</th>
                          <th style={thStyle}>Plant</th>
                          <th style={thStyle}>Delivery Days</th>
                          <th style={{ ...thStyle, textAlign: 'right' }}>Unit Price Total</th>
                          <th style={thStyle}>Tax Code</th>
                          <th style={{ ...thStyle, textAlign: 'right' }}>Freight</th>
                          <th style={{ ...thStyle, textAlign: 'right' }}>P & F</th>
                          <th style={{ ...thStyle, textAlign: 'right' }}>Disc. (%)</th>
                          <th style={{ ...thStyle, textAlign: 'right' }}>Total w/ Tax</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissionData.items.map((row) => (
                          <tr
                            key={row.id}
                            onClick={() => setSelectedRowId(row.id)}
                            style={{
                              background: selectedRowId === row.id ? colors.steel50 : 'transparent',
                              cursor: 'pointer',
                            }}
                          >
                            <td style={tdStyle}>
                              <input
                                type="checkbox"
                                checked={selectedRowId === row.id}
                                onChange={() => setSelectedRowId(row.id)}
                                style={{ accentColor: colors.steel }}
                              />
                            </td>
                            <td style={tdStyle}>{row.rfqNumber}</td>
                            <td style={tdStyle}>{row.rfqType}</td>
                            <td style={{ ...tdStyle, fontWeight: 600, color: colors.navy }}>{row.rfqLineItem}</td>
                            <td style={tdStyle}>{row.prNumber}</td>
                            <td style={tdStyle}>{row.prLineItem}</td>
                            <td style={{ ...tdStyle, fontWeight: 500 }}>{row.description}</td>
                            <td style={{ ...tdStyle, textAlign: 'right' }}>{row.rfqQty.toFixed(3)}</td>
                            <td style={tdStyle}>{row.uom}</td>
                            <td style={tdStyle}>{row.plantAddress}</td>
                            <td style={tdStyle}>
                              <input
                                type="text"
                                value={row.deliveryDays}
                                onChange={(e) => handleDeliveryDaysChange(row.id, e.target.value)}
                                style={{
                                  width: 56,
                                  height: 30,
                                  textAlign: 'center',
                                  border: `1px solid ${colors.border}`,
                                  borderRadius: radius.sm,
                                  ...text.caption,
                                  outline: 'none',
                                  transition,
                                }}
                              />
                            </td>
                            <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600 }}>
                              {row.unitPriceTotal.toFixed(2)}
                            </td>
                            <td style={{ ...tdStyle, fontSize: 12, color: colors.textSecondary }}>{row.taxCode}</td>
                            <td style={{ ...tdStyle, textAlign: 'right' }}>{row.freight.toFixed(2)}</td>
                            <td style={{ ...tdStyle, textAlign: 'right' }}>{row.packing.toFixed(2)}</td>
                            <td style={{ ...tdStyle, textAlign: 'right' }}>{row.discountPercent}%</td>
                            <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: colors.navy }}>
                              {row.totalWithTaxAmount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: GENERAL DETAILS */}
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
                      { label: 'RFQ Number', value: submissionData.rfqNumber },
                      { label: 'RFQ Description', value: submissionData.rfqDescription },
                      { label: 'End Date and Time', value: submissionData.endDate },
                      { label: 'RFQ Subject', value: submissionData.rfqSubject },
                      { label: 'Start Date and Time', value: submissionData.startDate },
                      { label: 'Buyer', value: submissionData.buyer },
                    ].map((field) => (
                      <div key={field.label}>
                        <span style={{ ...text.caption, color: colors.textSecondary }}>{field.label}</span>
                        <p style={{ ...text.body, fontWeight: 600, margin: '4px 0 0' }}>{field.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Commercial Terms */}
                  <CommercialTermsTable
                    terms={submissionData.commercialTerms}
                    onChangeTerms={(newTerms) =>
                      setSubmissionData((prev) => ({ ...prev, commercialTerms: newTerms }))
                    }
                  />
                </div>
              )}

              {/* TAB 3: ATTACHMENTS */}
              {activeTab === 'attachments' && (
                <div style={{ animation: 'jsw-slide-in 350ms ease' }}>
                  <AttachmentManager
                    prAttachments={submissionData.prAttachments}
                    rfqAttachments={submissionData.rfqAttachments}
                    bidAttachments={submissionData.bidAttachments}
                    onChangeBidAttachments={(newAtts) =>
                      setSubmissionData((prev) => ({ ...prev, bidAttachments: newAtts }))
                    }
                  />
                </div>
              )}

              {/* TAB 4: GCC TERMS */}
              {activeTab === 'gcc' && (
                <div style={{ animation: 'jsw-slide-in 350ms ease' }}>
                  <h4 style={{ ...text.cardTitle, color: colors.navy, marginBottom: 16 }}>GCC Details & Sign-off</h4>
                  <div
                    style={{
                      background: colors.bgSubtle,
                      padding: isMobile ? 16 : 28,
                      borderRadius: radius.md,
                      border: `1px solid ${colors.border}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 20,
                      maxWidth: 760,
                    }}
                  >
                    {/* GCC Link */}
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 6 : 16 }}>
                      <span style={{ ...text.label, minWidth: 200 }}>GCC Terms & Conditions:</span>
                      <a href="#gcc-document" style={{ color: colors.steel, fontWeight: 600, textDecoration: 'underline', ...text.body }}>
                        View Official GCC Document
                      </a>
                    </div>

                    {/* Agreement */}
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'flex-start', gap: isMobile ? 6 : 16 }}>
                      <span style={{ ...text.label, minWidth: 200 }}>Agreement:</span>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', ...text.body }}>
                        <input
                          type="checkbox"
                          checked={submissionData.gccTerms.agreed}
                          onChange={(e) => handleGccChange('agreed', e.target.checked)}
                          style={{ width: 18, height: 18, accentColor: colors.steel }}
                        />
                        <span>I have read all the GCC Terms & Conditions and agree for the same</span>
                      </label>
                    </div>

                    {/* Deviation Remarks */}
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 6 : 16 }}>
                      <span style={{ ...text.label, minWidth: 200 }}>Deviation Remarks:</span>
                      <input
                        type="text"
                        value={submissionData.gccTerms.deviationRemarks}
                        onChange={(e) => handleGccChange('deviationRemarks', e.target.value)}
                        style={{ ...inputStyle, flex: 1, maxWidth: isMobile ? '100%' : 400 }}
                      />
                    </div>

                    {/* Name */}
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 6 : 16 }}>
                      <span style={{ ...text.label, minWidth: 200 }}>Authorized Signatory:</span>
                      <input
                        type="text"
                        value={submissionData.gccTerms.name}
                        onChange={(e) => handleGccChange('name', e.target.value)}
                        style={{ ...inputStyle, flex: 1, maxWidth: isMobile ? '100%' : 400 }}
                      />
                    </div>

                    {/* Designation */}
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 6 : 16 }}>
                      <span style={{ ...text.label, minWidth: 200 }}>Designation:</span>
                      <input
                        type="text"
                        value={submissionData.gccTerms.designation}
                        onChange={(e) => handleGccChange('designation', e.target.value)}
                        style={{ ...inputStyle, flex: 1, maxWidth: isMobile ? '100%' : 400 }}
                      />
                    </div>

                    {/* Date */}
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 6 : 16 }}>
                      <span style={{ ...text.label, minWidth: 200 }}>Submission Date:</span>
                      <input
                        type="date"
                        value={submissionData.gccTerms.date}
                        onChange={(e) => handleGccChange('date', e.target.value)}
                        style={{ ...inputStyle, width: 200, flex: 'none' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD COST POPUP                                                     */}
      {/* ========================================================================= */}
      <AddCostModal
        isOpen={costModalOpen}
        item={submissionData.items.find((it) => it.id === selectedRowId) || submissionData.items[0]}
        onClose={() => setCostModalOpen(false)}
        onSave={handleSaveCost}
      />

      {/* ========================================================================= */}
      {/* MODAL: SUBMIT SUCCESS                                                     */}
      {/* ========================================================================= */}
      {submitSuccessModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(18, 48, 74, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20,
            animation: 'jsw-fade-in 200ms ease',
          }}
        >
          <div
            style={{
              background: colors.bgCard,
              borderRadius: radius.lg,
              padding: isMobile ? 24 : 36,
              maxWidth: 440,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 16px 48px rgba(18, 48, 74, 0.2)',
              animation: 'jsw-rise 400ms ease',
            }}
          >
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#E9F4EE', color: '#23845B', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Check size={28} />
            </div>
            <h3 style={{ ...text.cardTitle, color: colors.navy, marginBottom: 8 }}>Success!</h3>
            <p style={{ ...text.body, color: colors.textSecondary, marginBottom: 24 }}>
              Quotation submitted successfully! Event ID <strong>{selectedEventId}</strong> has been generated and logged.
            </p>
            <Button
              variant="primary"
              block
              onClick={() => {
                setSubmitSuccessModal(false);
                setViewMode('list');
                toast({ title: 'Quotation submitted', description: `Quotation for Event #${selectedEventId} is recorded.` });
              }}
            >
              OK
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DECLINE RFQ CONFIRMATION                                           */}
      {/* ========================================================================= */}
      {declineModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(18, 48, 74, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20,
            animation: 'jsw-fade-in 200ms ease',
          }}
        >
          <div
            style={{
              background: colors.bgCard,
              borderRadius: radius.lg,
              padding: isMobile ? 24 : 36,
              maxWidth: 440,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 16px 48px rgba(18, 48, 74, 0.2)',
              animation: 'jsw-rise 400ms ease',
            }}
          >
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#FAECEC', color: '#C44747', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <XCircle size={28} />
            </div>
            <h3 style={{ ...text.cardTitle, color: colors.navy, marginBottom: 8 }}>Decline RFQ?</h3>
            <p style={{ ...text.body, color: colors.textSecondary, marginBottom: 24 }}>
              Are you sure you want to decline this RFQ? This action will notify the buyer and withdraw your participation.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button variant="secondary" block onClick={() => setDeclineModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                block
                style={{ background: '#C44747', borderColor: '#C44747' }}
                onClick={() => {
                  setDeclineModalOpen(false);
                  setViewMode('list');
                  toast({ title: 'RFQ Declined', description: `Declined participation for Event #${selectedEventId}.` });
                }}
              >
                Yes, Decline
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
