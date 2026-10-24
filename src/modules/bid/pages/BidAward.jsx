import { Trophy } from 'lucide-react';
import { Card, EmptyState, PageHeader } from '@/components/ui';

/**
 * BID › Award & Closure
 * Route: /bid/award
 * File:  src/modules/bid/pages/BidAward.jsx
 *
 * TEAM: replace the placeholder below with the real screen.
 * - Use components from '@/components/ui' (Button, Card, KpiCard, StatusBadge, FormField…)
 * - Put screen-specific sub-components in ../components/
 * - API calls go in ../services/bidApi.js
 * - Style INLINE only (style={{}}), using values from '@/theme/theme' — no CSS files,
 *   no hard-coded colours or fonts. Use useHover / useMediaQuery from '@/hooks' for hover & responsive.
 */
export default function BidAward() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'BID', to: '/bid' }, { label: 'Award & Closure' }]}
        title="Award & Closure"
        subtitle="Award vendors and close the bid event."
      />
      <Card>
        <EmptyState
          icon={Trophy}
          title="Award & Closure — ready for development"
          description="Paste the code for this screen into the file below."
          filePath="src/modules/bid/pages/BidAward.jsx"
        />
      </Card>
    </>
  );
}
