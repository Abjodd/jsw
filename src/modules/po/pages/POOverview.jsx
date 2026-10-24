import { Download, Plus, ShoppingCart, FilePen, AlertTriangle, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, DataTable, EmptyState, KpiCard, PageHeader, StatusBadge } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors } from '@/theme/theme';
import { RECENT_ITEMS } from '../data/mockData';

/**
 * PO OVERVIEW — the module's landing dashboard.
 * File: src/modules/po/pages/POOverview.jsx
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

export default function POOverview() {
  const isMobile = useMediaQuery(bp.mobile);
  const isLaptop = useMediaQuery(bp.laptop);

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'PO' }]}
        title="Purchase Orders"
        subtitle="Overview of purchase orders, approvals and performance across plants."
        actions={
          <>
            <Button variant="secondary" icon={<Download size={16} />}>Export</Button>
            <Link to="/po/create"><Button icon={<Plus size={16} />}>New purchase order</Button></Link>
          </>
        }
      />

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 1 : isLaptop ? 2 : 4}, 1fr)`, gap: 16, marginBottom: 20 }}>
        <KpiCard label="POs released (MTD)" value="214" icon={ShoppingCart} delta={12.6} caption="vs last month" />
        <KpiCard label="In amendment" value="11" icon={FilePen} delta={0} caption="vs last month" />
        <KpiCard label="Delivery overdue" value="8" icon={AlertTriangle} delta={-4} invertDelta caption="vs last month" />
        <KpiCard label="Committed value" value="₹86.4 Cr" icon={IndianRupee} delta={6.8} caption="vs last month" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: isLaptop ? '1fr' : '2fr 1fr', gap: 20 }}>
        <Card title="Trend" subtitle="Last 6 months">
          <EmptyState
            title="Chart placeholder"
            description="Drop the trend chart component here (use chartSeries from @/theme/theme for colours)."
            filePath="src/modules/po/components/"
          />
        </Card>
        <Card title="Status breakdown">
          <EmptyState title="Chart placeholder" description="Donut / bar of items by status." />
        </Card>
      </div>

      <Card title="Recent purchase orders" flush style={{ marginTop: 20 }}>
        <DataTable columns={columns} rows={RECENT_ITEMS} />
      </Card>
    </>
  );
}
