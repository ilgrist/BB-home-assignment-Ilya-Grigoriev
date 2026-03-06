import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isInitializing } = useUser();

  if (isInitializing) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.status !== 'admin') {
    return <Navigate to="/report" replace />;
  }

  return <>{children}</>;
}