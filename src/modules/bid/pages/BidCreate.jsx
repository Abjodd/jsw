import { FilePlus2 } from 'lucide-react';
import { Card, EmptyState, PageHeader } from '@/components/ui';

/**
 * BID › Create Bid
 * Route: /bid/create
 * File:  src/modules/bid/pages/BidCreate.jsx
 *
 * TEAM: replace the placeholder below with the real screen.
 * - Use components from '@/components/ui' (Button, Card, KpiCard, StatusBadge, FormField…)
 * - Put screen-specific sub-components in ../components/
 * - API calls go in ../services/bidApi.js
 * - Style INLINE only (style={{}}), using values from '@/theme/theme' — no CSS files,
 *   no hard-coded colours or fonts. Use useHover / useMediaQuery from '@/hooks' for hover & responsive.
 */
export default function BidCreate() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'BID', to: '/bid' }, { label: 'Create Bid' }]}
        title="Create Bid"
        subtitle="Set up a new bid event, invite vendors and define terms."
      />
      <Card>
        <EmptyState
          icon={FilePlus2}
          title="Create Bid — ready for development"
          description="Paste the code for this screen into the file below."
          filePath="src/modules/bid/pages/BidCreate.jsx"
        />
      </Card>
    </>
  );
}
