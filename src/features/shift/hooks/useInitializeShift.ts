import {useCallback, useEffect, useState} from 'react';

import {getShiftSession} from '../storage/shift.storage';

import {useShiftStore} from '../store/shift.store';

export const useInitializeShift = () => {
  const [loading, setLoading] = useState(true);

  const setActiveShift = useShiftStore(state => state.setActiveShift);

  const initialize = useCallback(async () => {
    try {
      const shift = await getShiftSession();

      if (shift) {
        setActiveShift(shift);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [setActiveShift]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    loading,
  };
};
