import { Navigate } from 'react-router-dom';
import type { ReactElement } from 'react';
import { useAuth } from '../auth';
import type { Role } from '../types';

interface ProtectedRouteProps {
  allowedRoles: Role[];
  children: ReactElement;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={homePathForRole(user.role)} replace />;
  }

  return children;
}

export function homePathForRole(role: Role): string {
  if (role === 'DONOR') {
    return '/donor';
  }
  if (role === 'VOLUNTEER') {
    return '/volunteer';
  }
  return '/admin';
}
