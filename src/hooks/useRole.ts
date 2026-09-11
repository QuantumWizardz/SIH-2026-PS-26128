import { useStore } from '../store';
import type { UserRole } from '../store/sessionSlice';

export function useRole(): UserRole {
  return useStore((state) => state.currentRole);
}
