import { create } from 'zustand';

export interface PaymentMethod {
  method_id: number;
  name: string;
}

export interface Payment {
  payment_id: number;
  amount: number;
  balance_remaining: number;
  payment_date: string;
  status: 'PENDIENTE' | 'CONFIRMADO' | 'ANULADO';
  canceled_by?: number;
  created_by: number;
  method_id: number;
  quotation_id: number;
  method?: PaymentMethod;
  quotation?: {
    quotation_id: number;
    total_amount: number;
    patient?: {
      first_name: string;
      last_name: string;
    };
  };
}

export interface Receipt {
  receipt_id: number;
  generated_at: string;
  receipt_number: string;
  receipt_type: 'BOLETA' | 'FACTURA';
  payment_id: number;
}

interface PaymentState {
  payments: Payment[];
  paymentMethods: PaymentMethod[];
  receipts: Receipt[];
  selectedPayment: Payment | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    status: Payment['status'] | null;
    methodId: number | null;
    dateFrom: string | null;
    dateTo: string | null;
  };
}

interface PaymentActions {
  // Fetch actions
  fetchPayments: () => Promise<void>;
  fetchPaymentMethods: () => Promise<void>;
  fetchPaymentById: (id: number) => Promise<void>;
  fetchReceipts: (paymentId: number) => Promise<void>;
  
  // CRUD actions for payments
  createPayment: (payment: Omit<Payment, 'payment_id'>) => Promise<void>;
  updatePayment: (id: number, payment: Partial<Payment>) => Promise<void>;
  deletePayment: (id: number) => Promise<void>;
  
  // CRUD actions for payment methods
  createPaymentMethod: (method: Omit<PaymentMethod, 'method_id'>) => Promise<void>;
  updatePaymentMethod: (id: number, method: Partial<PaymentMethod>) => Promise<void>;
  deletePaymentMethod: (id: number) => Promise<void>;
  
  // Business logic actions
  processPayment: (quotationId: number, amount: number, methodId: number) => Promise<void>;
  cancelPayment: (paymentId: number, reason?: string) => Promise<void>;
  generateReceipt: (paymentId: number, receiptType: Receipt['receipt_type']) => Promise<void>;
  calculateBalance: (quotationId: number) => Promise<number>;
  
  // State management
  setSelectedPayment: (payment: Payment | null) => void;
  setFilters: (filters: Partial<PaymentState['filters']>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const usePaymentStore = create<PaymentState & PaymentActions>((set, get) => ({
  // State
  payments: [],
  paymentMethods: [],
  receipts: [],
  selectedPayment: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    status: null,
    methodId: null,
    dateFrom: null,
    dateTo: null,
  },

  // Actions
  fetchPayments: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.methodId) params.append('methodId', filters.methodId.toString());
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);

      const response = await fetch(`/api/payments?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Error al cargar pagos');
      }
      const data = await response.json();
      set({ payments: data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchPaymentMethods: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/payments/methods');
      if (!response.ok) {
        throw new Error('Error al cargar métodos de pago');
      }
      const data = await response.json();
      set({ paymentMethods: data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchPaymentById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/payments/${id}`);
      if (!response.ok) {
        throw new Error('Error al cargar pago');
      }
      const data = await response.json();
      set({ selectedPayment: data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchReceipts: async (paymentId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/payments/${paymentId}/receipts`);
      if (!response.ok) {
        throw new Error('Error al cargar recibos');
      }
      const data = await response.json();
      set({ receipts: data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  createPayment: async (payment) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payment),
      });

      if (!response.ok) {
        throw new Error('Error al crear pago');
      }

      const newPayment = await response.json();
      set((state) => ({
        payments: [...state.payments, newPayment],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updatePayment: async (id: number, payment) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/payments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payment),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar pago');
      }

      const updatedPayment = await response.json();
      set((state) => ({
        payments: state.payments.map((p) =>
          p.payment_id === id ? updatedPayment : p
        ),
        selectedPayment: state.selectedPayment?.payment_id === id ? updatedPayment : state.selectedPayment,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  deletePayment: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/payments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar pago');
      }

      set((state) => ({
        payments: state.payments.filter((p) => p.payment_id !== id),
        selectedPayment: state.selectedPayment?.payment_id === id ? null : state.selectedPayment,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  createPaymentMethod: async (method) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/payments/methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(method),
      });

      if (!response.ok) {
        throw new Error('Error al crear método de pago');
      }

      const newMethod = await response.json();
      set((state) => ({
        paymentMethods: [...state.paymentMethods, newMethod],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updatePaymentMethod: async (id: number, method) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/payments/methods/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(method),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar método de pago');
      }

      const updatedMethod = await response.json();
      set((state) => ({
        paymentMethods: state.paymentMethods.map((m) =>
          m.method_id === id ? updatedMethod : m
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  deletePaymentMethod: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/payments/methods/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar método de pago');
      }

      set((state) => ({
        paymentMethods: state.paymentMethods.filter((m) => m.method_id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  processPayment: async (quotationId: number, amount: number, methodId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quotation_id: quotationId,
          amount,
          method_id: methodId,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al procesar pago');
      }

      const newPayment = await response.json();
      set((state) => ({
        payments: [...state.payments, newPayment],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  cancelPayment: async (paymentId: number, reason?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/payments/${paymentId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Error al cancelar pago');
      }

      const updatedPayment = await response.json();
      set((state) => ({
        payments: state.payments.map((p) =>
          p.payment_id === paymentId ? updatedPayment : p
        ),
        selectedPayment: state.selectedPayment?.payment_id === paymentId ? updatedPayment : state.selectedPayment,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  generateReceipt: async (paymentId: number, receiptType: Receipt['receipt_type']) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/payments/${paymentId}/receipts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receipt_type: receiptType }),
      });

      if (!response.ok) {
        throw new Error('Error al generar recibo');
      }

      const newReceipt = await response.json();
      set((state) => ({
        receipts: [...state.receipts, newReceipt],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  calculateBalance: async (quotationId: number): Promise<number> => {
    try {
      const response = await fetch(`/api/quotations/${quotationId}/balance`);
      if (!response.ok) {
        throw new Error('Error al calcular balance');
      }
      const { balance } = await response.json();
      return balance;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
      return 0;
    }
  },

  setSelectedPayment: (payment) => {
    set({ selectedPayment: payment });
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
})); 