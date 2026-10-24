import { Navigate, Route, Routes } from 'react-router-dom';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { getModule } from '@/config/modules';
import { PR_NAV } from './pr.config';

import PRAdminDashboard from './pages/PRAdminDashboard';
import PRBuyerDashboard from './pages/PRBuyerDashboard';

/** PR — Purchase Requisition module entry. Routes are relative to /pr */
export default function PRModule() {
  return (
    <Routes>
      <Route element={<ModuleLayout module={getModule('pr')} nav={PR_NAV} />}>
        <Route index element={<PRAdminDashboard />} />
        <Route path="buyer" element={<PRBuyerDashboard />} />
        <Route path="*" element={<Navigate to="/pr" replace />} />
      </Route>
    </Routes>
  );
}
