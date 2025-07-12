import { create } from 'zustand';

export interface QuotationItem {
  item_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  quotation_id: number;
  service_id: number;
  service?: {
    name: string;
    description?: string;
  };
}

export interface Quotation {
  quotation_id: number;
  created_at: string;
  status: 'PENDIENTE' | 'ACEPTADA' | 'PAGADA' | 'ANULADA';
  total_amount: number;
  history_id?: number;
  patient_id: number;
  patient?: {
    first_name: string;
    last_name: string;
    email?: string;
  };
  items?: QuotationItem[];
}

export interface ClinicalHistory {
  history_id: number;
  created_at: string;
  notes?: string;
  patient_id: number;
}

interface QuotationState {
  quotations: Quotation[];
  selectedQuotation: Quotation | null;
  clinicalHistories: ClinicalHistory[];
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    status: Quotation['status'] | null;
    patientId: number | null;
    dateFrom: string | null;
    dateTo: string | null;
  };
}

interface QuotationActions {
  // Fetch actions
  fetchQuotations: () => Promise<void>;
  fetchQuotationById: (id: number) => Promise<void>;
  fetchClinicalHistories: (patientId: number) => Promise<void>;
  
  // CRUD actions for quotations
  createQuotation: (quotation: Omit<Quotation, 'quotation_id' | 'created_at'>) => Promise<void>;
  updateQuotation: (id: number, quotation: Partial<Quotation>) => Promise<void>;
  deleteQuotation: (id: number) => Promise<void>;
  
  // CRUD actions for quotation items
  addQuotationItem: (quotationId: number, item: Omit<QuotationItem, 'item_id' | 'quotation_id' | 'subtotal'>) => Promise<void>;
  updateQuotationItem: (quotationId: number, itemId: number, item: Partial<QuotationItem>) => Promise<void>;
  removeQuotationItem: (quotationId: number, itemId: number) => Promise<void>;
  
  // CRUD actions for clinical histories
  createClinicalHistory: (history: Omit<ClinicalHistory, 'history_id' | 'created_at'>) => Promise<void>;
  updateClinicalHistory: (id: number, history: Partial<ClinicalHistory>) => Promise<void>;
  
  // Business logic actions
  calculateQuotationTotal: (quotationId: number) => Promise<void>;
  changeQuotationStatus: (quotationId: number, status: Quotation['status']) => Promise<void>;
  
  // State management
  setSelectedQuotation: (quotation: Quotation | null) => void;
  setFilters: (filters: Partial<QuotationState['filters']>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useQuotationStore = create<QuotationState & QuotationActions>((set, get) => ({
  // State
  quotations: [],
  selectedQuotation: null,
  clinicalHistories: [],
  isLoading: false,
  error: null,
  filters: {
    search: '',
    status: null,
    patientId: null,
    dateFrom: null,
    dateTo: null,
  },

  // Actions
  fetchQuotations: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.patientId) params.append('patientId', filters.patientId.toString());
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);

      const response = await fetch(`/api/quotations?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Error al cargar cotizaciones');
      }
      const data = await response.json();
      set({ quotations: data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchQuotationById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/quotations/${id}`);
      if (!response.ok) {
        throw new Error('Error al cargar cotización');
      }
      const data = await response.json();
      set({ selectedQuotation: data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchClinicalHistories: async (patientId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/patients/${patientId}/histories`);
      if (!response.ok) {
        throw new Error('Error al cargar historias clínicas');
      }
      const data = await response.json();
      set({ clinicalHistories: data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  createQuotation: async (quotation) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/quotations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quotation),
      });

      if (!response.ok) {
        throw new Error('Error al crear cotización');
      }

      const newQuotation = await response.json();
      set((state) => ({
        quotations: [...state.quotations, newQuotation],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updateQuotation: async (id: number, quotation) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/quotations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quotation),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar cotización');
      }

      const updatedQuotation = await response.json();
      set((state) => ({
        quotations: state.quotations.map((q) =>
          q.quotation_id === id ? updatedQuotation : q
        ),
        selectedQuotation: state.selectedQuotation?.quotation_id === id ? updatedQuotation : state.selectedQuotation,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  deleteQuotation: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/quotations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar cotización');
      }

      set((state) => ({
        quotations: state.quotations.filter((q) => q.quotation_id !== id),
        selectedQuotation: state.selectedQuotation?.quotation_id === id ? null : state.selectedQuotation,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  addQuotationItem: async (quotationId: number, item) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/quotations/${quotationId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error('Error al agregar item');
      }

      const newItem = await response.json();
      set((state) => ({
        quotations: state.quotations.map((q) =>
          q.quotation_id === quotationId
            ? { ...q, items: [...(q.items || []), newItem] }
            : q
        ),
        selectedQuotation: state.selectedQuotation?.quotation_id === quotationId
          ? { ...state.selectedQuotation, items: [...(state.selectedQuotation.items || []), newItem] }
          : state.selectedQuotation,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updateQuotationItem: async (quotationId: number, itemId: number, item) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/quotations/${quotationId}/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar item');
      }

      const updatedItem = await response.json();
      set((state) => ({
        quotations: state.quotations.map((q) =>
          q.quotation_id === quotationId
            ? {
                ...q,
                items: q.items?.map((i) => (i.item_id === itemId ? updatedItem : i)),
              }
            : q
        ),
        selectedQuotation: state.selectedQuotation?.quotation_id === quotationId
          ? {
              ...state.selectedQuotation,
              items: state.selectedQuotation.items?.map((i) => (i.item_id === itemId ? updatedItem : i)),
            }
          : state.selectedQuotation,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  removeQuotationItem: async (quotationId: number, itemId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/quotations/${quotationId}/items/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar item');
      }

      set((state) => ({
        quotations: state.quotations.map((q) =>
          q.quotation_id === quotationId
            ? {
                ...q,
                items: q.items?.filter((i) => i.item_id !== itemId),
              }
            : q
        ),
        selectedQuotation: state.selectedQuotation?.quotation_id === quotationId
          ? {
              ...state.selectedQuotation,
              items: state.selectedQuotation.items?.filter((i) => i.item_id !== itemId),
            }
          : state.selectedQuotation,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  createClinicalHistory: async (history) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/clinical-histories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(history),
      });

      if (!response.ok) {
        throw new Error('Error al crear historia clínica');
      }

      const newHistory = await response.json();
      set((state) => ({
        clinicalHistories: [...state.clinicalHistories, newHistory],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updateClinicalHistory: async (id: number, history) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/clinical-histories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(history),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar historia clínica');
      }

      const updatedHistory = await response.json();
      set((state) => ({
        clinicalHistories: state.clinicalHistories.map((h) =>
          h.history_id === id ? updatedHistory : h
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

  calculateQuotationTotal: async (quotationId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/quotations/${quotationId}/calculate-total`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Error al calcular total');
      }

      const { total_amount } = await response.json();
      set((state) => ({
        quotations: state.quotations.map((q) =>
          q.quotation_id === quotationId ? { ...q, total_amount } : q
        ),
        selectedQuotation: state.selectedQuotation?.quotation_id === quotationId
          ? { ...state.selectedQuotation, total_amount }
          : state.selectedQuotation,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  changeQuotationStatus: async (quotationId: number, status: Quotation['status']) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/quotations/${quotationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Error al cambiar estado');
      }

      const updatedQuotation = await response.json();
      set((state) => ({
        quotations: state.quotations.map((q) =>
          q.quotation_id === quotationId ? updatedQuotation : q
        ),
        selectedQuotation: state.selectedQuotation?.quotation_id === quotationId ? updatedQuotation : state.selectedQuotation,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  setSelectedQuotation: (quotation) => {
    set({ selectedQuotation: quotation });
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