import { create } from 'zustand';
import { inventoryApi } from '../api/inventoryApi';
import type { 
  Product, 
  ProductWithDetails, 
  ProductCategory,
  InventoryMovement,
  InventoryFilters, 
  CreateProductRequest, 
  UpdateProductRequest,
  CreateMovementRequest,
  InventorySummary 
} from '../api/types';

interface InventoryState {
  products: Product[];
  categories: ProductCategory[];
  movements: InventoryMovement[];
  inventorySummary: InventorySummary | null;
  selectedProduct: ProductWithDetails | null;
  isLoading: boolean;
  error: string | null;
  filters: InventoryFilters;
}

interface InventoryActions {
  // Fetch actions
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchMovements: (productId?: number) => Promise<void>;
  fetchInventorySummary: () => Promise<void>;
  fetchLowStockProducts: () => Promise<void>;
  fetchOutOfStockProducts: () => Promise<void>;
  fetchProductsByCategory: (categoryId: number) => Promise<void>;
  
  // Product CRUD actions
  createProduct: (product: CreateProductRequest) => Promise<void>;
  updateProduct: (id: number, product: UpdateProductRequest) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  
  // Category CRUD actions
  createCategory: (category: Omit<ProductCategory, 'category_id'>) => Promise<void>;
  updateCategory: (id: number, category: Partial<ProductCategory>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  
  // Movement actions
  createMovement: (movement: CreateMovementRequest) => Promise<void>;
  adjustStock: (productId: number, quantity: number, notes?: string) => Promise<void>;
  
  // State management
  setSelectedProduct: (product: ProductWithDetails | null) => void;
  setFilters: (filters: Partial<InventoryFilters>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useInventoryStore = create<InventoryState & InventoryActions>((set, get) => ({
  // State
  products: [],
  categories: [],
  movements: [],
  inventorySummary: null,
  selectedProduct: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    categoryId: null,
    status: null,
    lowStock: null,
    outOfStock: null,
  },

  // Actions
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const response = await inventoryApi.getAllProducts(filters);
      set({ products: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchProductById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await inventoryApi.getProductById(id);
      set({ selectedProduct: response.data, isLoading: false });
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
      const response = await inventoryApi.getCategories();
      set({ categories: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchMovements: async (productId?: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await inventoryApi.getMovements(productId);
      set({ movements: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchInventorySummary: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await inventoryApi.getSummary();
      set({ inventorySummary: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchLowStockProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await inventoryApi.getLowStockProducts();
      set({ products: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchOutOfStockProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await inventoryApi.getOutOfStockProducts();
      set({ products: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchProductsByCategory: async (categoryId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await inventoryApi.getProductsByCategory(categoryId);
      set({ products: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  createProduct: async (product) => {
    set({ isLoading: true, error: null });
    try {
      const response = await inventoryApi.createProduct(product);
      set((state) => ({
        products: [...state.products, response.data],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updateProduct: async (id: number, product) => {
    set({ isLoading: true, error: null });
    try {
      const response = await inventoryApi.updateProduct(id, product);
      set((state) => ({
        products: state.products.map((p) =>
          p.product_id === id ? response.data : p
        ),
        selectedProduct: state.selectedProduct?.product_id === id ? response.data : state.selectedProduct,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  deleteProduct: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await inventoryApi.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p.product_id !== id),
        selectedProduct: state.selectedProduct?.product_id === id ? null : state.selectedProduct,
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
      const response = await inventoryApi.createCategory(category);
      set((state) => ({
        categories: [...state.categories, response.data[0]],
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
      const response = await inventoryApi.updateCategory(id, category);
      set((state) => ({
        categories: state.categories.map((c) =>
          c.category_id === id ? { ...c, ...category } : c
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
      await inventoryApi.deleteCategory(id);
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

  createMovement: async (movement) => {
    set({ isLoading: true, error: null });
    try {
      const response = await inventoryApi.createMovement(movement);
      set((state) => ({
        movements: [...state.movements, response.data[0]],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  adjustStock: async (productId: number, quantity: number, notes?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await inventoryApi.adjustStock(productId, quantity, notes);
      set((state) => ({
        movements: [...state.movements, response.data[0]],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  setSelectedProduct: (product) => {
    set({ selectedProduct: product });
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