import { API_ENDPOINTS } from '../../../config/api';
import { apiClient } from '../../../shared/utils/api-client';
import type { Service, ServiceCategory } from './types';

export interface ServiceApiResponse {
  data: Service[];
  message?: string;
  error?: string;
}

export interface SingleServiceApiResponse {
  data: Service;
  message?: string;
  error?: string;
}

export interface ServiceCategoryApiResponse {
  data: ServiceCategory[];
  message?: string;
  error?: string;
}

export const serviceApi = {
  // Obtener todos los servicios
  getAll: (params?: Record<string, any>): Promise<ServiceApiResponse> => 
    apiClient.get(API_ENDPOINTS.SERVICES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', ''), params),

  // Obtener servicio por ID
  getById: (id: number): Promise<SingleServiceApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.SERVICES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/${id}`),

  // Crear nuevo servicio
  create: (service: Omit<Service, 'service_id' | 'created_at'>): Promise<SingleServiceApiResponse> => 
    apiClient.post(API_ENDPOINTS.SERVICES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', ''), service),

  // Actualizar servicio
  update: (id: number, service: Partial<Service>): Promise<SingleServiceApiResponse> => 
    apiClient.put(`${API_ENDPOINTS.SERVICES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/${id}`, service),

  // Eliminar servicio
  delete: (id: number): Promise<{ data: void; message?: string }> => 
    apiClient.delete(`${API_ENDPOINTS.SERVICES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/${id}`),

  // Obtener categorías de servicios
  getCategories: (): Promise<ServiceCategoryApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.SERVICES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/categories`),

  // Buscar servicios
  search: (query: string): Promise<ServiceApiResponse> => 
    apiClient.get(API_ENDPOINTS.SERVICES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', ''), { search: query }),
}; 