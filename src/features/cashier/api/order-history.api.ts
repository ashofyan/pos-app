import {OrderHistory} from '../types/order-history.types';

const dummyOrders: OrderHistory[] = [
  {
    id: '1',
    orderNumber: 'ORD-456890',
    diningType: 'Dine-in',
    orderDate: 'Mon, Mei 18, 2026',
    orderTime: '14:42',
    status: 'ready',
    tableCode: 'A4',
    total: 0,
    items: [
      {id: '1-1', name: 'nama_product', quantity: 1, price: 0},
      {id: '1-2', name: 'nama_product', quantity: 2, price: 0},
      {id: '1-3', name: 'nama_product', quantity: 2, price: 0},
      {id: '1-4', name: 'nama_product', quantity: 2, price: 0},
      {id: '1-5', name: 'nama_product', quantity: 1, price: 0},
      {id: '1-6', name: 'nama_product', quantity: 2, price: 0},
      {id: '1-7', name: 'nama_product', quantity: 1, price: 0},
    ],
  },
  {
    id: '2',
    orderNumber: 'ORD-456890',
    diningType: 'Take Away',
    orderDate: 'Mon, Mei 18, 2026',
    orderTime: '14:42',
    status: 'in_progress',
    tableCode: 'TA',
    total: 0,
    items: [
      {id: '2-1', name: 'nama_product', quantity: 1, price: 0},
      {id: '2-2', name: 'nama_product', quantity: 2, price: 0},
      {id: '2-3', name: 'nama_product', quantity: 2, price: 0},
    ],
  },
  {
    id: '3',
    orderNumber: 'ORD-456890',
    diningType: 'Take Away',
    orderDate: 'Mon, Mei 18, 2026',
    orderTime: '14:42',
    status: 'in_progress',
    tableCode: 'TA',
    total: 0,
    items: [
      {id: '3-1', name: 'nama_product', quantity: 1, price: 0},
      {id: '3-2', name: 'nama_product', quantity: 2, price: 0},
      {id: '3-3', name: 'nama_product', quantity: 2, price: 0},
    ],
  },
  {
    id: '4',
    orderNumber: 'ORD-456890',
    diningType: 'Take Away',
    orderDate: 'Mon, Mei 18, 2026',
    orderTime: '14:42',
    status: 'in_progress',
    tableCode: 'TA',
    total: 0,
    items: [
      {id: '4-1', name: 'nama_product', quantity: 1, price: 0},
      {id: '4-2', name: 'nama_product', quantity: 2, price: 0},
      {id: '4-3', name: 'nama_product', quantity: 2, price: 0},
    ],
  },
  {
    id: '5',
    orderNumber: 'ORD-456890',
    diningType: 'Dine-in',
    orderDate: 'Mon, Mei 18, 2026',
    orderTime: '14:42',
    status: 'ready',
    tableCode: 'A4',
    total: 0,
    items: [
      {id: '5-1', name: 'nama_product', quantity: 1, price: 0},
      {id: '5-2', name: 'nama_product', quantity: 2, price: 0},
      {id: '5-3', name: 'nama_product', quantity: 2, price: 0},
    ],
  },
];

export const getOrderHistory = async () => {
  // TODO: replace dummy data with API call when endpoint is available.
  // const tenant = useAuthStore.getState().tenant;
  // const response = await urlTenant.get(`/${tenant?.id}/restaurant/pos/orders`);
  // return response.data;
  return Promise.resolve(dummyOrders);
};
