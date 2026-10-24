import { ListChecks } from 'lucide-react';
import { Card, EmptyState, PageHeader } from '@/components/ui';

/**
 * BID › Bid Events
 * Route: /bid/events
 * File:  src/modules/bid/pages/BidEvents.jsx
 *
 * TEAM: replace the placeholder below with the real screen.
 * - Use components from '@/components/ui' (Button, Card, KpiCard, StatusBadge, FormField…)
 * - Put screen-specific sub-components in ../components/
 * - API calls go in ../services/bidApi.js
 * - Style INLINE only (style={{}}), using values from '@/theme/theme' — no CSS files,
 *   no hard-coded colours or fonts. Use useHover / useMediaQuery from '@/hooks' for hover & responsive.
 */
export default function BidEvents() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'BID', to: '/bid' }, { label: 'Bid Events' }]}
        title="Bid Events"
        subtitle="All open, closed and scheduled bid events."
      />
      <Card>
        <EmptyState
          icon={ListChecks}
          title="Bid Events — ready for development"
          description="Paste the code for this screen into the file below."
          filePath="src/modules/bid/pages/BidEvents.jsx"
        />
      </Card>
    </>
  );
}
