import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '@/redux/store';
import NotFound from '@/pages/NotFound';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isLoggedIn, userRole } = useSelector((state: RootState) => state.authSlice);

  // Not logged in - redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but role not allowed - show 403 Forbidden
  if (!allowedRoles.includes(userRole || '')) {
    return <NotFound type="forbidden" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
