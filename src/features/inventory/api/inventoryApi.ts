import { API_ENDPOINTS } from '../../../config/api';
import { apiClient } from '../../../shared/utils/api-client';
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
} from './types';

export interface ProductsApiResponse {
  data: Product[];
  message?: string;
  error?: string;
}

export interface SingleProductApiResponse {
  data: ProductWithDetails;
  message?: string;
  error?: string;
}

export interface ProductCategoriesApiResponse {
  data: ProductCategory[];
  message?: string;
  error?: string;
}

export interface InventoryMovementsApiResponse {
  data: InventoryMovement[];
  message?: string;
  error?: string;
}

export interface InventorySummaryApiResponse {
  data: InventorySummary;
  message?: string;
  error?: string;
}

export const inventoryApi = {
  // Obtener todos los productos
  getAllProducts: (params?: InventoryFilters): Promise<ProductsApiResponse> => 
    apiClient.get(API_ENDPOINTS.INVENTORY.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '') + '/products', params),

  // Obtener producto por ID
  getProductById: (id: number): Promise<SingleProductApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.INVENTORY.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/products/${id}`),

  // Crear nuevo producto
  createProduct: (product: CreateProductRequest): Promise<SingleProductApiResponse> => 
    apiClient.post(API_ENDPOINTS.INVENTORY.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '') + '/products', product),

  // Actualizar producto
  updateProduct: (id: number, product: UpdateProductRequest): Promise<SingleProductApiResponse> => 
    apiClient.put(`${API_ENDPOINTS.INVENTORY.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/products/${id}`, product),

  // Eliminar producto
  deleteProduct: (id: number): Promise<{ data: void; message?: string }> => 
    apiClient.delete(`${API_ENDPOINTS.INVENTORY.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/products/${id}`),

  // Obtener categorías de productos
  getCategories: (): Promise<ProductCategoriesApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.INVENTORY.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/categories`),

  // Crear categoría
  createCategory: (category: Omit<ProductCategory, 'category_id'>): Promise<ProductCategoriesApiResponse> => 
    apiClient.post(`${API_ENDPOINTS.INVENTORY.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/categories`, category),

  // Actualizar categoría
  updateCategory: (id: number, category: Partial<ProductCategory>): Promise<ProductCategoriesApiResponse> => 
    apiClient.put(`${API_ENDPOINTS.INVENTORY.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/categories/${id}`, category),

  // Eliminar categoría
  deleteCategory: (id: number): Promise<{ data: void; message?: string }> => 
    apiClient.delete(`${API_ENDPOINTS.INVENTORY.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/categories/${id}`),

  // Obtener movimientos de inventario
  getMovements: (productId?: number): Promise<InventoryMovementsApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.INVENTORY.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/movements`, productId ? { product_id: productId } : undefined),

  // Crear movimiento de inventario
  createMovement: (movement: CreateMovementRequest): Promise<InventoryMovementsApiResponse> => 
    apiClient.post(`${API_ENDPOINTS.INVENTORY.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/movements`, movement),

  // Obtener resumen de inventario
  getSummary: (): Promise<InventorySummaryApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.INVENTORY.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/summary`),

  // Obtener productos con bajo stock
  getLowStockProducts: (): Promise<ProductsApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.INVENTORY.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/products/low-stock`),

  // Obtener productos agotados
  getOutOfStockProducts: (): Promise<ProductsApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.INVENTORY.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/products/out-of-stock`),

  // Obtener productos por categoría
  getProductsByCategory: (categoryId: number): Promise<ProductsApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.INVENTORY.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/products/category/${categoryId}`),

  // Buscar productos
  searchProducts: (query: string): Promise<ProductsApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.INVENTORY.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/products`, { search: query }),

  // Ajustar stock manualmente
  adjustStock: (productId: number, quantity: number, notes?: string): Promise<InventoryMovementsApiResponse> => 
    apiClient.post(`${API_ENDPOINTS.INVENTORY.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/products/${productId}/adjust-stock`, { quantity, notes }),
}; 