import { API_ENDPOINTS } from '../../../config/api';
import { apiClient } from '../../../shared/utils/api-client';
import type { 
  Sale, 
  SaleWithDetails, 
  SalesFilters, 
  CreateSaleRequest, 
  UpdateSaleRequest,
  SalesSummary 
} from './types';

export interface SalesApiResponse {
  data: Sale[];
  message?: string;
  error?: string;
}

export interface SingleSaleApiResponse {
  data: SaleWithDetails;
  message?: string;
  error?: string;
}

export interface SalesSummaryApiResponse {
  data: SalesSummary;
  message?: string;
  error?: string;
}

export const salesApi = {
  // Obtener todas las ventas
  getAll: (params?: SalesFilters): Promise<SalesApiResponse> => 
    apiClient.get(API_ENDPOINTS.SALES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', ''), params),

  // Obtener venta por ID
  getById: (id: number): Promise<SingleSaleApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.SALES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/${id}`),

  // Crear nueva venta
  create: (sale: CreateSaleRequest): Promise<SingleSaleApiResponse> => 
    apiClient.post(API_ENDPOINTS.SALES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', ''), sale),

  // Actualizar venta
  update: (id: number, sale: UpdateSaleRequest): Promise<SingleSaleApiResponse> => 
    apiClient.put(`${API_ENDPOINTS.SALES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/${id}`, sale),

  // Eliminar venta
  delete: (id: number): Promise<{ data: void; message?: string }> => 
    apiClient.delete(`${API_ENDPOINTS.SALES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/${id}`),

  // Completar venta
  complete: (id: number): Promise<SingleSaleApiResponse> => 
    apiClient.patch(`${API_ENDPOINTS.SALES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/${id}/complete`),

  // Cancelar venta
  cancel: (id: number, reason?: string): Promise<SingleSaleApiResponse> => 
    apiClient.patch(`${API_ENDPOINTS.SALES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/${id}/cancel`, { reason }),

  // Reembolsar venta
  refund: (id: number, reason?: string): Promise<SingleSaleApiResponse> => 
    apiClient.patch(`${API_ENDPOINTS.SALES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/${id}/refund`, { reason }),

  // Obtener resumen de ventas
  getSummary: (params?: { dateFrom?: string; dateTo?: string }): Promise<SalesSummaryApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.SALES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/summary`, params),

  // Obtener ventas por paciente
  getByPatient: (patientId: number): Promise<SalesApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.SALES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/patient/${patientId}`),

  // Obtener ventas por cotización
  getByQuotation: (quotationId: number): Promise<SalesApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.SALES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/quotation/${quotationId}`),

  // Generar factura
  generateInvoice: (id: number): Promise<{ data: { pdf_url: string }; message?: string }> => 
    apiClient.post(`${API_ENDPOINTS.SALES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/${id}/invoice`),

  // Buscar ventas
  search: (query: string): Promise<SalesApiResponse> => 
    apiClient.get(API_ENDPOINTS.SALES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', ''), { search: query }),
}; 