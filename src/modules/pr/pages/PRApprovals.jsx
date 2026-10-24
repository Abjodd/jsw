import { BadgeCheck } from 'lucide-react';
import { Card, EmptyState, PageHeader } from '@/components/ui';

/**
 * PR › Approvals
 * Route: /pr/approvals
 * File:  src/modules/pr/pages/PRApprovals.jsx
 *
 * TEAM: replace the placeholder below with the real screen.
 * - Use components from '@/components/ui' (Button, Card, KpiCard, StatusBadge, FormField…)
 * - Put screen-specific sub-components in ../components/
 * - API calls go in ../services/prApi.js
 * - Style INLINE only (style={{}}), using values from '@/theme/theme' — no CSS files,
 *   no hard-coded colours or fonts. Use useHover / useMediaQuery from '@/hooks' for hover & responsive.
 */
export default function PRApprovals() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'PR', to: '/pr' }, { label: 'Approvals' }]}
        title="Approvals"
        subtitle="Requisitions waiting for your approval."
      />
      <Card>
        <EmptyState
          icon={BadgeCheck}
          title="Approvals — ready for development"
          description="Paste the code for this screen into the file below."
          filePath="src/modules/pr/pages/PRApprovals.jsx"
        />
      </Card>
    </>
  );
}
