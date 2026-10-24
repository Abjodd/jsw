import { useMemo } from 'react';
import { Download, Plus, Gavel, Clock, Trophy, TrendingUp, Send, Columns3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, DataTable, KpiCard, PageHeader, StatusBadge } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors, radius, rise, text, chartSeries } from '@/theme/theme';
import { BID_SUBMISSION_EVENTS } from '../data/mockData';

/* ────── Inline SVG Mini-Charts (no extra libs) ────── */

/** Inline SVG bar chart showing monthly trend */
function TrendBarChart() {
  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const submitted = [8, 12, 10, 15, 11, 14];
  const compared = [5, 9, 7, 12, 8, 10];
  const maxVal = Math.max(...submitted, ...compared);

  const barW = 22;
  const gap = 36;
  const chartW = months.length * (barW * 2 + gap);
  const chartH = 160;
  const padTop = 10;
  const padBot = 28;
  const usableH = chartH - padTop - padBot;

  return (
    <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <svg
        viewBox={`0 0 ${chartW + 20} ${chartH + 8}`}
        width="100%"
        style={{ minWidth: 360, display: 'block' }}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const y = padTop + usableH * (1 - f);
          return (
            <g key={f}>
              <line x1="0" y1={y} x2={chartW + 20} y2={y} stroke={colors.border} strokeDasharray="3,3" />
              <text x={chartW + 14} y={y + 4} fill={colors.textDisabled} fontSize="9" textAnchor="end">
                {Math.round(maxVal * f)}
              </text>
            </g>
          );
        })}

        {months.map((m, i) => {
          const x = 14 + i * (barW * 2 + gap);
          const h1 = (submitted[i] / maxVal) * usableH;
          const h2 = (compared[i] / maxVal) * usableH;
          const y1 = padTop + usableH - h1;
          const y2 = padTop + usableH - h2;

          return (
            <g key={m}>
              <rect x={x} y={y1} width={barW} height={h1} rx="4" fill={chartSeries[0]} opacity="0.85">
                <animate attributeName="height" from="0" to={h1} dur="0.6s" fill="freeze" />
                <animate attributeName="y" from={padTop + usableH} to={y1} dur="0.6s" fill="freeze" />
              </rect>
              <rect x={x + barW + 4} y={y2} width={barW} height={h2} rx="4" fill={chartSeries[1]} opacity="0.85">
                <animate attributeName="height" from="0" to={h2} dur="0.6s" fill="freeze" />
                <animate attributeName="y" from={padTop + usableH} to={y2} dur="0.6s" fill="freeze" />
              </rect>
              <text
                x={x + barW + 2}
                y={chartH - 4}
                fill={colors.textSecondary}
                fontSize="11"
                fontWeight="500"
                textAnchor="middle"
              >
                {m}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginTop: 8, justifyContent: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, ...text.caption }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: chartSeries[0] }} />
          Bids Submitted
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, ...text.caption }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: chartSeries[1] }} />
          Comparisons Done
        </span>
      </div>
    </div>
  );
}

/** Inline SVG donut chart showing status breakdown */
function StatusDonutChart() {
  const segments = [
    { label: 'Open', value: 4, color: '#3478B8' },
    { label: 'Quoted', value: 8, color: '#23845B' },
    { label: 'Closed', value: 3, color: '#778493' },
    { label: 'Awarded', value: 5, color: '#12304A' },
  ];
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  // Compute arcs
  const size = 140;
  const cx = size / 2;
  const cy = size / 2;
  const r = 52;
  const strokeW = 22;

  let cumAngle = -90;
  const arcs = segments.map((seg) => {
    const angle = (seg.value / total) * 360;
    const startRad = (cumAngle * Math.PI) / 180;
    const endRad = ((cumAngle + angle) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArc = angle > 180 ? 1 : 0;
    cumAngle += angle;
    return { ...seg, d: `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}` };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {arcs.map((arc) => (
          <path
            key={arc.label}
            d={arc.d}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeW}
            strokeLinecap="round"
          >
            <animate attributeName="stroke-dashoffset" from="300" to="0" dur="0.8s" fill="freeze" />
          </path>
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fill={colors.textPrimary} fontSize="22" fontWeight="700">
          {total}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill={colors.textSecondary} fontSize="11" fontWeight="500">
          Total Events
        </text>
      </svg>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
        {segments.map((seg) => (
          <span key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: 6, ...text.caption }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: seg.color }} />
            {seg.label} ({seg.value})
          </span>
        ))}
      </div>
    </div>
  );
}

/* ────── Table columns ────── */
const columns = [
  { key: 'eventNo', label: 'Event No', style: { fontWeight: 600, color: colors.navy, whiteSpace: 'nowrap' } },
  { key: 'rfqId', label: 'RFQ ID', style: { color: colors.steel, whiteSpace: 'nowrap' } },
  { key: 'buyer', label: 'Buyer' },
  { key: 'rfqStartDateTime', label: 'Start Date', style: { color: colors.textSecondary, whiteSpace: 'nowrap' } },
  { key: 'rfqEndDateTime', label: 'End Date', style: { color: colors.textSecondary, whiteSpace: 'nowrap' } },
  {
    key: 'status',
    label: 'Status',
    render: (r) => (
      <StatusBadge status={r.status === 'Open' ? 'progress' : r.status === 'Quoted' ? 'success' : 'inactive'}>
        {r.status}
      </StatusBadge>
    ),
  },
];

/* ────── Main Component ────── */
export default function BIDOverview() {
  const isMobile = useMediaQuery(bp.mobile);
  const isLaptop = useMediaQuery(bp.laptop);

  const recentEvents = useMemo(() => BID_SUBMISSION_EVENTS.slice(0, 6), []);

  const openCount = BID_SUBMISSION_EVENTS.filter((e) => e.status === 'Open').length;
  const quotedCount = BID_SUBMISSION_EVENTS.filter((e) => e.status === 'Quoted').length;

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'BID' }]}
        title="Bid Management"
        subtitle="Overview of bid submissions, comparisons and performance across plants."
        actions={
          <>
            <Button variant="secondary" icon={<Download size={16} />}>Export</Button>
            <Link to="/bid/submission"><Button icon={<Plus size={16} />}>New bid event</Button></Link>
          </>
        }
      />

      {/* KPI row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${isMobile ? 1 : isLaptop ? 2 : 4}, 1fr)`,
          gap: 16,
          marginBottom: 20,
          ...rise(0),
        }}
      >
        <KpiCard label="Total bid events" value={String(BID_SUBMISSION_EVENTS.length)} icon={Gavel} delta={9.1} caption="vs last month" />
        <KpiCard label="Open submissions" value={String(openCount)} icon={Clock} delta={2} invertDelta caption="vs last month" />
        <KpiCard label="Quoted (MTD)" value={String(quotedCount)} icon={Trophy} delta={14.3} caption="vs last month" />
        <KpiCard label="Savings achieved" value="7.8%" icon={TrendingUp} delta={1.2} caption="vs last month" />
      </div>

      {/* Quick Action Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: 16,
          marginBottom: 20,
          ...rise(60),
        }}
      >
        <Link to="/bid/submission" style={{ textDecoration: 'none' }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.graphite} 100%)`,
              borderRadius: radius.lg,
              padding: '24px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              cursor: 'pointer',
              transition: 'transform 200ms ease, box-shadow 200ms ease',
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.12)', display: 'grid', placeItems: 'center' }}>
              <Send size={22} color={colors.white} />
            </div>
            <div>
              <h4 style={{ ...text.cardTitle, color: colors.white, marginBottom: 4 }}>Bid Submission</h4>
              <p style={{ ...text.caption, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                Submit quotations, manage RFQ lines & upload attachments
              </p>
            </div>
          </div>
        </Link>

        <Link to="/bid/comparison" style={{ textDecoration: 'none' }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${colors.steel} 0%, #3A6E94 100%)`,
              borderRadius: radius.lg,
              padding: '24px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              cursor: 'pointer',
              transition: 'transform 200ms ease, box-shadow 200ms ease',
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.12)', display: 'grid', placeItems: 'center' }}>
              <Columns3 size={22} color={colors.white} />
            </div>
            <div>
              <h4 style={{ ...text.cardTitle, color: colors.white, marginBottom: 4 }}>Bid Comparison</h4>
              <p style={{ ...text.caption, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                Compare vendor offers side-by-side with L1/L2 ranking
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Charts row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isLaptop ? '1fr' : '2fr 1fr',
          gap: 20,
          ...rise(120),
        }}
      >
        <Card title="Submission Trend" subtitle="Last 6 months">
          <TrendBarChart />
        </Card>
        <Card title="Status Breakdown">
          <StatusDonutChart />
        </Card>
      </div>

      {/* Recent events table */}
      <div style={rise(180)}>
        <Card title="Recent Bid Events" flush style={{ marginTop: 20 }}>
          <DataTable columns={columns} rows={recentEvents} rowKey="quotationId" />
        </Card>
      </div>
    </>
  );
}
