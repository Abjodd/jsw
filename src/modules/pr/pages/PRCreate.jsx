import { FilePlus2 } from 'lucide-react';
import { Card, EmptyState, PageHeader } from '@/components/ui';

/**
 * PR › Create Requisition
 * Route: /pr/create
 * File:  src/modules/pr/pages/PRCreate.jsx
 *
 * TEAM: replace the placeholder below with the real screen.
 * - Use components from '@/components/ui' (Button, Card, KpiCard, StatusBadge, FormField…)
 * - Put screen-specific sub-components in ../components/
 * - API calls go in ../services/prApi.js
 * - Style INLINE only (style={{}}), using values from '@/theme/theme' — no CSS files,
 *   no hard-coded colours or fonts. Use useHover / useMediaQuery from '@/hooks' for hover & responsive.
 */
export default function PRCreate() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'PR', to: '/pr' }, { label: 'Create Requisition' }]}
        title="Create Requisition"
        subtitle="Raise a new material or service requisition."
      />
      <Card>
        <EmptyState
          icon={FilePlus2}
          title="Create Requisition — ready for development"
          description="Paste the code for this screen into the file below."
          filePath="src/modules/pr/pages/PRCreate.jsx"
        />
      </Card>
    </>
  );
}
