import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const { user, accessToken } = useAuthStore();
  return accessToken && user ? element : <Navigate to="/login" replace />;
};
