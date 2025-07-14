import { create } from 'zustand';

export interface InventoryItem {
  item_id: number;
  name: string;
  description?: string;
  category: string;
  stock_quantity: number;
  min_stock: number;
  unit_price: number;
  supplier?: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface InventoryCategory {
  category_id: number;
  name: string;
  description?: string;
  status: boolean;
}

interface InventoryState {
  items: InventoryItem[];
  categories: InventoryCategory[];
  selectedItem: InventoryItem | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    category: string | null;
    lowStock: boolean;
  };
}

interface InventoryActions {
  // Fetch actions
  fetchInventoryItems: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchItemById: (id: number) => Promise<void>;
  
  // CRUD actions for inventory items
  createInventoryItem: (item: Omit<InventoryItem, 'item_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateInventoryItem: (id: number, item: Partial<InventoryItem>) => Promise<void>;
  deleteInventoryItem: (id: number) => Promise<void>;
  
  // CRUD actions for categories
  createCategory: (category: Omit<InventoryCategory, 'category_id'>) => Promise<void>;
  updateCategory: (id: number, category: Partial<InventoryCategory>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  
  // Business logic actions
  updateStock: (itemId: number, quantity: number, operation: 'add' | 'subtract') => Promise<void>;
  checkLowStock: () => InventoryItem[];
  
  // State management
  setSelectedItem: (item: InventoryItem | null) => void;
  setFilters: (filters: Partial<InventoryState['filters']>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useInventoryStore = create<InventoryState & InventoryActions>((set, get) => ({
  // State
  items: [],
  categories: [],
  selectedItem: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    category: null,
    lowStock: false,
  },

  // Actions
  fetchInventoryItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.lowStock) params.append('lowStock', 'true');

      const response = await fetch(`/api/inventory?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Error al cargar inventario');
      }
      const data = await response.json();
      set({ items: data, isLoading: false });
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
      const response = await fetch('/api/inventory/categories');
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

  fetchItemById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/inventory/${id}`);
      if (!response.ok) {
        throw new Error('Error al cargar item');
      }
      const data = await response.json();
      set({ selectedItem: data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  createInventoryItem: async (item) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error('Error al crear item');
      }

      const newItem = await response.json();
      set((state) => ({
        items: [...state.items, newItem],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updateInventoryItem: async (id: number, item) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/inventory/${id}`, {
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
        items: state.items.map((i) =>
          i.item_id === id ? updatedItem : i
        ),
        selectedItem: state.selectedItem?.item_id === id ? updatedItem : state.selectedItem,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  deleteInventoryItem: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar item');
      }

      set((state) => ({
        items: state.items.filter((i) => i.item_id !== id),
        selectedItem: state.selectedItem?.item_id === id ? null : state.selectedItem,
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
      const response = await fetch('/api/inventory/categories', {
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
      const response = await fetch(`/api/inventory/categories/${id}`, {
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
          c.category_id === id ? updatedCategory : c
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

  deleteCategory: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/inventory/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar categoría');
      }

      set((state) => ({
        categories: state.categories.filter((c) => c.category_id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updateStock: async (itemId: number, quantity: number, operation: 'add' | 'subtract') => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/inventory/${itemId}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity, operation }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar stock');
      }

      const updatedItem = await response.json();
      set((state) => ({
        items: state.items.map((i) =>
          i.item_id === itemId ? updatedItem : i
        ),
        selectedItem: state.selectedItem?.item_id === itemId ? updatedItem : state.selectedItem,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  checkLowStock: () => {
    const { items } = get();
    return items.filter(item => item.stock_quantity <= item.min_stock);
  },

  setSelectedItem: (item) => {
    set({ selectedItem: item });
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