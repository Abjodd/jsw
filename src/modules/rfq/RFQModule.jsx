import { Route, Routes } from 'react-router-dom';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { getModule } from '@/config/modules';
import { RFQ_NAV } from './rfq.config';

import RFQOverview from './pages/RFQOverview';
import RFQList from './pages/RFQList';
import RFQCreate from './pages/RFQCreate';
import RFQVendorResponses from './pages/RFQVendorResponses';
import RFQComparison from './pages/RFQComparison';
import RFQVendors from './pages/RFQVendors';

/** RFQ — Request for Quotation module entry. Routes are relative to /rfq */
export default function RFQModule() {
  return (
    <Routes>
      <Route element={<ModuleLayout module={getModule('rfq')} nav={RFQ_NAV} />}>
        <Route index element={<RFQOverview />} />
        <Route path="list" element={<RFQList />} />
        <Route path="create" element={<RFQCreate />} />
        <Route path="responses" element={<RFQVendorResponses />} />
        <Route path="comparison" element={<RFQComparison />} />
        <Route path="vendors" element={<RFQVendors />} />
      </Route>
    </Routes>
  );
}
