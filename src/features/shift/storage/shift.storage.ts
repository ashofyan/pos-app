import AsyncStorage from '@react-native-async-storage/async-storage';

import {ShiftSession} from '../types/shift.types';

const SHIFT_KEY = 'ACTIVE_SHIFT';

export const saveShiftSession = async (shift: ShiftSession) => {
  await AsyncStorage.setItem(SHIFT_KEY, JSON.stringify(shift));
};

export const getShiftSession = async () => {
  const data = await AsyncStorage.getItem(SHIFT_KEY);

  if (!data) {
    return null;
  }

  return JSON.parse(data) as ShiftSession;
};

export const removeShiftSession = async () => {
  await AsyncStorage.removeItem(SHIFT_KEY);
};
