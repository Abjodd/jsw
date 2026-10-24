import { Route, Routes } from 'react-router-dom';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { getModule } from '@/config/modules';
import { BID_NAV } from './bid.config';

import BIDOverview from './pages/BIDOverview';
import BidSubmission from './pages/BidSubmission';
import BidComparison from './pages/BidComparison';

/** BID — Bid Management module entry. Routes are relative to /bid */
export default function BIDModule() {
  return (
    <Routes>
      <Route element={<ModuleLayout module={getModule('bid')} nav={BID_NAV} />}>
        <Route index element={<BIDOverview />} />
        <Route path="submission" element={<BidSubmission />} />
        <Route path="comparison" element={<BidComparison />} />
      </Route>
    </Routes>
  );
}
