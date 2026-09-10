import { create } from 'zustand';
import { createSessionSlice } from './sessionSlice';
import type { SessionState } from './sessionSlice';

export type RootState = SessionState; // Will expand as we add more slices

export const useStore = create<RootState>()((...a) => ({
  ...createSessionSlice(...a),
}));
