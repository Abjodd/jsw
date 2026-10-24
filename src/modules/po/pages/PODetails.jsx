import { FileSearch } from 'lucide-react';
import { Card, EmptyState, PageHeader } from '@/components/ui';

/**
 * PO › PO Details
 * Route: /po/details
 * File:  src/modules/po/pages/PODetails.jsx
 *
 * TEAM: replace the placeholder below with the real screen.
 * - Use components from '@/components/ui' (Button, Card, KpiCard, StatusBadge, FormField…)
 * - Put screen-specific sub-components in ../components/
 * - API calls go in ../services/poApi.js
 * - Style INLINE only (style={{}}), using values from '@/theme/theme' — no CSS files,
 *   no hard-coded colours or fonts. Use useHover / useMediaQuery from '@/hooks' for hover & responsive.
 */
export default function PODetails() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'PO', to: '/po' }, { label: 'PO Details' }]}
        title="PO Details"
        subtitle="Line items, terms, deliveries and invoices for a PO."
      />
      <Card>
        <EmptyState
          icon={FileSearch}
          title="PO Details — ready for development"
          description="Paste the code for this screen into the file below."
          filePath="src/modules/po/pages/PODetails.jsx"
        />
      </Card>
    </>
  );
}
