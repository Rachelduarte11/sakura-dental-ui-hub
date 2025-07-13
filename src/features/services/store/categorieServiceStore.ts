import { create } from 'zustand';
import { apiClient } from '@/shared/utils/api-client';

export interface CategorieService {
  categorieServiceId: number;
  name: string;
  description: string;
  status: boolean;
}

interface CategorieServiceState {
  categories: CategorieService[];
  isLoading: boolean;
  error: string | null;
}

interface CategorieServiceActions {
  fetchCategories: () => Promise<void>;
  createCategory: (category: Omit<CategorieService, 'categorieServiceId'>) => Promise<void>;
  updateCategory: (id: number, category: Partial<CategorieService>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useCategorieServiceStore = create<CategorieServiceState & CategorieServiceActions>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await apiClient.get('/api/categories');
      set({ categories: data as CategorieService[], isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
    }
  },

  createCategory: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const { data: newCategory } = await apiClient.post('/api/categories', category);
      set((state) => ({ categories: [...state.categories, newCategory as CategorieService], isLoading: false }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
    }
  },

  updateCategory: async (id, category) => {
    set({ isLoading: true, error: null });
    try {
      const { data: updatedCategory } = await apiClient.put(`/api/categories/${id}`, category);
      set((state) => ({
        categories: state.categories.map((c) => c.categorieServiceId === id ? updatedCategory as CategorieService : c),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/api/categories/${id}`);
      set((state) => ({
        categories: state.categories.filter((c) => c.categorieServiceId !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
})); 