import { create } from 'zustand';
import { paymentsApi } from '../api/paymentsApi';
import type { 
  Payment, 
  PaymentWithDetails, 
  PaymentFilters, 
  CreatePaymentRequest, 
  UpdatePaymentRequest,
  PaymentMethod 
} from '../api/types';

interface PaymentsState {
  payments: Payment[];
  paymentMethods: PaymentMethod[];
  selectedPayment: PaymentWithDetails | null;
  isLoading: boolean;
  error: string | null;
  filters: PaymentFilters;
}

interface PaymentsActions {
  // Fetch actions
  fetchPayments: () => Promise<void>;
  fetchPaymentById: (id: number) => Promise<void>;
  fetchPaymentMethods: () => Promise<void>;
  fetchPaymentsByQuotation: (quotationId: number) => Promise<void>;
  fetchPaymentsByPatient: (patientId: number) => Promise<void>;
  
  // CRUD actions
  createPayment: (payment: CreatePaymentRequest) => Promise<void>;
  updatePayment: (id: number, payment: UpdatePaymentRequest) => Promise<void>;
  deletePayment: (id: number) => Promise<void>;
  
  // Payment processing
  processPayment: (payment: CreatePaymentRequest) => Promise<void>;
  refundPayment: (id: number, reason?: string) => Promise<void>;
  
  // State management
  setSelectedPayment: (payment: PaymentWithDetails | null) => void;
  setFilters: (filters: Partial<PaymentFilters>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const usePaymentsStore = create<PaymentsState & PaymentsActions>((set, get) => ({
  // State
  payments: [],
  paymentMethods: [],
  selectedPayment: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    status: null,
    paymentMethodId: null,
  },

  // Actions
  fetchPayments: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const response = await paymentsApi.getAll(filters);
      set({ payments: response.data || [], isLoading: false });
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
      const response = await paymentsApi.getById(id);
      set({ selectedPayment: response.data, isLoading: false });
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
      const response = await paymentsApi.getPaymentMethods();
      set({ paymentMethods: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchPaymentsByQuotation: async (quotationId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await paymentsApi.getByQuotation(quotationId);
      set({ payments: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchPaymentsByPatient: async (patientId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await paymentsApi.getByPatient(patientId);
      set({ payments: response.data || [], isLoading: false });
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
      const response = await paymentsApi.create(payment);
      set((state) => ({
        payments: [...state.payments, response.data],
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
      const response = await paymentsApi.update(id, payment);
      set((state) => ({
        payments: state.payments.map((p) =>
          p.payment_id === id ? response.data : p
        ),
        selectedPayment: state.selectedPayment?.payment_id === id ? response.data : state.selectedPayment,
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
      await paymentsApi.delete(id);
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

  processPayment: async (payment) => {
    set({ isLoading: true, error: null });
    try {
      const response = await paymentsApi.processPayment(payment);
      set((state) => ({
        payments: [...state.payments, response.data],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  refundPayment: async (id: number, reason?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await paymentsApi.refundPayment(id, reason);
      set((state) => ({
        payments: state.payments.map((p) =>
          p.payment_id === id ? response.data : p
        ),
        selectedPayment: state.selectedPayment?.payment_id === id ? response.data : state.selectedPayment,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
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