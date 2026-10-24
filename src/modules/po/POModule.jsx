import { Route, Routes } from 'react-router-dom';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { getModule } from '@/config/modules';
import { PO_NAV } from './po.config';

import POOverview from './pages/POOverview';
import POList from './pages/POList';
import POCreate from './pages/POCreate';
import PODetails from './pages/PODetails';
import POAmendments from './pages/POAmendments';
import PODeliveryTracking from './pages/PODeliveryTracking';

/** PO — Purchase Orders module entry. Routes are relative to /po */
export default function POModule() {
  return (
    <Routes>
      <Route element={<ModuleLayout module={getModule('po')} nav={PO_NAV} />}>
        <Route index element={<POOverview />} />
        <Route path="list" element={<POList />} />
        <Route path="create" element={<POCreate />} />
        <Route path="details" element={<PODetails />} />
        <Route path="amendments" element={<POAmendments />} />
        <Route path="deliveries" element={<PODeliveryTracking />} />
      </Route>
    </Routes>
  );
}
