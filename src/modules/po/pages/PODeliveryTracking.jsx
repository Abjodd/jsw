import { Truck } from 'lucide-react';
import { Card, EmptyState, PageHeader } from '@/components/ui';

/**
 * PO › Delivery Tracking
 * Route: /po/deliveries
 * File:  src/modules/po/pages/PODeliveryTracking.jsx
 *
 * TEAM: replace the placeholder below with the real screen.
 * - Use components from '@/components/ui' (Button, Card, KpiCard, StatusBadge, FormField…)
 * - Put screen-specific sub-components in ../components/
 * - API calls go in ../services/poApi.js
 * - Style INLINE only (style={{}}), using values from '@/theme/theme' — no CSS files,
 *   no hard-coded colours or fonts. Use useHover / useMediaQuery from '@/hooks' for hover & responsive.
 */
export default function PODeliveryTracking() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Applications', to: '/' }, { label: 'PO', to: '/po' }, { label: 'Delivery Tracking' }]}
        title="Delivery Tracking"
        subtitle="Track GRNs and delivery schedules against POs."
      />
      <Card>
        <EmptyState
          icon={Truck}
          title="Delivery Tracking — ready for development"
          description="Paste the code for this screen into the file below."
          filePath="src/modules/po/pages/PODeliveryTracking.jsx"
        />
      </Card>
    </>
  );
}
