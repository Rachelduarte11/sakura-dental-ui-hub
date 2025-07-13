import { create } from 'zustand';
import { quotesApi } from '../api/quotesApi';
import type { Quote, QuoteWithItems, QuoteFilters, CreateQuoteRequest, UpdateQuoteRequest } from '../api/types';

interface QuotesState {
  quotes: Quote[];
  selectedQuote: QuoteWithItems | null;
  isLoading: boolean;
  error: string | null;
  filters: QuoteFilters;
}

interface QuotesActions {
  // Fetch actions
  fetchQuotes: () => Promise<void>;
  fetchQuoteById: (id: number) => Promise<void>;
  fetchQuotesByPatient: (patientId: number) => Promise<void>;
  
  // CRUD actions
  createQuote: (quote: CreateQuoteRequest) => Promise<void>;
  updateQuote: (id: number, quote: UpdateQuoteRequest) => Promise<void>;
  deleteQuote: (id: number) => Promise<void>;
  
  // Status actions
  approveQuote: (id: number) => Promise<void>;
  rejectQuote: (id: number, reason?: string) => Promise<void>;
  completeQuote: (id: number) => Promise<void>;
  
  // State management
  setSelectedQuote: (quote: QuoteWithItems | null) => void;
  setFilters: (filters: Partial<QuoteFilters>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useQuotesStore = create<QuotesState & QuotesActions>((set, get) => ({
  // State
  quotes: [],
  selectedQuote: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    status: null,
    patientId: null,
  },

  // Actions
  fetchQuotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const response = await quotesApi.getAll(filters);
      set({ quotes: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchQuoteById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await quotesApi.getById(id);
      set({ selectedQuote: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchQuotesByPatient: async (patientId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await quotesApi.getByPatient(patientId);
      set({ quotes: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  createQuote: async (quote) => {
    set({ isLoading: true, error: null });
    try {
      const response = await quotesApi.create(quote);
      set((state) => ({
        quotes: [...state.quotes, response.data],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updateQuote: async (id: number, quote) => {
    set({ isLoading: true, error: null });
    try {
      const response = await quotesApi.update(id, quote);
      set((state) => ({
        quotes: state.quotes.map((q) =>
          q.quotation_id === id ? response.data : q
        ),
        selectedQuote: state.selectedQuote?.quotation_id === id ? response.data : state.selectedQuote,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  deleteQuote: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await quotesApi.delete(id);
      set((state) => ({
        quotes: state.quotes.filter((q) => q.quotation_id !== id),
        selectedQuote: state.selectedQuote?.quotation_id === id ? null : state.selectedQuote,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  approveQuote: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await quotesApi.approve(id);
      set((state) => ({
        quotes: state.quotes.map((q) =>
          q.quotation_id === id ? response.data : q
        ),
        selectedQuote: state.selectedQuote?.quotation_id === id ? response.data : state.selectedQuote,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  rejectQuote: async (id: number, reason?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await quotesApi.reject(id, reason);
      set((state) => ({
        quotes: state.quotes.map((q) =>
          q.quotation_id === id ? response.data : q
        ),
        selectedQuote: state.selectedQuote?.quotation_id === id ? response.data : state.selectedQuote,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  completeQuote: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await quotesApi.complete(id);
      set((state) => ({
        quotes: state.quotes.map((q) =>
          q.quotation_id === id ? response.data : q
        ),
        selectedQuote: state.selectedQuote?.quotation_id === id ? response.data : state.selectedQuote,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  setSelectedQuote: (quote) => {
    set({ selectedQuote: quote });
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