import {urlTenant} from '../../../core/api/axios';

import {useAuthStore} from '../../auth/store/auth.store';

import {AccountingProduct} from '../types/product.types';

interface ProductResponse {
  data: AccountingProduct[];
}

interface ProductParams {
  q?: string;
  page?: number;
  perpage?: number;
  category_id?: number | null;
}

export const getProducts = async ({
  q = '',
  page = 1,
  perpage = 20,
  category_id = null,
}: ProductParams) => {
  const tenant = useAuthStore.getState().tenant;

  const response = await urlTenant.get<ProductResponse>(
    `/${tenant?.id}/product-get-all`,
    {
      params: {
        q,
        page,
        perpage,
        product_type: 'item',
        category_id,
      },
    },
  );

  return response.data;
};
