
import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireRole?: 'driver' | 'passenger';
}

export const Layout = ({ children, requireAuth, requireRole }: LayoutProps) => {
  const { user, status, role } = useAuth();

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-transit-500"></div>
      </div>
    );
  }

  // Check authentication if required
  if (requireAuth && status === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  // Check role if required
  if (requireRole && role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
};
