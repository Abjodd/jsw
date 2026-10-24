import { Navigate, Route, Routes } from 'react-router-dom';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { getModule } from '@/config/modules';
import { PO_NAV } from './po.config';

import PODashboard from './pages/PODashboard';
import PODetail from './pages/PODetail';
import CreateASN from './pages/CreateASN';
import ASNRegister from './pages/ASNRegister';

/** PO — Purchase Orders module entry. Routes are relative to /po */
export default function POModule() {
  return (
    <Routes>
      <Route element={<ModuleLayout module={getModule('po')} nav={PO_NAV} />}>
        <Route index element={<PODashboard />} />
        <Route path="asns" element={<ASNRegister />} />
        <Route path=":poNumber" element={<PODetail />} />
        <Route path=":poNumber/asn" element={<CreateASN />} />
        <Route path="*" element={<Navigate to="/po" replace />} />
      </Route>
    </Routes>
  );
}
