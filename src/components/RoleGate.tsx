import React from 'react';
import { useRole } from '../hooks/useRole';
import type { UserRole } from '../store/sessionSlice';

interface Props {
  roles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGate({ roles, children, fallback = null }: Props) {
  const currentRole = useRole();
  if (roles.includes(currentRole)) {
    return <>{children}</>;
  }
  return <>{fallback}</>;
}
