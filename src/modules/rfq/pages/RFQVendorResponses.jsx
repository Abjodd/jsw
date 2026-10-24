import { Inbox } from 'lucide-react';
import { Card, EmptyState, PageHeader } from '@/components/ui';

/**
 * RFQ › Vendor Responses
 * Route: /rfq/responses
 * File:  src/modules/rfq/pages/RFQVendorResponses.jsx
 *
 * TEAM: replace the placeholder below with the real screen.
 * - Use components from '@/components/ui' (Button, Card, KpiCard, StatusBadge, FormField…)
 * - Put screen-specific sub-components in ../components/
 * - API calls go in ../services/rfqApi.js
 * - Style INLINE only (style={{}}), using values from '@/theme/theme' — no CSS files,
 *   no hard-coded colours or fonts. Use useHover / useMediaQuery from '@/hooks' for hover & responsive.
 */
export default function RFQVendorResponses() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'RFQ', to: '/rfq' }, { label: 'Vendor Responses' }]}
        title="Vendor Responses"
        subtitle="Quotes and clarifications received from vendors."
      />
      <Card>
        <EmptyState
          icon={Inbox}
          title="Vendor Responses — ready for development"
          description="Paste the code for this screen into the file below."
          filePath="src/modules/rfq/pages/RFQVendorResponses.jsx"
        />
      </Card>
    </>
  );
}
