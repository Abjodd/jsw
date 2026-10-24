import { Route, Routes } from 'react-router-dom';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { getModule } from '@/config/modules';
import { PR_NAV } from './pr.config';

import PROverview from './pages/PROverview';
import PRList from './pages/PRList';
import PRCreate from './pages/PRCreate';
import PRDetails from './pages/PRDetails';
import PRApprovals from './pages/PRApprovals';
import PRReports from './pages/PRReports';

/** PR — Purchase Requisition module entry. Routes are relative to /pr */
export default function PRModule() {
  return (
    <Routes>
      <Route element={<ModuleLayout module={getModule('pr')} nav={PR_NAV} />}>
        <Route index element={<PROverview />} />
        <Route path="list" element={<PRList />} />
        <Route path="create" element={<PRCreate />} />
        <Route path="details" element={<PRDetails />} />
        <Route path="approvals" element={<PRApprovals />} />
        <Route path="reports" element={<PRReports />} />
      </Route>
    </Routes>
  );
}
