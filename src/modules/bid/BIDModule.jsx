import { Route, Routes } from 'react-router-dom';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { getModule } from '@/config/modules';
import { BID_NAV } from './bid.config';

import BIDOverview from './pages/BIDOverview';
import BidEvents from './pages/BidEvents';
import BidCreate from './pages/BidCreate';
import BidEvaluation from './pages/BidEvaluation';
import BidComparison from './pages/BidComparison';
import BidAward from './pages/BidAward';

/** BID — Bid Management module entry. Routes are relative to /bid */
export default function BIDModule() {
  return (
    <Routes>
      <Route element={<ModuleLayout module={getModule('bid')} nav={BID_NAV} />}>
        <Route index element={<BIDOverview />} />
        <Route path="events" element={<BidEvents />} />
        <Route path="create" element={<BidCreate />} />
        <Route path="evaluation" element={<BidEvaluation />} />
        <Route path="comparison" element={<BidComparison />} />
        <Route path="award" element={<BidAward />} />
      </Route>
    </Routes>
  );
}
