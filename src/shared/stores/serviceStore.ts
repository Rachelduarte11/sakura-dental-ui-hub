import { create } from 'zustand';

export interface Service {
  service_id: number;
  name: string;
  description?: string;
  base_price: number;
  status: boolean;
  categorie_service_id: number;
}

export interface CategoryService {
  categorie_service_id: number;
  name: string;
  description?: string;
  status: boolean;
}

interface ServiceState {
  services: Service[];
  categories: CategoryService[];
  selectedService: Service | null;
  selectedCategory: CategoryService | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    categoryId: number | null;
    status: boolean | null;
  };
}

interface ServiceActions {
  // Fetch actions
  fetchServices: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchServiceById: (id: number) => Promise<void>;
  fetchCategoryById: (id: number) => Promise<void>;
  
  // CRUD actions for services
  createService: (service: Omit<Service, 'service_id'>) => Promise<void>;
  updateService: (id: number, service: Partial<Service>) => Promise<void>;
  deleteService: (id: number) => Promise<void>;
  
  // CRUD actions for categories
  createCategory: (category: Omit<CategoryService, 'categorie_service_id'>) => Promise<void>;
  updateCategory: (id: number, category: Partial<CategoryService>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  
  // State management
  setSelectedService: (service: Service | null) => void;
  setSelectedCategory: (category: CategoryService | null) => void;
  setFilters: (filters: Partial<ServiceState['filters']>) => void;
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
      const response = await fetch('/api/services');
      if (!response.ok) {
        throw new Error('Error al cargar servicios');
      }
      const data = await response.json();
      set({ services: data, isLoading: false });
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
      const response = await fetch('/api/services/categories');
      if (!response.ok) {
        throw new Error('Error al cargar categorías');
      }
      const data = await response.json();
      set({ categories: data, isLoading: false });
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
      const response = await fetch(`/api/services/${id}`);
      if (!response.ok) {
        throw new Error('Error al cargar servicio');
      }
      const data = await response.json();
      set({ selectedService: data, isLoading: false });
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
      const response = await fetch(`/api/services/categories/${id}`);
      if (!response.ok) {
        throw new Error('Error al cargar categoría');
      }
      const data = await response.json();
      set({ selectedCategory: data, isLoading: false });
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
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(service),
      });

      if (!response.ok) {
        throw new Error('Error al crear servicio');
      }

      const newService = await response.json();
      set((state) => ({
        services: [...state.services, newService],
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
      const response = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(service),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar servicio');
      }

      const updatedService = await response.json();
      set((state) => ({
        services: state.services.map((s) =>
          s.service_id === id ? updatedService : s
        ),
        selectedService: state.selectedService?.service_id === id ? updatedService : state.selectedService,
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
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar servicio');
      }

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
      const response = await fetch('/api/services/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        throw new Error('Error al crear categoría');
      }

      const newCategory = await response.json();
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
      const response = await fetch(`/api/services/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar categoría');
      }

      const updatedCategory = await response.json();
      set((state) => ({
        categories: state.categories.map((c) =>
          c.categorie_service_id === id ? updatedCategory : c
        ),
        selectedCategory: state.selectedCategory?.categorie_service_id === id ? updatedCategory : state.selectedCategory,
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
      const response = await fetch(`/api/services/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar categoría');
      }

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