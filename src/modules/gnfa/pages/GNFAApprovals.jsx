import { BadgeCheck } from 'lucide-react';
import { Card, EmptyState, PageHeader } from '@/components/ui';

/**
 * GNFA › Approvals
 * Route: /gnfa/approvals
 * File:  src/modules/gnfa/pages/GNFAApprovals.jsx
 *
 * TEAM: replace the placeholder below with the real screen.
 * - Use components from '@/components/ui' (Button, Card, KpiCard, StatusBadge, FormField…)
 * - Put screen-specific sub-components in ../components/
 * - API calls go in ../services/gnfaApi.js
 * - Style INLINE only (style={{}}), using values from '@/theme/theme' — no CSS files,
 *   no hard-coded colours or fonts. Use useHover / useMediaQuery from '@/hooks' for hover & responsive.
 */
export default function GNFAApprovals() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'GNFA', to: '/gnfa' }, { label: 'Approvals' }]}
        title="Approvals"
        subtitle="GNFA requests waiting for your decision."
      />
      <Card>
        <EmptyState
          icon={BadgeCheck}
          title="Approvals — ready for development"
          description="Paste the code for this screen into the file below."
          filePath="src/modules/gnfa/pages/GNFAApprovals.jsx"
        />
      </Card>
    </>
  );
}
