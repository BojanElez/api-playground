import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { ReactNode } from 'react';
import Loader from '../common/loader/Loader';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isAuthHydrated, checkAuthFromStorage } = useAuthStore();

  useEffect(() => {
    checkAuthFromStorage();
  }, [checkAuthFromStorage]);

  if (!isAuthHydrated) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
