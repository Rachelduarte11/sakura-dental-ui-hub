import { API_ENDPOINTS } from '../../../config/api';
import { apiClient } from '../../../shared/utils/api-client';
import type { 
  Payment, 
  PaymentWithDetails, 
  PaymentFilters, 
  CreatePaymentRequest, 
  UpdatePaymentRequest,
  PaymentMethod 
} from './types';

export interface PaymentsApiResponse {
  data: Payment[];
  message?: string;
  error?: string;
}

export interface SinglePaymentApiResponse {
  data: PaymentWithDetails;
  message?: string;
  error?: string;
}

export interface PaymentMethodsApiResponse {
  data: PaymentMethod[];
  message?: string;
  error?: string;
}

export const paymentsApi = {
  // Obtener todos los pagos
  getAll: (params?: PaymentFilters): Promise<PaymentsApiResponse> => 
    apiClient.get(API_ENDPOINTS.PAYMENTS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', ''), params),

  // Obtener pago por ID
  getById: (id: number): Promise<SinglePaymentApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.PAYMENTS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/${id}`),

  // Crear nuevo pago
  create: (payment: CreatePaymentRequest): Promise<SinglePaymentApiResponse> => 
    apiClient.post(API_ENDPOINTS.PAYMENTS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', ''), payment),

  // Actualizar pago
  update: (id: number, payment: UpdatePaymentRequest): Promise<SinglePaymentApiResponse> => 
    apiClient.put(`${API_ENDPOINTS.PAYMENTS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/${id}`, payment),

  // Eliminar pago
  delete: (id: number): Promise<{ data: void; message?: string }> => 
    apiClient.delete(`${API_ENDPOINTS.PAYMENTS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/${id}`),

  // Obtener métodos de pago
  getPaymentMethods: (): Promise<PaymentMethodsApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.PAYMENTS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/methods`),

  // Obtener pagos por cotización
  getByQuotation: (quotationId: number): Promise<PaymentsApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.PAYMENTS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/quotation/${quotationId}`),

  // Obtener pagos por paciente
  getByPatient: (patientId: number): Promise<PaymentsApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.PAYMENTS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/patient/${patientId}`),

  // Procesar pago
  processPayment: (payment: CreatePaymentRequest): Promise<SinglePaymentApiResponse> => 
    apiClient.post(`${API_ENDPOINTS.PAYMENTS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/process`, payment),

  // Reembolsar pago
  refundPayment: (id: number, reason?: string): Promise<SinglePaymentApiResponse> => 
    apiClient.post(`${API_ENDPOINTS.PAYMENTS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/${id}/refund`, { reason }),

  // Buscar pagos
  search: (query: string): Promise<PaymentsApiResponse> => 
    apiClient.get(API_ENDPOINTS.PAYMENTS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', ''), { search: query }),
}; 