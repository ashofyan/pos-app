import {useAuthStore} from '../store/auth.store';

export const useTenant = () => {
  return useAuthStore(state => state.tenant);
};
