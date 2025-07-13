import { create } from 'zustand';
import { salesApi } from '../api/salesApi';
import type { 
  Sale, 
  SaleWithDetails, 
  SalesFilters, 
  CreateSaleRequest, 
  UpdateSaleRequest,
  SalesSummary 
} from '../api/types';

interface SalesState {
  sales: Sale[];
  salesSummary: SalesSummary | null;
  selectedSale: SaleWithDetails | null;
  isLoading: boolean;
  error: string | null;
  filters: SalesFilters;
}

interface SalesActions {
  // Fetch actions
  fetchSales: () => Promise<void>;
  fetchSaleById: (id: number) => Promise<void>;
  fetchSalesSummary: (params?: { dateFrom?: string; dateTo?: string }) => Promise<void>;
  fetchSalesByPatient: (patientId: number) => Promise<void>;
  fetchSalesByQuotation: (quotationId: number) => Promise<void>;
  
  // CRUD actions
  createSale: (sale: CreateSaleRequest) => Promise<void>;
  updateSale: (id: number, sale: UpdateSaleRequest) => Promise<void>;
  deleteSale: (id: number) => Promise<void>;
  
  // Status actions
  completeSale: (id: number) => Promise<void>;
  cancelSale: (id: number, reason?: string) => Promise<void>;
  refundSale: (id: number, reason?: string) => Promise<void>;
  
  // Invoice generation
  generateInvoice: (id: number) => Promise<string | null>;
  
  // State management
  setSelectedSale: (sale: SaleWithDetails | null) => void;
  setFilters: (filters: Partial<SalesFilters>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useSalesStore = create<SalesState & SalesActions>((set, get) => ({
  // State
  sales: [],
  salesSummary: null,
  selectedSale: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    status: null,
    paymentStatus: null,
    patientId: null,
  },

  // Actions
  fetchSales: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const response = await salesApi.getAll(filters);
      set({ sales: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchSaleById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await salesApi.getById(id);
      set({ selectedSale: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchSalesSummary: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await salesApi.getSummary(params);
      set({ salesSummary: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchSalesByPatient: async (patientId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await salesApi.getByPatient(patientId);
      set({ sales: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchSalesByQuotation: async (quotationId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await salesApi.getByQuotation(quotationId);
      set({ sales: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  createSale: async (sale) => {
    set({ isLoading: true, error: null });
    try {
      const response = await salesApi.create(sale);
      set((state) => ({
        sales: [...state.sales, response.data],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updateSale: async (id: number, sale) => {
    set({ isLoading: true, error: null });
    try {
      const response = await salesApi.update(id, sale);
      set((state) => ({
        sales: state.sales.map((s) =>
          s.sale_id === id ? response.data : s
        ),
        selectedSale: state.selectedSale?.sale_id === id ? response.data : state.selectedSale,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  deleteSale: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await salesApi.delete(id);
      set((state) => ({
        sales: state.sales.filter((s) => s.sale_id !== id),
        selectedSale: state.selectedSale?.sale_id === id ? null : state.selectedSale,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  completeSale: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await salesApi.complete(id);
      set((state) => ({
        sales: state.sales.map((s) =>
          s.sale_id === id ? response.data : s
        ),
        selectedSale: state.selectedSale?.sale_id === id ? response.data : state.selectedSale,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  cancelSale: async (id: number, reason?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await salesApi.cancel(id, reason);
      set((state) => ({
        sales: state.sales.map((s) =>
          s.sale_id === id ? response.data : s
        ),
        selectedSale: state.selectedSale?.sale_id === id ? response.data : state.selectedSale,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  refundSale: async (id: number, reason?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await salesApi.refund(id, reason);
      set((state) => ({
        sales: state.sales.map((s) =>
          s.sale_id === id ? response.data : s
        ),
        selectedSale: state.selectedSale?.sale_id === id ? response.data : state.selectedSale,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  generateInvoice: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await salesApi.generateInvoice(id);
      set({ isLoading: false });
      return response.data.pdf_url;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
      return null;
    }
  },

  setSelectedSale: (sale) => {
    set({ selectedSale: sale });
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