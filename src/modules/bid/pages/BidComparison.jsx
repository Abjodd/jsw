import { Columns3 } from 'lucide-react';
import { Card, EmptyState, PageHeader } from '@/components/ui';

/**
 * BID › Bid Comparison
 * Route: /bid/comparison
 * File:  src/modules/bid/pages/BidComparison.jsx
 *
 * TEAM: replace the placeholder below with the real screen.
 * - Use components from '@/components/ui' (Button, Card, KpiCard, StatusBadge, FormField…)
 * - Put screen-specific sub-components in ../components/
 * - API calls go in ../services/bidApi.js
 * - Style INLINE only (style={{}}), using values from '@/theme/theme' — no CSS files,
 *   no hard-coded colours or fonts. Use useHover / useMediaQuery from '@/hooks' for hover & responsive.
 */
export default function BidComparison() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'BID', to: '/bid' }, { label: 'Bid Comparison' }]}
        title="Bid Comparison"
        subtitle="Compare vendor offers side by side."
      />
      <Card>
        <EmptyState
          icon={Columns3}
          title="Bid Comparison — ready for development"
          description="Paste the code for this screen into the file below."
          filePath="src/modules/bid/pages/BidComparison.jsx"
        />
      </Card>
    </>
  );
}
