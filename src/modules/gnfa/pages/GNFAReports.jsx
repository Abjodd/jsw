import { BarChart3 } from 'lucide-react';
import { Card, EmptyState, PageHeader } from '@/components/ui';

/**
 * GNFA › Reports
 * Route: /gnfa/reports
 * File:  src/modules/gnfa/pages/GNFAReports.jsx
 *
 * TEAM: replace the placeholder below with the real screen.
 * - Use components from '@/components/ui' (Button, Card, KpiCard, StatusBadge, FormField…)
 * - Put screen-specific sub-components in ../components/
 * - API calls go in ../services/gnfaApi.js
 * - Style INLINE only (style={{}}), using values from '@/theme/theme' — no CSS files,
 *   no hard-coded colours or fonts. Use useHover / useMediaQuery from '@/hooks' for hover & responsive.
 */
export default function GNFAReports() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'GNFA', to: '/gnfa' }, { label: 'Reports' }]}
        title="Reports"
        subtitle="Compliance and turnaround reporting."
      />
      <Card>
        <EmptyState
          icon={BarChart3}
          title="Reports — ready for development"
          description="Paste the code for this screen into the file below."
          filePath="src/modules/gnfa/pages/GNFAReports.jsx"
        />
      </Card>
    </>
  );
}
