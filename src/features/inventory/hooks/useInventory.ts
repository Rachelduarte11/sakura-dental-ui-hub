import { useCallback, useEffect } from 'react';
import { useInventoryStore } from '../store/inventoryStore';
import type { 
  CreateProductRequest, 
  UpdateProductRequest,
  CreateMovementRequest,
  InventoryFilters 
} from '../api/types';

export const useInventory = () => {
  const {
    products,
    categories,
    movements,
    inventorySummary,
    selectedProduct,
    isLoading,
    error,
    filters,
    fetchProducts,
    fetchProductById,
    fetchCategories,
    fetchMovements,
    fetchInventorySummary,
    fetchLowStockProducts,
    fetchOutOfStockProducts,
    fetchProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    updateCategory,
    deleteCategory,
    createMovement,
    adjustStock,
    setSelectedProduct,
    setFilters,
    clearError,
    setLoading,
  } = useInventoryStore();

  // Computed values
  const lowStockProducts = products.filter(
    (product) => product.stock_quantity <= product.min_stock_level
  );

  const outOfStockProducts = products.filter(
    (product) => product.stock_quantity === 0
  );

  const activeProducts = products.filter((product) => product.status);

  const totalStockValue = products.reduce(
    (total, product) => total + (product.stock_quantity * product.unit_price),
    0
  );

  const totalCostValue = products.reduce(
    (total, product) => total + (product.stock_quantity * product.cost_price),
    0
  );

  const profitMargin = totalStockValue - totalCostValue;

  // Enhanced actions with error handling
  const handleCreateProduct = useCallback(
    async (product: CreateProductRequest) => {
      try {
        await createProduct(product);
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
      }
    },
    [createProduct]
  );

  const handleUpdateProduct = useCallback(
    async (id: number, product: UpdateProductRequest) => {
      try {
        await updateProduct(id, product);
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
      }
    },
    [updateProduct]
  );

  const handleDeleteProduct = useCallback(
    async (id: number) => {
      try {
        await deleteProduct(id);
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
      }
    },
    [deleteProduct]
  );

  const handleCreateCategory = useCallback(
    async (category: Omit<import('../api/types').ProductCategory, 'category_id'>) => {
      try {
        await createCategory(category);
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
      }
    },
    [createCategory]
  );

  const handleUpdateCategory = useCallback(
    async (id: number, category: Partial<import('../api/types').ProductCategory>) => {
      try {
        await updateCategory(id, category);
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
      }
    },
    [updateCategory]
  );

  const handleDeleteCategory = useCallback(
    async (id: number) => {
      try {
        await deleteCategory(id);
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
      }
    },
    [deleteCategory]
  );

  const handleCreateMovement = useCallback(
    async (movement: CreateMovementRequest) => {
      try {
        await createMovement(movement);
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
      }
    },
    [createMovement]
  );

  const handleAdjustStock = useCallback(
    async (productId: number, quantity: number, notes?: string) => {
      try {
        await adjustStock(productId, quantity, notes);
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
      }
    },
    [adjustStock]
  );

  // Filter actions
  const handleSearchProducts = useCallback(
    (search: string) => {
      setFilters({ search });
    },
    [setFilters]
  );

  const handleFilterByCategory = useCallback(
    (categoryId: number | null) => {
      setFilters({ categoryId });
    },
    [setFilters]
  );

  const handleFilterByStatus = useCallback(
    (status: boolean | null) => {
      setFilters({ status });
    },
    [setFilters]
  );

  const handleFilterByStock = useCallback(
    (lowStock: boolean | null, outOfStock: boolean | null) => {
      setFilters({ lowStock, outOfStock });
    },
    [setFilters]
  );

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      categoryId: null,
      status: null,
      lowStock: null,
      outOfStock: null,
    });
  }, [setFilters]);

  // Auto-refresh data when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters, fetchProducts]);

  return {
    // State
    products,
    categories,
    movements,
    inventorySummary,
    selectedProduct,
    isLoading,
    error,
    filters,
    
    // Computed values
    lowStockProducts,
    outOfStockProducts,
    activeProducts,
    totalStockValue,
    totalCostValue,
    profitMargin,
    
    // Actions
    fetchProducts,
    fetchProductById,
    fetchCategories,
    fetchMovements,
    fetchInventorySummary,
    fetchLowStockProducts,
    fetchOutOfStockProducts,
    fetchProductsByCategory,
    
    // Enhanced actions
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleCreateMovement,
    handleAdjustStock,
    
    // Filter actions
    handleSearchProducts,
    handleFilterByCategory,
    handleFilterByStatus,
    handleFilterByStock,
    clearFilters,
    
    // State management
    setSelectedProduct,
    setFilters,
    clearError,
    setLoading,
  };
}; 