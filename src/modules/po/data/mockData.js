// Demo data for the PO module (based on the SAP PO screens). Dates are ISO (YYYY-MM-DD).
import { PLANTS, PURCHASE_GROUPS } from './constants';

export const PO_VENDORS = [
  { code: '202575', name: 'Yamuna Incorporation', city: 'Vapi', state: 'Gujarat', contact: '+91 90000 25750' },
  { code: '200041', name: 'Alpesh Colour & Chemical', city: 'Surat', state: 'Gujarat', contact: '+91 90000 00041' },
  { code: '200247', name: 'Fine Thread Form Industries', city: 'Rajkot', state: 'Gujarat', contact: '+91 90000 02470' },
  { code: '200318', name: 'Precision Bearings Co.', city: 'Pune', state: 'Maharashtra', contact: '+91 90000 03180' },
];
export const vendor = (code) => PO_VENDORS.find((v) => v.code === code);
const plant = (code) => PLANTS.find((p) => p.code === code);
const pg = (code) => PURCHASE_GROUPS.find((p) => p.code === code);

const item = (itemNo, materialCode, description, qty, netPrice, deliveryDate, extra = {}) => ({
  itemNo: String(itemNo), materialCode, description, qty, netPrice, deliveryDate, uom: 'EA', gstRate: 18,
  revisionNo: '', deliveredQty: 0, asnQty: 0, storageLocation: '2M10', shipTo: '', deletion: false, shortClose: false,
  materialGroup: { code: 'R103', name: 'Bought out' }, hsn: '73181110', deliveryChange: null,
  drawings: [], ...extra,
});

const po = (p) => ({
  docType: 'NB', poType: 'STD PO U1', unitNo: 'Unit-1', currency: 'INR', incoterms: 'FOR - Free On Road',
  paymentTerms: 'T011 - 60 days after delivery', costCenter: '', assetCode: '', remarks: [], asns: [], ...p,
  plant: plant(p.plant ?? 'TA02'), purGroup: pg(p.purGroup),
});

const dwg = (name, rev, at, by = 'Design – TATPL') => ({ name, rev, at, by });

export const POS = [
  po({
    poNumber: '1452100325', vendorCode: '202575', createdOn: '2026-10-22', createdBy: 'Karthikeyan P', status: 'New', purGroup: '001',
    items: [item(10, 'PK000412', 'PP strapping roll 12 mm × 1000 m', 120, 1450, '2026-11-12', { uom: 'ROL', hsn: '39206990', materialGroup: { code: 'P201', name: 'Packing' } })],
  }),
  po({
    poNumber: '1452100324', vendorCode: '200041', createdOn: '2026-10-14', createdBy: 'Manish', status: 'New', purGroup: '110',
    items: [
      item(10, 'CH001201', 'Caustic soda flakes 98%', 2000, 52.5, '2026-11-05', { uom: 'KG', hsn: '28151110', materialGroup: { code: 'C110', name: 'Chemicals' } }),
      item(20, 'CH001377', 'Hydrogen peroxide 50% w/w', 1500, 41, '2026-11-05', { uom: 'KG', hsn: '28470000', materialGroup: { code: 'C110', name: 'Chemicals' } }),
      item(30, 'CH002015', 'Reactive dye red ME4BL', 250, 380, '2026-11-18', { uom: 'KG', hsn: '32041610', materialGroup: { code: 'C120', name: 'Dyes' } }),
    ],
  }),
  po({
    poNumber: '1452100323', vendorCode: '200041', createdOn: '2026-09-29', createdBy: 'Manish', status: 'Acknowledged', purGroup: '110',
    items: [item(10, 'CH001201', 'Caustic soda flakes 98%', 1000, 52.5, '2026-10-20', { uom: 'KG', hsn: '28151110', asnQty: 600, deliveredQty: 600, materialGroup: { code: 'C110', name: 'Chemicals' } })],
    asns: [{ asnNo: '8000004511', invoiceNo: 'APC/26-27/1182', invoiceDate: '2026-10-18', createdAt: '2026-10-18T11:20:00+05:30', status: 'Received', lines: [{ itemNo: '10', qty: 600 }], value: 37170 }],
  }),
  po({
    poNumber: '1452100322', vendorCode: '200041', createdOn: '2026-09-29', createdBy: 'Manish', status: 'New', purGroup: '110',
    items: [item(10, 'CH001377', 'Hydrogen peroxide 50% w/w', 800, 41, '2026-11-02', { uom: 'KG', hsn: '28470000', materialGroup: { code: 'C110', name: 'Chemicals' } })],
  }),
  po({
    poNumber: '2452100093', vendorCode: '200041', createdOn: '2026-09-26', createdBy: 'Manish', status: 'New', purGroup: 'CPS',
    docType: 'NB2', poType: 'STD PO U2', plant: 'TA07', unitNo: 'Unit-2',
    items: [
      item(10, 'CH003310', 'Soda ash light', 5000, 31.2, '2026-11-10', { uom: 'KG', hsn: '28362010', materialGroup: { code: 'C110', name: 'Chemicals' } }),
      item(20, 'CH003318', 'Sodium hydrosulphite 88%', 600, 118, '2026-11-10', { uom: 'KG', hsn: '28311010', materialGroup: { code: 'C110', name: 'Chemicals' } }),
    ],
  }),
  po({
    poNumber: '1452100321', vendorCode: '200041', createdOn: '2026-09-21', createdBy: 'Dharmik', status: 'Pending Acknowledgement', purGroup: 'CPS',
    items: [item(10, 'CH002015', 'Reactive dye red ME4BL', 400, 380, '2026-10-28', {
      uom: 'KG', hsn: '32041610', materialGroup: { code: 'C120', name: 'Dyes' },
      deliveryChange: { requestedDate: '2026-11-15', reason: 'Imported intermediate delayed at port', requestedAt: '2026-10-21T15:05:00+05:30', status: 'Pending' },
    })],
  }),
  po({
    poNumber: '1452100320', vendorCode: '200247', createdOn: '2026-09-17', createdBy: 'Yash', status: 'New', purGroup: '110',
    items: [item(10, 'TA21004BO', 'HEX BOLT M12 X 50 GR 8.8 ZN', 3000, 6.9, '2026-11-08', { hsn: '73181500', materialGroup: { code: 'R103', name: 'Bought out' } })],
  }),
  po({
    poNumber: '1452100317', vendorCode: '200318', createdOn: '2026-08-05', createdBy: 'Manish', status: 'Partially Delivered', purGroup: '110',
    items: [
      item(10, 'BR001985', 'ANGULAR CONTACT B.BEARING 7207 P5 NTN', 100, 100, '2026-08-11', { asnQty: 16, deliveredQty: 16, hsn: '84823000', materialGroup: { code: 'O116', name: 'Bearings' } }),
      item(20, 'BR001126', 'BEARING 6307', 100, 90, '2026-08-11', { asnQty: 15, deliveredQty: 15, hsn: '84821020', materialGroup: { code: 'E102', name: 'Bearings – std' } }),
      item(60, 'BR001985', 'ANGULAR CONTACT B.BEARING 7207 P5 NTN', 100, 100, '2026-11-11', { asnQty: 12, deliveredQty: 0, hsn: '84823000', materialGroup: { code: 'O116', name: 'Bearings' } }),
      item(70, 'BR001126', 'BEARING 6307', 100, 90, '2026-11-11', { hsn: '84821020', materialGroup: { code: 'E102', name: 'Bearings – std' } }),
      item(110, 'BR001985', 'ANGULAR CONTACT B.BEARING 7207 P5 NTN', 100, 100, '2026-11-25', { hsn: '84823000', materialGroup: { code: 'O116', name: 'Bearings' } }),
      item(120, 'BR001126', 'BEARING 6307', 100, 90, '2026-11-25', { hsn: '84821020', materialGroup: { code: 'E102', name: 'Bearings – std' } }),
    ],
    asns: [
      { asnNo: '8000004402', invoiceNo: 'PBC/2627/0391', invoiceDate: '2026-08-10', createdAt: '2026-08-10T16:40:00+05:30', status: 'Received', lines: [{ itemNo: '10', qty: 16 }, { itemNo: '20', qty: 15 }], value: 3481 },
      { asnNo: '8000004519', invoiceNo: 'PBC/2627/0577', invoiceDate: '2026-10-22', createdAt: '2026-10-22T10:05:00+05:30', status: 'In Transit', lines: [{ itemNo: '60', qty: 12 }], value: 1416 },
    ],
  }),
  po({
    poNumber: '1452100312', vendorCode: '200247', createdOn: '2026-06-19', createdBy: 'Yash', status: 'Pending Acknowledgement', purGroup: 'CP2',
    items: [
      item(10, 'TA19728BO', 'SELF LOCK NUT M14X2 DIN 980V', 2200, 8.34, '2026-07-02', {
        hsn: '73181900', materialGroup: { code: 'R101', name: 'RM Import' }, revisionNo: 'B',
        drawings: [dwg('TA19728BO_RevA.pdf', 'A', '2026-05-30T10:00:00+05:30'), dwg('TA19728BO_RevB.pdf', 'B', '2026-06-15T12:30:00+05:30')],
      }),
      item(20, 'TA03069BO', 'SLOTTED HEAD SCREW M4 X 0.7 X20', 160, 0.63, '2026-07-16', {
        drawings: [dwg('TA03069BO_RevA.pdf', 'A', '2026-06-02T09:10:00+05:30')],
        deliveryChange: { requestedDate: '2026-07-30', reason: 'Wire rod shortage at mill', requestedAt: '2026-06-28T14:12:00+05:30', status: 'Pending' },
      }),
      item(30, 'TA03069BO', 'SLOTTED HEAD SCREW M4 X 0.7 X20', 6840, 0.63, '2026-07-04', {
        drawings: [dwg('TA03069BO_RevA.pdf', 'A', '2026-06-02T09:10:00+05:30')],
        deliveryChange: { requestedDate: '2026-07-24', reason: 'Plating line maintenance', requestedAt: '2026-06-29T10:40:00+05:30', status: 'Pending' },
      }),
      item(40, 'TA19728BO', 'SELF LOCK NUT M14X2 DIN 980V', 2000, 8.34, '2026-07-10', {
        hsn: '73181900', materialGroup: { code: 'R101', name: 'RM Import' }, deliveredQty: 500, asnQty: 500, revisionNo: 'B',
        drawings: [dwg('TA19728BO_RevB.pdf', 'B', '2026-06-15T12:30:00+05:30')],
      }),
    ],
    remarks: [{ text: 'Please confirm revised schedule for item 20 and 30 before acknowledging.', by: 'Yash', at: '2026-07-01T11:00:00+05:30' }],
    asns: [{ asnNo: '8000004377', invoiceNo: 'FTF/26-27/0214', invoiceDate: '2026-07-09', createdAt: '2026-07-09T17:30:00+05:30', status: 'Received', lines: [{ itemNo: '40', qty: 500 }], value: 4920.6 }],
  }),
].map((p) => ({
  ...p,
  activity: [
    { at: p.createdOn, text: `PO created by ${p.createdBy}`, tone: 'inactive' },
    { at: p.createdOn, text: `PO released to ${vendor(p.vendorCode).name}`, tone: 'progress' },
    ...(p.status === 'Acknowledged' || p.status === 'Partially Delivered' ? [{ at: p.createdOn, text: 'PO acknowledged by supplier', tone: 'success' }] : []),
    ...p.items.filter((i) => i.deliveryChange).map((i) => ({ at: i.deliveryChange.requestedAt, text: `Supplier requested new delivery date for item ${i.itemNo}`, tone: 'warning' })),
    ...p.asns.map((a) => ({ at: a.createdAt, text: `ASN ${a.asnNo} created (invoice ${a.invoiceNo})`, tone: 'success' })),
    ...p.remarks.map((r) => ({ at: r.at, text: `Remark added: “${r.text}”`, tone: 'progress', by: r.by })),
  ],
}));
