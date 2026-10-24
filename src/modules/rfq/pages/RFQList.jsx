import { ListChecks } from 'lucide-react';
import { Card, EmptyState, PageHeader } from '@/components/ui';

/**
 * RFQ › All RFQs
 * Route: /rfq/list
 * File:  src/modules/rfq/pages/RFQList.jsx
 *
 * TEAM: replace the placeholder below with the real screen.
 * - Use components from '@/components/ui' (Button, Card, KpiCard, StatusBadge, FormField…)
 * - Put screen-specific sub-components in ../components/
 * - API calls go in ../services/rfqApi.js
 * - Style INLINE only (style={{}}), using values from '@/theme/theme' — no CSS files,
 *   no hard-coded colours or fonts. Use useHover / useMediaQuery from '@/hooks' for hover & responsive.
 */
export default function RFQList() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'RFQ', to: '/rfq' }, { label: 'All RFQs' }]}
        title="All RFQs"
        subtitle="Every RFQ floated, with status and closing dates."
      />
      <Card>
        <EmptyState
          icon={ListChecks}
          title="All RFQs — ready for development"
          description="Paste the code for this screen into the file below."
          filePath="src/modules/rfq/pages/RFQList.jsx"
        />
      </Card>
    </>
  );
}
