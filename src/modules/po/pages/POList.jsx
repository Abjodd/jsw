import { ListChecks } from 'lucide-react';
import { Card, EmptyState, PageHeader } from '@/components/ui';

/**
 * PO › All Purchase Orders
 * Route: /po/list
 * File:  src/modules/po/pages/POList.jsx
 *
 * TEAM: replace the placeholder below with the real screen.
 * - Use components from '@/components/ui' (Button, Card, KpiCard, StatusBadge, FormField…)
 * - Put screen-specific sub-components in ../components/
 * - API calls go in ../services/poApi.js
 * - Style INLINE only (style={{}}), using values from '@/theme/theme' — no CSS files,
 *   no hard-coded colours or fonts. Use useHover / useMediaQuery from '@/hooks' for hover & responsive.
 */
export default function POList() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'PO', to: '/po' }, { label: 'All Purchase Orders' }]}
        title="All Purchase Orders"
        subtitle="Every purchase order with release and delivery status."
      />
      <Card>
        <EmptyState
          icon={ListChecks}
          title="All Purchase Orders — ready for development"
          description="Paste the code for this screen into the file below."
          filePath="src/modules/po/pages/POList.jsx"
        />
      </Card>
    </>
  );
}
