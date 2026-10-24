import { Navigate, Route, Routes } from 'react-router-dom';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { getModule } from '@/config/modules';
import { GNFA_NAV } from './gnfa.config';

import GNFACreate from './pages/GNFACreate';
import GNFACreateDetail from './pages/GNFACreateDetail';
import GNFADashboard from './pages/GNFADashboard';
import GNFADashboardDetail from './pages/GNFADashboardDetail';

/** GNFA module entry. Routes are relative to /gnfa */
export default function GNFAModule() {
  return (
    <Routes>
      <Route element={<ModuleLayout module={getModule('gnfa')} nav={GNFA_NAV} />}>
        <Route index element={<Navigate to="create" replace />} />
        {/* GNFA Create flow: list -> (Create GNFA) -> detail, both in the right panel */}
        <Route path="create" element={<GNFACreate />} />
        <Route path="create/detail" element={<GNFACreateDetail />} />
        {/* GNFA Dashboard flow: search results -> NFA views (Executive Summary / Detailed / Attachment / Work Flow) */}
        <Route path="dashboard" element={<GNFADashboard />} />
        <Route path="dashboard/:nfaId" element={<GNFADashboardDetail />} />
        <Route path="*" element={<Navigate to="create" replace />} />
      </Route>
    </Routes>
  );
}
