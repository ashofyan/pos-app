import {urlTenant} from '../../../core/api/axios';

import {useAuthStore} from '../../auth/store/auth.store';

export interface CheckoutPayload {
  dining_type: string;
  item_ids: number[];
  vendor_id: number;
  payment_method_id: number;
  paid_amount: number;
  discount: number;
  service_charge: number;
  tax_total: number;
  created_by: number;
}

export interface CheckoutResponse {
  data?: {
    order_number?: string;
    order_date?: string;
  };
  order_number?: string;
  order_date?: string;
  message?: string;
}

export const checkoutOrder = async (payload: CheckoutPayload) => {
  const tenant = useAuthStore.getState().tenant;

  const response = await urlTenant.post<CheckoutResponse>(
    `/${tenant?.id}/restaurant/pos/orders/checkout`,
    payload,
  );

  console.log(payload);
  return response.data;
};
