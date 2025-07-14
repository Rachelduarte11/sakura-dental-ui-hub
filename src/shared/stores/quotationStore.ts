import { create } from 'zustand';
import { quotationsApi } from '../utils/api-client';

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
  
  // State management
  setSelectedQuotation: (quotation: Quotation | null) => void;
  setFilters: (filters: Partial<QuotationState['filters']>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  getQuotationDetail: (quotationId: number) => Promise<any>;
}

// Mock data para desarrollo
const mockQuotations: Quotation[] = [
  {
    quotation_id: 1,
    created_at: '2024-01-15T10:30:00Z',
    status: 'PENDIENTE',
    total_amount: 1500.00,
    patient_id: 1,
    patient: {
      first_name: 'Juan',
      last_name: 'Pérez',
      email: 'juan.perez@email.com'
    },
    items: [
      {
        item_id: 1,
        quantity: 1,
        unit_price: 800.00,
        subtotal: 800.00,
        quotation_id: 1,
        service_id: 1,
        service: {
          name: 'Limpieza Dental',
          description: 'Limpieza profesional completa'
        }
      },
      {
        item_id: 2,
        quantity: 1,
        unit_price: 700.00,
        subtotal: 700.00,
        quotation_id: 1,
        service_id: 2,
        service: {
          name: 'Consulta General',
          description: 'Consulta odontológica general'
        }
      }
    ]
  },
  {
    quotation_id: 2,
    created_at: '2024-01-16T14:20:00Z',
    status: 'ACEPTADA',
    total_amount: 2500.00,
    patient_id: 2,
    patient: {
      first_name: 'María',
      last_name: 'García',
      email: 'maria.garcia@email.com'
    },
    items: [
      {
        item_id: 3,
        quantity: 1,
        unit_price: 2500.00,
        subtotal: 2500.00,
        quotation_id: 2,
        service_id: 3,
        service: {
          name: 'Ortodoncia',
          description: 'Tratamiento de ortodoncia completo'
        }
      }
    ]
  }
];

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
      // Petición real al backend
      const response = await fetch('http://localhost:8080/api/quotations');
      const data = await response.json();

      // Mapeo de camelCase a snake_case
      const quotations = data.map((q: any) => ({
        quotation_id: q.quotationId,
        created_at: q.createdAt,
        status: q.status,
        total_amount: q.totalAmount,
        history_id: q.historyId,
        patient_id: q.patientId,
        items: q.items?.map((item: any) => ({
          item_id: item.itemId,
          service_id: item.serviceId,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          subtotal: item.subtotal,
          service_name: item.serviceName,
          service_description: item.serviceDescription,
        })) || [],
      }));

      set({ quotations, isLoading: false });
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
      // Por ahora usamos datos mock
      // const response = await quotationsApi.getById(id);
      // set({ selectedQuotation: response.data, isLoading: false });
      
      await new Promise(resolve => setTimeout(resolve, 300));
      const quotation = mockQuotations.find(q => q.quotation_id === id);
      if (quotation) {
        set({ selectedQuotation: quotation, isLoading: false });
      } else {
        throw new Error('Cotización no encontrada');
      }
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
      // TODO: Implementar cuando tengamos el endpoint de historias clínicas
      await new Promise(resolve => setTimeout(resolve, 200));
      set({ clinicalHistories: [], isLoading: false });
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
      // Por ahora simulamos la creación
      // const response = await quotationsApi.create(quotation);
      // set((state) => ({
      //   quotations: [...state.quotations, response.data],
      //   isLoading: false,
      // }));
      
      await new Promise(resolve => setTimeout(resolve, 500));
      const newQuotation: Quotation = {
        ...quotation,
        quotation_id: Math.max(...mockQuotations.map(q => q.quotation_id)) + 1,
        created_at: new Date().toISOString(),
      };
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
      // Por ahora simulamos la actualización
      // const response = await quotationsApi.update(id, quotation);
      // set((state) => ({
      //   quotations: state.quotations.map(q => 
      //     q.quotation_id === id ? response.data : q
      //   ),
      //   isLoading: false,
      // }));
      
      await new Promise(resolve => setTimeout(resolve, 400));
      set((state) => ({
        quotations: state.quotations.map(q => 
          q.quotation_id === id ? { ...q, ...quotation } : q
        ),
        selectedQuotation: state.selectedQuotation?.quotation_id === id 
          ? { ...state.selectedQuotation, ...quotation }
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

  deleteQuotation: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      // Por ahora simulamos la eliminación
      // await quotationsApi.delete(id);
      // set((state) => ({
      //   quotations: state.quotations.filter(q => q.quotation_id !== id),
      //   selectedQuotation: state.selectedQuotation?.quotation_id === id ? null : state.selectedQuotation,
      //   isLoading: false,
      // }));
      
      await new Promise(resolve => setTimeout(resolve, 300));
      set((state) => ({
        quotations: state.quotations.filter(q => q.quotation_id !== id),
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

  // Método para obtener el detalle de pagos de una cotización
  getQuotationDetail: async (quotationId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/quotations/${quotationId}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo obtener el detalle de la cotización`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching quotation detail:', error);
      throw error;
    }
  },

  // State management
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

  // Método para obtener el detalle de pagos de una cotización
  getQuotationDetail: async (quotationId: number) => {
    const res = await fetch(`http://localhost:8080/api/quotations/${quotationId}`);
    if (!res.ok) throw new Error('No se pudo obtener el detalle de la cotización');
    return await res.json();
  },
})); 