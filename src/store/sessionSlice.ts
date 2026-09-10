import type { StateCreator } from 'zustand';

export type UserRole = 'Farmer' | 'Veterinarian' | 'FieldOfficer' | 'Admin';

export interface SessionState {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  // Mocks for current user identity
  userId: string;
}

export const createSessionSlice: StateCreator<SessionState> = (set) => ({
  currentRole: 'Admin', // Default to admin for full dashboard access
  userId: 'U-ADMIN-01',
  setRole: (role) => set({ currentRole: role }),
});
