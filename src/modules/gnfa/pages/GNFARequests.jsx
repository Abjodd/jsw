import { ListChecks } from 'lucide-react';
import { Card, EmptyState, PageHeader } from '@/components/ui';

/**
 * GNFA › GNFA Requests
 * Route: /gnfa/requests
 * File:  src/modules/gnfa/pages/GNFARequests.jsx
 *
 * TEAM: replace the placeholder below with the real screen.
 * - Use components from '@/components/ui' (Button, Card, KpiCard, StatusBadge, FormField…)
 * - Put screen-specific sub-components in ../components/
 * - API calls go in ../services/gnfaApi.js
 * - Style INLINE only (style={{}}), using values from '@/theme/theme' — no CSS files,
 *   no hard-coded colours or fonts. Use useHover / useMediaQuery from '@/hooks' for hover & responsive.
 */
export default function GNFARequests() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'GNFA', to: '/gnfa' }, { label: 'GNFA Requests' }]}
        title="GNFA Requests"
        subtitle="All GNFA requests and their current stage."
      />
      <Card>
        <EmptyState
          icon={ListChecks}
          title="GNFA Requests — ready for development"
          description="Paste the code for this screen into the file below."
          filePath="src/modules/gnfa/pages/GNFARequests.jsx"
        />
      </Card>
    </>
  );
}
