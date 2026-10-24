import { Route, Routes } from 'react-router-dom';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { getModule } from '@/config/modules';
import { GNFA_NAV } from './gnfa.config';

import GNFAOverview from './pages/GNFAOverview';
import GNFARequests from './pages/GNFARequests';
import GNFACreate from './pages/GNFACreate';
import GNFAApprovals from './pages/GNFAApprovals';
import GNFADetails from './pages/GNFADetails';
import GNFAReports from './pages/GNFAReports';

/** GNFA — GNFA module entry. Routes are relative to /gnfa */
export default function GNFAModule() {
  return (
    <Routes>
      <Route element={<ModuleLayout module={getModule('gnfa')} nav={GNFA_NAV} />}>
        <Route index element={<GNFAOverview />} />
        <Route path="requests" element={<GNFARequests />} />
        <Route path="create" element={<GNFACreate />} />
        <Route path="approvals" element={<GNFAApprovals />} />
        <Route path="details" element={<GNFADetails />} />
        <Route path="reports" element={<GNFAReports />} />
      </Route>
    </Routes>
  );
}
