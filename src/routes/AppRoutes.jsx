import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '@/pages/Login/LoginPage';
import HomeDashboard from '@/pages/Home/HomeDashboard';
import NotFound from '@/pages/NotFound/NotFound';
import PageLoader from '@/components/ui/PageLoader';

// Each module is lazy-loaded so teams can work independently.
const PRModule = lazy(() => import('@/modules/pr/PRModule'));
const BIDModule = lazy(() => import('@/modules/bid/BIDModule'));
const RFQModule = lazy(() => import('@/modules/rfq/RFQModule'));
const GNFAModule = lazy(() => import('@/modules/gnfa/GNFAModule'));
const POModule = lazy(() => import('@/modules/po/POModule'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/pr/*" element={<PRModule />} />
          <Route path="/bid/*" element={<BIDModule />} />
          <Route path="/rfq/*" element={<RFQModule />} />
          <Route path="/gnfa/*" element={<GNFAModule />} />
          <Route path="/po/*" element={<POModule />} />
        </Route>

        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
