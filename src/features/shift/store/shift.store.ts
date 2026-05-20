import {create} from 'zustand';

import {ShiftSession} from '../types/shift.types';

interface ShiftState {
  activeShift: ShiftSession | null;

  setActiveShift: (shift: ShiftSession) => void;

  clearShift: () => void;
}

export const useShiftStore = create<ShiftState>(set => ({
  activeShift: null,

  setActiveShift: shift =>
    set({
      activeShift: shift,
    }),

  clearShift: () =>
    set({
      activeShift: null,
    }),
}));
