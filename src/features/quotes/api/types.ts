export interface Quote {
  quotation_id: number;
  patient_id: number;
  total_amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  created_at: string;
  updated_at: string;
  notes?: string;
  valid_until?: string;
}

export interface QuoteItem {
  quotation_item_id: number;
  quotation_id: number;
  service_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
}

export interface QuoteWithItems extends Quote {
  items: QuoteItem[];
  patient?: {
    patient_id: number;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
  };
}

export interface QuoteFilters {
  search: string;
  status: string | null;
  patientId: number | null;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface CreateQuoteRequest {
  patient_id: number;
  items: Array<{
    service_id: number;
    quantity: number;
    unit_price: number;
    notes?: string;
  }>;
  notes?: string;
  valid_until?: string;
}

export interface UpdateQuoteRequest {
  status?: string;
  notes?: string;
  valid_until?: string;
  items?: Array<{
    service_id: number;
    quantity: number;
    unit_price: number;
    notes?: string;
  }>;
} 