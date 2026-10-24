import { FilePlus2 } from 'lucide-react';
import { Card, EmptyState, PageHeader } from '@/components/ui';

/**
 * PO › Create PO
 * Route: /po/create
 * File:  src/modules/po/pages/POCreate.jsx
 *
 * TEAM: replace the placeholder below with the real screen.
 * - Use components from '@/components/ui' (Button, Card, KpiCard, StatusBadge, FormField…)
 * - Put screen-specific sub-components in ../components/
 * - API calls go in ../services/poApi.js
 * - Style INLINE only (style={{}}), using values from '@/theme/theme' — no CSS files,
 *   no hard-coded colours or fonts. Use useHover / useMediaQuery from '@/hooks' for hover & responsive.
 */
export default function POCreate() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'PO', to: '/po' }, { label: 'Create PO' }]}
        title="Create PO"
        subtitle="Create a purchase order from an approved PR / award."
      />
      <Card>
        <EmptyState
          icon={FilePlus2}
          title="Create PO — ready for development"
          description="Paste the code for this screen into the file below."
          filePath="src/modules/po/pages/POCreate.jsx"
        />
      </Card>
    </>
  );
}
