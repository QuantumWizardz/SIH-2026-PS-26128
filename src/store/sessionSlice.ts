import type { StateCreator } from 'zustand';

export type UserRole = 'Farmer' | 'Veterinarian' | 'FieldOfficer' | 'Admin';

export interface SessionState {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  // Mocks for current user identity
  userId: string;
}

export const createSessionSlice: StateCreator<SessionState> = (set) => {
  const initialRole = (localStorage.getItem('pr_role') as UserRole) || 'Admin';

  return {
    currentRole: initialRole, // Default to admin for full dashboard access
    userId: 'U-ADMIN-01',
    setRole: (role) => {
      localStorage.setItem('pr_role', role);
      set({ currentRole: role });
    },
  };
};
