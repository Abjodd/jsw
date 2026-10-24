import { Download, Plus, MessageSquareQuote, Inbox, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, DataTable, EmptyState, KpiCard, PageHeader, StatusBadge } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors } from '@/theme/theme';
import { RECENT_ITEMS } from '../data/mockData';

/**
 * RFQ OVERVIEW — the module's landing dashboard.
 * File: src/modules/rfq/pages/RFQOverview.jsx
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

export default function RFQOverview() {
  const isMobile = useMediaQuery(bp.mobile);
  const isLaptop = useMediaQuery(bp.laptop);

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'RFQ' }]}
        title="Request for Quotation"
        subtitle="Overview of RFQs, approvals and performance across plants."
        actions={
          <>
            <Button variant="secondary" icon={<Download size={16} />}>Export</Button>
            <Link to="/rfq/create"><Button icon={<Plus size={16} />}>New RFQ</Button></Link>
          </>
        }
      />

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 1 : isLaptop ? 2 : 4}, 1fr)`, gap: 16, marginBottom: 20 }}>
        <KpiCard label="Active RFQs" value="47" icon={MessageSquareQuote} delta={-2.4} caption="vs last month" />
        <KpiCard label="Quotes received" value="186" icon={Inbox} delta={11} caption="vs last month" />
        <KpiCard label="Closing today" value="5" icon={Clock} delta={0} caption="vs last month" />
        <KpiCard label="Vendor response rate" value="81%" icon={Users} delta={3.6} caption="vs last month" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: isLaptop ? '1fr' : '2fr 1fr', gap: 20 }}>
        <Card title="Trend" subtitle="Last 6 months">
          <EmptyState
            title="Chart placeholder"
            description="Drop the trend chart component here (use chartSeries from @/theme/theme for colours)."
            filePath="src/modules/rfq/components/"
          />
        </Card>
        <Card title="Status breakdown">
          <EmptyState title="Chart placeholder" description="Donut / bar of items by status." />
        </Card>
      </div>

      <Card title="Recent RFQs" flush style={{ marginTop: 20 }}>
        <DataTable columns={columns} rows={RECENT_ITEMS} />
      </Card>
    </>
  );
}
