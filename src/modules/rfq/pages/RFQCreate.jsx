import { FilePlus2 } from 'lucide-react';
import { Card, EmptyState, PageHeader } from '@/components/ui';

/**
 * RFQ › Create RFQ
 * Route: /rfq/create
 * File:  src/modules/rfq/pages/RFQCreate.jsx
 *
 * TEAM: replace the placeholder below with the real screen.
 * - Use components from '@/components/ui' (Button, Card, KpiCard, StatusBadge, FormField…)
 * - Put screen-specific sub-components in ../components/
 * - API calls go in ../services/rfqApi.js
 * - Style INLINE only (style={{}}), using values from '@/theme/theme' — no CSS files,
 *   no hard-coded colours or fonts. Use useHover / useMediaQuery from '@/hooks' for hover & responsive.
 */
export default function RFQCreate() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'RFQ', to: '/rfq' }, { label: 'Create RFQ' }]}
        title="Create RFQ"
        subtitle="Float a new RFQ to selected vendors."
      />
      <Card>
        <EmptyState
          icon={FilePlus2}
          title="Create RFQ — ready for development"
          description="Paste the code for this screen into the file below."
          filePath="src/modules/rfq/pages/RFQCreate.jsx"
        />
      </Card>
    </>
  );
}
