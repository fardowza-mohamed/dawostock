import AppRoutes from './routes/AppRoutes';
import { SettingsProvider } from './context/SettingsContext';
import { NotificationProvider } from './context/NotificationContext';
import { useAuth } from './context/AuthContext';

function AuthenticatedProviders({ children }) {
  const { token } = useAuth();
  if (!token) return children;
  return <NotificationProvider>{children}</NotificationProvider>;
}

export default function App() {
  return (
    <SettingsProvider>
      <AuthenticatedProviders>
        <AppRoutes />
      </AuthenticatedProviders>
    </SettingsProvider>
  );
}
