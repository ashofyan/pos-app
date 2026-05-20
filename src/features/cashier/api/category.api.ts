import {urlTenant} from '../../../core/api/axios';

import {useAuthStore} from '../../auth/store/auth.store';

import {AccountingCategory} from '../types/category.types';

interface CategoryResponse {
  data: AccountingCategory[];
}

export const getCategories = async () => {
  const tenant = useAuthStore.getState().tenant;

  const response = await urlTenant.get<CategoryResponse>(
    `/${tenant?.id}/category-get-all`,
    {
      params: {
        page: 0,
        perpage: 100,
        category_type: 'item',
      },
    },
  );
  return response.data;
};
