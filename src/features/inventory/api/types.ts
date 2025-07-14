export interface Product {
  product_id: number;
  name: string;
  description?: string;
  sku: string;
  category_id: number;
  unit_price: number;
  cost_price: number;
  stock_quantity: number;
  min_stock_level: number;
  max_stock_level: number;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  category_id: number;
  name: string;
  description?: string;
  status: boolean;
}

export interface ProductWithDetails extends Product {
  category?: ProductCategory;
  supplier?: {
    supplier_id: number;
    name: string;
    contact_info?: string;
  };
}

export interface InventoryMovement {
  movement_id: number;
  product_id: number;
  movement_type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reference_number?: string;
  notes?: string;
  created_at: string;
  created_by: number;
}

export interface InventoryFilters {
  search: string;
  categoryId: number | null;
  status: boolean | null;
  lowStock: boolean | null;
  outOfStock: boolean | null;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  sku: string;
  category_id: number;
  unit_price: number;
  cost_price: number;
  stock_quantity: number;
  min_stock_level: number;
  max_stock_level: number;
  supplier_id?: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  sku?: string;
  category_id?: number;
  unit_price?: number;
  cost_price?: number;
  min_stock_level?: number;
  max_stock_level?: number;
  status?: boolean;
}

export interface CreateMovementRequest {
  product_id: number;
  movement_type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  reference_number?: string;
  notes?: string;
}

export interface InventorySummary {
  total_products: number;
  active_products: number;
  low_stock_products: number;
  out_of_stock_products: number;
  total_stock_value: number;
  total_cost_value: number;
  total_profit_margin: number;
} 