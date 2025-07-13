import { create } from 'zustand';
import { serviceApi } from '../api/serviceApi';
import type { Service, ServiceFilters } from '../api/types';

interface ServiceState {
  services: Service[];
  selectedService: Service | null;
  isLoading: boolean;
  error: string | null;
  filters: ServiceFilters;
}

interface ServiceActions {
  fetchServices: () => Promise<void>;
  fetchServiceById: (id: number) => Promise<void>;
  createService: (service: Omit<Service, 'serviceId' | 'createdAt'>) => Promise<void>;
  updateService: (id: number, service: Partial<Service>) => Promise<void>;
  deleteService: (id: number) => Promise<void>;
  setSelectedService: (service: Service | null) => void;
  setFilters: (filters: Partial<ServiceFilters>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useServiceStore = create<ServiceState & ServiceActions>((set, get) => ({
  services: [],
  selectedService: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    categorieServiceId: null,
    status: null,
  },

  fetchServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const response = await serviceApi.getAll(filters);
      set({
        services: (response.data || []).map(s => ({
          ...s,
          categorieServiceId: s.categorieServiceId ?? s.categoryId ?? s.categorie_id ?? s.category_id,
          categoryId: s.categoryId ?? s.categorieServiceId ?? s.categorie_id ?? s.category_id,
          categoryName: s.categoryName ?? s.name ?? '',
        })),
        isLoading: false
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
    }
  },

  fetchServiceById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await serviceApi.getById(id);
      set({ selectedService: response.data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
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
      set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
    }
  },

  updateService: async (id, service) => {
    set({ isLoading: true, error: null });
    try {
      const response = await serviceApi.update(id, service);
      set((state) => ({
        services: state.services.map((s) =>
          s.serviceId === id ? response.data : s
        ),
        selectedService: state.selectedService?.serviceId === id ? response.data : state.selectedService,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
    }
  },

  deleteService: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await serviceApi.delete(id);
      set((state) => ({
        services: state.services.filter((s) => s.serviceId !== id),
        selectedService: state.selectedService?.serviceId === id ? null : state.selectedService,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
    }
  },

  setSelectedService: (service) => {
    set({ selectedService: service });
  },

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
})); 