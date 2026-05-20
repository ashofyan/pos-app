export interface AccountingProduct {
  id: number;
  item_name: string;
  item_code: string;
  selling_price: number;
  item_photo: string;
  descriptions?: string | null;
  item_status: string;
  unit_id: number;
  is_has_tax: string;
  min_stock: number;
  product_type: 'item' | 'service' | string;
  coa_id: number;
  coa_biaya_id: number;
}
