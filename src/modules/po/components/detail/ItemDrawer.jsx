import { Card, DescriptionList, Drawer, StatusBadge, Tag } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';
import { bp, text } from '@/theme/theme';
import { formatDate, formatDateTime, formatINR, formatNumber } from '@/utils/format';
import { DELIVERY_CHANGE_TONE } from '../../data/constants';
import { availableForAsn, lineTax, lineTaxable, lineTotal, toBeDelivered } from '../../data/poMath';
import { itemStatus } from './itemStatus';

const Section = ({ title, children }) => <Card title={title} style={{ marginBottom: 16 }}>{children}</Card>;

/** Every field of a PO line (as in the SAP grid), grouped. */
export default function ItemDrawer({ po, item: i, onClose }) {
  const isMobile = useMediaQuery(bp.mobile);
  if (!i) return null;
  const s = itemStatus(po, i);
  const c = isMobile ? 1 : 2;
  return (
    <Drawer
      open
      onClose={onClose}
      width={600}
      header={
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <StatusBadge status={s.tone}>{s.label}</StatusBadge>
            {i.revisionNo && <Tag tone="steel" size="sm">Revision {i.revisionNo}</Tag>}
            {i.deletion && <Tag tone="error" size="sm">Deletion flagged</Tag>}
            {i.shortClose && <Tag tone="inactive" size="sm">Short closed</Tag>}
          </div>
          <h2 style={text.section}>Item {i.itemNo} · {i.materialCode}</h2>
          <p style={{ ...text.subtitle, marginTop: 2 }}>{i.description}</p>
        </div>
      }
    >
      <Section title="Quantity & value">
        <DescriptionList columns={c} items={[
          { label: 'PO quantity', value: `${formatNumber(i.qty, 2)} ${i.uom}` }, { label: 'Net price', value: formatINR(i.netPrice, 2) },
          { label: 'Taxable value', value: formatINR(lineTaxable(i), 2) }, { label: `GST (${i.gstRate}%)`, value: formatINR(lineTax(i), 2) },
          { label: 'Total value', value: formatINR(lineTotal(i), 2) }, { label: 'HSN code', value: i.hsn },
        ]} />
      </Section>
      <Section title="Delivery">
        <DescriptionList columns={c} items={[
          { label: 'Expected delivery date', value: formatDate(i.deliveryDate) }, { label: 'Delivered quantity', value: formatNumber(i.deliveredQty, 2) },
          { label: 'To be delivered', value: formatNumber(toBeDelivered(i), 2) }, { label: 'ASN created quantity', value: formatNumber(i.asnQty, 2) },
          { label: 'Available for ASN', value: formatNumber(availableForAsn(i), 2) }, { label: 'Storage location', value: i.storageLocation },
          { label: 'Ship-to party', value: i.shipTo || `${po.plant.code} · ${po.plant.name}` },
        ]} />
      </Section>
      <Section title="Delivery date change request">
        {i.deliveryChange ? (
          <DescriptionList columns={c} items={[
            { label: 'Requested delivery date', value: formatDate(i.deliveryChange.requestedDate) },
            { label: 'Request status', value: <StatusBadge status={DELIVERY_CHANGE_TONE[i.deliveryChange.status]}>{i.deliveryChange.status}</StatusBadge> },
            { label: 'Reason', value: i.deliveryChange.reason, span: 2 }, { label: 'Requested on', value: formatDateTime(i.deliveryChange.requestedAt) },
          ]} />
        ) : <p style={{ ...text.body, margin: 0 }}>No change requested.</p>}
      </Section>
      <Section title="Classification">
        <DescriptionList columns={c} items={[
          { label: 'Material group', value: `${i.materialGroup.code} · ${i.materialGroup.name}` }, { label: 'Revision no.', value: i.revisionNo },
          { label: 'Deletion indicator', value: i.deletion ? 'Yes' : 'No' }, { label: 'Short close', value: i.shortClose ? 'Yes' : 'No' },
        ]} />
      </Section>
    </Drawer>
  );
}
