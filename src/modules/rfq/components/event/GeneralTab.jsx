import { DescriptionList } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, colors, text } from '@/theme/theme';
import { formatDateTime } from '@/utils/format';
import getEventStats from '../../data/eventStats';

const Group = ({ title, children }) => (
  <div style={{ padding: 20, border: `1px solid ${colors.border}`, borderRadius: 12, background: colors.bgCard }}>
    <h4 style={{ ...text.cardTitle, marginBottom: 16 }}>{title}</h4>
    {children}
  </div>
);

export default function GeneralTab({ event: e }) {
  const isLaptop = useMediaQuery(bp.laptop);
  const s = getEventStats(e);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isLaptop ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: 16, padding: 20 }}>
      <Group title="Event">
        <DescriptionList columns={1} items={[
          { label: 'Event ID', value: e.eventId }, { label: 'RFQ ID', value: e.rfqId }, { label: 'RFQ subject', value: e.subject },
          { label: 'RFQ description', value: e.description }, { label: 'Start date & time', value: formatDateTime(e.start) }, { label: 'End date & time', value: formatDateTime(e.end) },
        ]} />
      </Group>
      <Group title="Classification">
        <DescriptionList columns={1} items={[
          { label: 'No. of bids received', value: `${s.bids} of ${s.invited}` }, { label: 'General category', value: e.category }, { label: 'Commodity', value: e.commodity },
          { label: 'Asset class', value: e.assetClass }, { label: 'Function', value: e.function }, { label: 'Base currency', value: e.currency },
        ]} />
      </Group>
      <Group title="People">
        <DescriptionList columns={1} items={[
          { label: 'Buyer', value: e.buyer }, { label: 'Commercial reviewer', value: e.commercialReviewer }, { label: 'Technical evaluator', value: e.technicalEvaluator },
          { label: 'Supplier assessment evaluator', value: e.supplierAssessmentEvaluator }, { label: 'Active delegatee', value: e.activeDelegatee }, { label: 'Previous delegatee', value: e.previousDelegatee },
        ]} />
      </Group>
    </div>
  );
}
