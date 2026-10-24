import { Download, Plus, FileText, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, DataTable, EmptyState, KpiCard, PageHeader, StatusBadge } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors } from '@/theme/theme';
import { RECENT_ITEMS } from '../data/mockData';

/**
 * PR OVERVIEW — the module's landing dashboard.
 * File: src/modules/pr/pages/PROverview.jsx
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

export default function PROverview() {
  const isMobile = useMediaQuery(bp.mobile);
  const isLaptop = useMediaQuery(bp.laptop);

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'PR' }]}
        title="Purchase Requisition"
        subtitle="Overview of requisitions, approvals and performance across plants."
        actions={
          <>
            <Button variant="secondary" icon={<Download size={16} />}>Export</Button>
            <Link to="/pr/create"><Button icon={<Plus size={16} />}>New requisition</Button></Link>
          </>
        }
      />

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 1 : isLaptop ? 2 : 4}, 1fr)`, gap: 16, marginBottom: 20 }}>
        <KpiCard label="Open PRs" value="128" icon={FileText} delta={4.2} caption="vs last month" />
        <KpiCard label="Awaiting approval" value="34" icon={Clock} delta={-3.1} invertDelta caption="vs last month" />
        <KpiCard label="Converted to PO (MTD)" value="96" icon={CheckCircle2} delta={8.4} caption="vs last month" />
        <KpiCard label="Overdue" value="6" icon={AlertTriangle} delta={-12.5} invertDelta caption="vs last month" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: isLaptop ? '1fr' : '2fr 1fr', gap: 20 }}>
        <Card title="Trend" subtitle="Last 6 months">
          <EmptyState
            title="Chart placeholder"
            description="Drop the trend chart component here (use chartSeries from @/theme/theme for colours)."
            filePath="src/modules/pr/components/"
          />
        </Card>
        <Card title="Status breakdown">
          <EmptyState title="Chart placeholder" description="Donut / bar of items by status." />
        </Card>
      </div>

      <Card title="Recent requisitions" flush style={{ marginTop: 20 }}>
        <DataTable columns={columns} rows={RECENT_ITEMS} />
      </Card>
    </>
  );
}
