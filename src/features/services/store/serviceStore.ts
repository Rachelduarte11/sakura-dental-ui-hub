import { create } from 'zustand';
import { serviceApi } from '../api/serviceApi';
import type { Service, ServiceCategory, ServiceFilters } from '../api/types';

interface ServiceState {
  services: Service[];
  categories: ServiceCategory[];
  selectedService: Service | null;
  selectedCategory: ServiceCategory | null;
  isLoading: boolean;
  error: string | null;
  filters: ServiceFilters;
}

interface ServiceActions {
  // Fetch actions
  fetchServices: () => Promise<void>;
  fetchServiceById: (id: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchCategoryById: (id: number) => Promise<void>;
  
  // CRUD actions
  createService: (service: Omit<Service, 'service_id' | 'created_at'>) => Promise<void>;
  updateService: (id: number, service: Partial<Service>) => Promise<void>;
  deleteService: (id: number) => Promise<void>;
  
  // Category CRUD actions
  createCategory: (category: Omit<ServiceCategory, 'categorie_service_id'>) => Promise<void>;
  updateCategory: (id: number, category: Partial<ServiceCategory>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  
  // State management
  setSelectedService: (service: Service | null) => void;
  setSelectedCategory: (category: ServiceCategory | null) => void;
  setFilters: (filters: Partial<ServiceFilters>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useServiceStore = create<ServiceState & ServiceActions>((set, get) => ({
  // State
  services: [],
  categories: [],
  selectedService: null,
  selectedCategory: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    categoryId: null,
    status: null,
  },

  // Actions
  fetchServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const response = await serviceApi.getAll(filters);
      set({ services: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchServiceById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await serviceApi.getById(id);
      set({ selectedService: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await serviceApi.getCategories();
      set({ categories: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchCategoryById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      // Implementar cuando el backend lo soporte
      const category = get().categories.find(c => c.categorie_service_id === id);
      set({ selectedCategory: category || null, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  createService: async (service) => {
    set({ isLoading: true, error: null });
    try {
      const response = await serviceApi.create(service);
      set((state) => ({
        services: [...state.services, response.data],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updateService: async (id: number, service) => {
    set({ isLoading: true, error: null });
    try {
      const response = await serviceApi.update(id, service);
      set((state) => ({
        services: state.services.map((s) =>
          s.service_id === id ? response.data : s
        ),
        selectedService: state.selectedService?.service_id === id ? response.data : state.selectedService,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  deleteService: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await serviceApi.delete(id);
      set((state) => ({
        services: state.services.filter((s) => s.service_id !== id),
        selectedService: state.selectedService?.service_id === id ? null : state.selectedService,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  createCategory: async (category) => {
    set({ isLoading: true, error: null });
    try {
      // Implementar cuando el backend lo soporte
      const newCategory: ServiceCategory = {
        categorie_service_id: Math.max(...get().categories.map(c => c.categorie_service_id)) + 1,
        ...category,
      };
      set((state) => ({
        categories: [...state.categories, newCategory],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updateCategory: async (id: number, category) => {
    set({ isLoading: true, error: null });
    try {
      // Implementar cuando el backend lo soporte
      set((state) => ({
        categories: state.categories.map((c) =>
          c.categorie_service_id === id ? { ...c, ...category } : c
        ),
        selectedCategory: state.selectedCategory?.categorie_service_id === id ? { ...state.selectedCategory, ...category } : state.selectedCategory,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  deleteCategory: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      // Implementar cuando el backend lo soporte
      set((state) => ({
        categories: state.categories.filter((c) => c.categorie_service_id !== id),
        selectedCategory: state.selectedCategory?.categorie_service_id === id ? null : state.selectedCategory,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  setSelectedService: (service) => {
    set({ selectedService: service });
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
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