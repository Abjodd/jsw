import { Columns3 } from 'lucide-react';
import { Card, EmptyState, PageHeader } from '@/components/ui';

/**
 * RFQ › Quote Comparison
 * Route: /rfq/comparison
 * File:  src/modules/rfq/pages/RFQComparison.jsx
 *
 * TEAM: replace the placeholder below with the real screen.
 * - Use components from '@/components/ui' (Button, Card, KpiCard, StatusBadge, FormField…)
 * - Put screen-specific sub-components in ../components/
 * - API calls go in ../services/rfqApi.js
 * - Style INLINE only (style={{}}), using values from '@/theme/theme' — no CSS files,
 *   no hard-coded colours or fonts. Use useHover / useMediaQuery from '@/hooks' for hover & responsive.
 */
export default function RFQComparison() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'RFQ', to: '/rfq' }, { label: 'Quote Comparison' }]}
        title="Quote Comparison"
        subtitle="Compare quotes line by line (L1 / L2 / L3)."
      />
      <Card>
        <EmptyState
          icon={Columns3}
          title="Quote Comparison — ready for development"
          description="Paste the code for this screen into the file below."
          filePath="src/modules/rfq/pages/RFQComparison.jsx"
        />
      </Card>
    </>
  );
}
