import { Download, Plus, Gavel, Clock, Trophy, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, DataTable, EmptyState, KpiCard, PageHeader, StatusBadge } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors } from '@/theme/theme';
import { RECENT_ITEMS } from '../data/mockData';

/**
 * BID OVERVIEW — the module's landing dashboard.
 * File: src/modules/bid/pages/BIDOverview.jsx
 * Replace the placeholder sections with the real charts / widgets.
 * Styling: inline only, values from '@/theme/theme'.
 */
const columns = [
  { key: 'id', label: 'Reference', style: { fontWeight: 500, color: colors.steel, whiteSpace: 'nowrap' } },
  { key: 'title', label: 'Description' },
  { key: 'plant', label: 'Plant', style: { color: colors.textSecondary, whiteSpace: 'nowrap' } },
  { key: 'updated', label: 'Updated', style: { color: colors.textSecondary, whiteSpace: 'nowrap' } },
  { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
];

export default function BIDOverview() {
  const isMobile = useMediaQuery(bp.mobile);
  const isLaptop = useMediaQuery(bp.laptop);

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'BID' }]}
        title="Bid Management"
        subtitle="Overview of bid events, approvals and performance across plants."
        actions={
          <>
            <Button variant="secondary" icon={<Download size={16} />}>Export</Button>
            <Link to="/bid/create"><Button icon={<Plus size={16} />}>New bid event</Button></Link>
          </>
        }
      />

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 1 : isLaptop ? 2 : 4}, 1fr)`, gap: 16, marginBottom: 20 }}>
        <KpiCard label="Live bid events" value="12" icon={Gavel} delta={9.1} caption="vs last month" />
        <KpiCard label="Under evaluation" value="9" icon={Clock} delta={2} invertDelta caption="vs last month" />
        <KpiCard label="Awarded (MTD)" value="21" icon={Trophy} delta={14.3} caption="vs last month" />
        <KpiCard label="Savings achieved" value="7.8%" icon={TrendingUp} delta={1.2} caption="vs last month" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: isLaptop ? '1fr' : '2fr 1fr', gap: 20 }}>
        <Card title="Trend" subtitle="Last 6 months">
          <EmptyState
            title="Chart placeholder"
            description="Drop the trend chart component here (use chartSeries from @/theme/theme for colours)."
            filePath="src/modules/bid/components/"
          />
        </Card>
        <Card title="Status breakdown">
          <EmptyState title="Chart placeholder" description="Donut / bar of items by status." />
        </Card>
      </div>

      <Card title="Recent bid events" flush style={{ marginTop: 20 }}>
        <DataTable columns={columns} rows={RECENT_ITEMS} />
      </Card>
    </>
  );
}
