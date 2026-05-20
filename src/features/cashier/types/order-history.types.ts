export type OrderHistoryStatus = 'ready' | 'in_progress' | 'completed';

export interface OrderHistoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderHistory {
  id: string;
  orderNumber: string;
  diningType: string;
  orderDate: string;
  orderTime: string;
  status: OrderHistoryStatus;
  tableCode: string;
  items: OrderHistoryItem[];
  total: number;
}
