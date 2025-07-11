export interface Treatment {
  id: number;
  name: string;
  price: number;
  category: string;
}

export interface QuoteItem extends Treatment {
  quantity: number;
}

export interface Patient {
  id: number;
  name: string;
  phone: string;
  email: string;
}

export interface Quote {
  id?: number;
  patient: Patient;
  items: QuoteItem[];
  discount: number;
  subtotal: number;
  total: number;
  createdAt?: Date;
  status?: 'draft' | 'sent' | 'accepted' | 'rejected';
} 