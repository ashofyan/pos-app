export interface ShiftSession {
  shift_id: string;
  cashier_id: number;
  cashier_name: string;
  tenant_id: string;

  opening_balance: number;

  opened_at: string;
  closed_at?: string | null;

  status: 'open' | 'closed';
}
