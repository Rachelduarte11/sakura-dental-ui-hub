export interface Payment {
  payment_id: number;
  quotation_id: number;
  amount: number;
  payment_date: string;
  payment_method_id: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  reference_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  payment_method_id: number;
  name: string;
  code: string;
  description?: string;
  status: boolean;
}

export interface PaymentWithDetails extends Payment {
  quotation?: {
    quotation_id: number;
    patient_id: number;
    total_amount: number;
    status: string;
  };
  payment_method?: PaymentMethod;
  patient?: {
    patient_id: number;
    first_name: string;
    last_name: string;
    email?: string;
  };
}

export interface PaymentFilters {
  search: string;
  status: string | null;
  paymentMethodId: number | null;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface CreatePaymentRequest {
  quotation_id: number;
  amount: number;
  payment_method_id: number;
  reference_number?: string;
  notes?: string;
}

export interface UpdatePaymentRequest {
  amount?: number;
  payment_method_id?: number;
  status?: string;
  reference_number?: string;
  notes?: string;
} 