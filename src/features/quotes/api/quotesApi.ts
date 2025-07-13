import { API_ENDPOINTS } from '../../../config/api';
import { apiClient } from '../../../shared/utils/api-client';
import type { 
  Quote, 
  QuoteWithItems, 
  QuoteFilters, 
  CreateQuoteRequest, 
  UpdateQuoteRequest 
} from './types';

export interface QuotesApiResponse {
  data: Quote[];
  message?: string;
  error?: string;
}

export interface SingleQuoteApiResponse {
  data: QuoteWithItems;
  message?: string;
  error?: string;
}

export const quotesApi = {
  // Obtener todas las cotizaciones
  getAll: (params?: QuoteFilters): Promise<QuotesApiResponse> => 
    apiClient.get(API_ENDPOINTS.QUOTES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', ''), params),

  // Obtener cotización por ID
  getById: (id: number): Promise<SingleQuoteApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.QUOTES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/${id}`),

  // Crear nueva cotización
  create: (quote: CreateQuoteRequest): Promise<SingleQuoteApiResponse> => 
    apiClient.post(API_ENDPOINTS.QUOTES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', ''), quote),

  // Actualizar cotización
  update: (id: number, quote: UpdateQuoteRequest): Promise<SingleQuoteApiResponse> => 
    apiClient.put(`${API_ENDPOINTS.QUOTES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/${id}`, quote),

  // Eliminar cotización
  delete: (id: number): Promise<{ data: void; message?: string }> => 
    apiClient.delete(`${API_ENDPOINTS.QUOTES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/${id}`),

  // Aprobar cotización
  approve: (id: number): Promise<SingleQuoteApiResponse> => 
    apiClient.patch(`${API_ENDPOINTS.QUOTES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/${id}/approve`),

  // Rechazar cotización
  reject: (id: number, reason?: string): Promise<SingleQuoteApiResponse> => 
    apiClient.patch(`${API_ENDPOINTS.QUOTES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/${id}/reject`, { reason }),

  // Completar cotización
  complete: (id: number): Promise<SingleQuoteApiResponse> => 
    apiClient.patch(`${API_ENDPOINTS.QUOTES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/${id}/complete`),

  // Obtener cotizaciones por paciente
  getByPatient: (patientId: number): Promise<QuotesApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.QUOTES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/patient/${patientId}`),

  // Buscar cotizaciones
  search: (query: string): Promise<QuotesApiResponse> => 
    apiClient.get(API_ENDPOINTS.QUOTES.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', ''), { search: query }),
}; 