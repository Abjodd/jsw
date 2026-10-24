import { ListChecks } from 'lucide-react';
import { Card, EmptyState, PageHeader } from '@/components/ui';

/**
 * PR › All Requisitions
 * Route: /pr/list
 * File:  src/modules/pr/pages/PRList.jsx
 *
 * TEAM: replace the placeholder below with the real screen.
 * - Use components from '@/components/ui' (Button, Card, KpiCard, StatusBadge, FormField…)
 * - Put screen-specific sub-components in ../components/
 * - API calls go in ../services/prApi.js
 * - Style INLINE only (style={{}}), using values from '@/theme/theme' — no CSS files,
 *   no hard-coded colours or fonts. Use useHover / useMediaQuery from '@/hooks' for hover & responsive.
 */
export default function PRList() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'PR', to: '/pr' }, { label: 'All Requisitions' }]}
        title="All Requisitions"
        subtitle="Search, filter and track every purchase requisition."
      />
      <Card>
        <EmptyState
          icon={ListChecks}
          title="All Requisitions — ready for development"
          description="Paste the code for this screen into the file below."
          filePath="src/modules/pr/pages/PRList.jsx"
        />
      </Card>
    </>
  );
}
