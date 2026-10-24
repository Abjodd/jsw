import { Navigate, Route, Routes } from 'react-router-dom';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { getModule } from '@/config/modules';
import { RFQ_NAV } from './rfq.config';

import RFQDashboard from './pages/RFQDashboard';
import CreateRFQ from './pages/CreateRFQ';
import RFQEventDetail from './pages/RFQEventDetail';

/** RFQ — Request for Quotation module entry. Routes are relative to /rfq */
export default function RFQModule() {
  return (
    <Routes>
      <Route element={<ModuleLayout module={getModule('rfq')} nav={RFQ_NAV} />}>
        <Route index element={<RFQDashboard />} />
        <Route path="create" element={<CreateRFQ />} />
        <Route path="events/:eventId" element={<RFQEventDetail />} />
        <Route path="*" element={<Navigate to="/rfq" replace />} />
      </Route>
    </Routes>
  );
}
