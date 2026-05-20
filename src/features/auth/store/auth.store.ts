import {create} from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Tenant {
  id: string;
  company_name: string;
  tenancy_db_name: string;
}

interface AuthState {
  user: User | null;
  tenant: Tenant | null;

  setAuth: (user: User, tenant: Tenant) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  tenant: null,
  setAuth: (user, tenant) =>
    set({
      user,
      tenant,
    }),

  logout: () =>
    set({
      user: null,
    }),
}));
