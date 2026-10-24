import { FilePlus2 } from 'lucide-react';
import { Card, EmptyState, PageHeader } from '@/components/ui';

/**
 * GNFA › Create GNFA
 * Route: /gnfa/create
 * File:  src/modules/gnfa/pages/GNFACreate.jsx
 *
 * TEAM: replace the placeholder below with the real screen.
 * - Use components from '@/components/ui' (Button, Card, KpiCard, StatusBadge, FormField…)
 * - Put screen-specific sub-components in ../components/
 * - API calls go in ../services/gnfaApi.js
 * - Style INLINE only (style={{}}), using values from '@/theme/theme' — no CSS files,
 *   no hard-coded colours or fonts. Use useHover / useMediaQuery from '@/hooks' for hover & responsive.
 */
export default function GNFACreate() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'GNFA', to: '/gnfa' }, { label: 'Create GNFA' }]}
        title="Create GNFA"
        subtitle="Raise a new GNFA request with justification."
      />
      <Card>
        <EmptyState
          icon={FilePlus2}
          title="Create GNFA — ready for development"
          description="Paste the code for this screen into the file below."
          filePath="src/modules/gnfa/pages/GNFACreate.jsx"
        />
      </Card>
    </>
  );
}
