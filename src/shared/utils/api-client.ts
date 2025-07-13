import { useAuthStore } from '../stores/authStore';

// Configuración del cliente API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  error?: string;
}

interface ApiError {
  message: string;
  status: number;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Obtener token del store de autenticación
    const token = useAuthStore.getState().token;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Manejar errores de autenticación
        if (response.status === 401) {
          useAuthStore.getState().logout();
          throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Error de conexión');
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

// Instancia global del cliente API
export const apiClient = new ApiClient(API_BASE_URL);

// Hooks para usar el cliente API
export const useApiClient = () => apiClient;

// Funciones helper para endpoints específicos
export const authApi = {
  login: (email: string, password: string) => 
    apiClient.post('/auth/login', { email, password }),
  logout: () => apiClient.post('/auth/logout'),
  refreshToken: () => apiClient.post('/auth/refresh'),
};

export const patientsApi = {
  getAll: (params?: Record<string, any>) => apiClient.get('/patients', params),
  getById: (id: number) => apiClient.get(`/patients/${id}`),
  create: (patient: any) => apiClient.post('/patients', patient),
  update: (id: number, patient: any) => apiClient.put(`/patients/${id}`, patient),
  delete: (id: number) => apiClient.delete(`/patients/${id}`),
};

export const servicesApi = {
  getAll: (params?: Record<string, any>) => apiClient.get('/services', params),
  getById: (id: number) => apiClient.get(`/services/${id}`),
  create: (service: any) => apiClient.post('/services', service),
  update: (id: number, service: any) => apiClient.put(`/services/${id}`, service),
  delete: (id: number) => apiClient.delete(`/services/${id}`),
  getCategories: () => apiClient.get('/services/categories'),
};

export const quotationsApi = {
  getAll: (params?: Record<string, any>) => apiClient.get('/quotations', params),
  getById: (id: number) => apiClient.get(`/quotations/${id}`),
  create: (quotation: any) => apiClient.post('/quotations', quotation),
  update: (id: number, quotation: any) => apiClient.put(`/quotations/${id}`, quotation),
  delete: (id: number) => apiClient.delete(`/quotations/${id}`),
};

export const paymentsApi = {
  getAll: (params?: Record<string, any>) => apiClient.get('/payments', params),
  getById: (id: number) => apiClient.get(`/payments/${id}`),
  create: (payment: any) => apiClient.post('/payments', payment),
  process: (quotationId: number, amount: number, methodId: number) => 
    apiClient.post('/payments/process', { quotation_id: quotationId, amount, method_id: methodId }),
  getMethods: () => apiClient.get('/payments/methods'),
};

export const masterDataApi = {
  getDistricts: () => apiClient.get('/master-data/districts'),
  getGenders: () => apiClient.get('/master-data/genders'),
  getDocumentTypes: () => apiClient.get('/master-data/document-types'),
  getPaymentMethods: () => apiClient.get('/master-data/payment-methods'),
  getJobTitles: () => apiClient.get('/master-data/job-titles'),
  getCategories: () => apiClient.get('/master-data/categories'),
}; 