import { ClipboardCheck } from 'lucide-react';
import { Card, EmptyState, PageHeader } from '@/components/ui';

/**
 * BID › Techno-Commercial Evaluation
 * Route: /bid/evaluation
 * File:  src/modules/bid/pages/BidEvaluation.jsx
 *
 * TEAM: replace the placeholder below with the real screen.
 * - Use components from '@/components/ui' (Button, Card, KpiCard, StatusBadge, FormField…)
 * - Put screen-specific sub-components in ../components/
 * - API calls go in ../services/bidApi.js
 * - Style INLINE only (style={{}}), using values from '@/theme/theme' — no CSS files,
 *   no hard-coded colours or fonts. Use useHover / useMediaQuery from '@/hooks' for hover & responsive.
 */
export default function BidEvaluation() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'BID', to: '/bid' }, { label: 'Techno-Commercial Evaluation' }]}
        title="Techno-Commercial Evaluation"
        subtitle="Score technical and commercial offers."
      />
      <Card>
        <EmptyState
          icon={ClipboardCheck}
          title="Techno-Commercial Evaluation — ready for development"
          description="Paste the code for this screen into the file below."
          filePath="src/modules/bid/pages/BidEvaluation.jsx"
        />
      </Card>
    </>
  );
}
