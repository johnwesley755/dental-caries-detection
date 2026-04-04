import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <LoadingSpinner size="lg" />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Redirect unverified dentists to pending page (except if they are already there)
  if (
    user?.role === 'DENTIST' && 
    !user.is_verified && 
    location.pathname !== '/pending-verification'
  ) {
    return <Navigate to="/pending-verification" replace />;
  }

  return <>{children}</>;
};
