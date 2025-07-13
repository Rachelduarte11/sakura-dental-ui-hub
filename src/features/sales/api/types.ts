export interface Sale {
  sale_id: number;
  quotation_id: number;
  patient_id: number;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  sale_date: string;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'partial' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SaleItem {
  sale_item_id: number;
  sale_id: number;
  service_id: number;
  quantity: number;
  unit_price: number;
  discount_percentage: number;
  total_price: number;
  notes?: string;
}

export interface SaleWithDetails extends Sale {
  items: SaleItem[];
  patient?: {
    patient_id: number;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
  };
  quotation?: {
    quotation_id: number;
    total_amount: number;
    status: string;
  };
  payments?: Array<{
    payment_id: number;
    amount: number;
    payment_date: string;
    status: string;
  }>;
}

export interface SalesFilters {
  search: string;
  status: string | null;
  paymentStatus: string | null;
  patientId: number | null;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface CreateSaleRequest {
  quotation_id: number;
  patient_id: number;
  items: Array<{
    service_id: number;
    quantity: number;
    unit_price: number;
    discount_percentage?: number;
    notes?: string;
  }>;
  discount_amount?: number;
  notes?: string;
}

export interface UpdateSaleRequest {
  status?: string;
  payment_status?: string;
  discount_amount?: number;
  notes?: string;
}

export interface SalesSummary {
  total_sales: number;
  total_amount: number;
  total_discount: number;
  total_revenue: number;
  pending_sales: number;
  completed_sales: number;
  cancelled_sales: number;
} 