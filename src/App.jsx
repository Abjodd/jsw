import { AuthProvider } from '@/context/AuthContext';
import AppRoutes from '@/routes/AppRoutes';
import GlobalStyles from '@/theme/GlobalStyles';
import { ToastProvider } from '@/components/ui';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <GlobalStyles />
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}
