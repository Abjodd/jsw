import { FileSearch } from 'lucide-react';
import { Card, EmptyState, PageHeader } from '@/components/ui';

/**
 * PR › Requisition Details
 * Route: /pr/details
 * File:  src/modules/pr/pages/PRDetails.jsx
 *
 * TEAM: replace the placeholder below with the real screen.
 * - Use components from '@/components/ui' (Button, Card, KpiCard, StatusBadge, FormField…)
 * - Put screen-specific sub-components in ../components/
 * - API calls go in ../services/prApi.js
 * - Style INLINE only (style={{}}), using values from '@/theme/theme' — no CSS files,
 *   no hard-coded colours or fonts. Use useHover / useMediaQuery from '@/hooks' for hover & responsive.
 */
export default function PRDetails() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'PR', to: '/pr' }, { label: 'Requisition Details' }]}
        title="Requisition Details"
        subtitle="Line items, attachments, history and approval trail."
      />
      <Card>
        <EmptyState
          icon={FileSearch}
          title="Requisition Details — ready for development"
          description="Paste the code for this screen into the file below."
          filePath="src/modules/pr/pages/PRDetails.jsx"
        />
      </Card>
    </>
  );
}
