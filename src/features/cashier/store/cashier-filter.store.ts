import {create} from 'zustand';

interface CashierFilterState {
  search: string;

  categoryId: number | null;

  setSearch: (value: string) => void;

  setCategoryId: (value: number | null) => void;
}

export const useCashierFilterStore = create<CashierFilterState>(set => ({
  search: '',

  categoryId: null,

  setSearch: value =>
    set({
      search: value,
    }),

  setCategoryId: value =>
    set({
      categoryId: value,
    }),
}));
