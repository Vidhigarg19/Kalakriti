import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '@/lib/store';
import type { UserRole } from '@/types';

export function ProtectedRoute({ roles, children }: { roles: UserRole[]; children: ReactNode }) {
  const { user } = useApp();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
