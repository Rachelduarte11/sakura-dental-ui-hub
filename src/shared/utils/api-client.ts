import { useAuthStore } from '../stores/authStore';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api';
import type { Patient } from '../stores/patientStore';

// Configuración del cliente API
const BASE_URL = API_BASE_URL;

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  error?: string;
}

// Tipos específicos para las respuestas
interface PatientsResponse {
  data: Patient[];
}

interface PatientResponse {
  data: Patient;
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
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        // Manejar errores de autenticación
        if (response.status === 401) {
          useAuthStore.getState().logout();
          throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
        }
        
        const errorData = await response.json().catch(() => ({}));
        
        // Handle specific backend errors
        if (errorData.message && errorData.message.includes('ConcurrentModificationException')) {
          throw new Error('Error de concurrencia en el servidor. Por favor, intente nuevamente.');
        }
        
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      if (error instanceof Error) {
        // Handle abort error (timeout)
        if (error.name === 'AbortError') {
          throw new Error('La solicitud tardó demasiado tiempo. Por favor, intente nuevamente.');
        }
        
        // Handle network errors
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          throw new Error('Error de conexión. Verifique su conexión a internet e intente nuevamente.');
        }
        
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
    console.log('🔍 POST Request:', {
      endpoint,
      data,
      fullUrl: `${this.baseURL}${endpoint}`,
      stringifiedData: JSON.stringify(data)
    });
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
export const apiClient = new ApiClient(BASE_URL);

// Hooks para usar el cliente API
export const useApiClient = () => apiClient;

// Funciones helper para endpoints específicos usando tu configuración
export const authApi = {
  login: (username: string, password: string) => {
    console.log('🔍 Login API Call:', {
      endpoint: API_ENDPOINTS.LOGIN.replace(API_BASE_URL, ''),
      data: { username, password },
      fullUrl: API_ENDPOINTS.LOGIN
    });
    return apiClient.post(API_ENDPOINTS.LOGIN.replace(API_BASE_URL, ''), { username, password });
  },
  logout: () => apiClient.post(API_ENDPOINTS.LOGOUT.replace(API_BASE_URL, '')),
  refreshToken: () => apiClient.post('/auth/refresh'),
};

export const patientsApi = {
  getAll: (params?: Record<string, any>): Promise<ApiResponse<Patient[]>> => 
    apiClient.get(API_ENDPOINTS.PATIENTS.replace(API_BASE_URL, ''), params),
  getById: (id: number): Promise<ApiResponse<Patient>> => 
    apiClient.get(`${API_ENDPOINTS.PATIENTS.replace(API_BASE_URL, '')}/${id}`),
  create: (patient: Omit<Patient, 'patient_id' | 'created_at'>): Promise<ApiResponse<Patient>> => 
    apiClient.post(API_ENDPOINTS.PATIENTS.replace(API_BASE_URL, ''), patient),
  update: (id: number, patient: Partial<Patient>): Promise<ApiResponse<Patient>> => 
    apiClient.put(`${API_ENDPOINTS.PATIENTS.replace(API_BASE_URL, '')}/${id}`, patient),
  delete: (id: number): Promise<ApiResponse<void>> => 
    apiClient.delete(`${API_ENDPOINTS.PATIENTS.replace(API_BASE_URL, '')}/${id}`),
};

export const servicesApi = {
  getAll: (params?: Record<string, any>) => apiClient.get(API_ENDPOINTS.SERVICES.replace(API_BASE_URL, ''), params),
  getById: (id: number) => apiClient.get(`${API_ENDPOINTS.SERVICES.replace(API_BASE_URL, '')}/${id}`),
  create: (service: any) => apiClient.post(API_ENDPOINTS.SERVICES.replace(API_BASE_URL, ''), service),
  update: (id: number, service: any) => apiClient.put(`${API_ENDPOINTS.SERVICES.replace(API_BASE_URL, '')}/${id}`, service),
  delete: (id: number) => apiClient.delete(`${API_ENDPOINTS.SERVICES.replace(API_BASE_URL, '')}/${id}`),
  getCategories: () => apiClient.get(`${API_ENDPOINTS.SERVICES.replace(API_BASE_URL, '')}/categories`),
};

export const quotationsApi = {
  getAll: (params?: Record<string, any>) => apiClient.get(API_ENDPOINTS.QUOTES.replace(API_BASE_URL, ''), params),
  getById: (id: number) => apiClient.get(`${API_ENDPOINTS.QUOTES.replace(API_BASE_URL, '')}/${id}`),
  create: (quotation: any) => apiClient.post(API_ENDPOINTS.QUOTES.replace(API_BASE_URL, ''), quotation),
  update: (id: number, quotation: any) => apiClient.put(`${API_ENDPOINTS.QUOTES.replace(API_BASE_URL, '')}/${id}`, quotation),
  delete: (id: number) => apiClient.delete(`${API_ENDPOINTS.QUOTES.replace(API_BASE_URL, '')}/${id}`),
};

export const paymentsApi = {
  getAll: (params?: Record<string, any>) => apiClient.get(API_ENDPOINTS.PAYMENTS.replace(API_BASE_URL, ''), params),
  getById: (id: number) => apiClient.get(`${API_ENDPOINTS.PAYMENTS.replace(API_BASE_URL, '')}/${id}`),
  create: (payment: any) => apiClient.post(API_ENDPOINTS.PAYMENTS.replace(API_BASE_URL, ''), payment),
  process: (quotationId: number, amount: number, methodId: number) => 
    apiClient.post(`${API_ENDPOINTS.PAYMENTS.replace(API_BASE_URL, '')}/process`, { quotation_id: quotationId, amount, method_id: methodId }),
  getMethods: () => apiClient.get(`${API_ENDPOINTS.PAYMENTS.replace(API_BASE_URL, '')}/methods`),
};

// APIs adicionales según tu configuración
export const doctorsApi = {
  getAll: (params?: Record<string, any>) => apiClient.get(API_ENDPOINTS.DOCTORS.replace(API_BASE_URL, ''), params),
  getById: (id: number) => apiClient.get(`${API_ENDPOINTS.DOCTORS.replace(API_BASE_URL, '')}/${id}`),
  create: (doctor: any) => apiClient.post(API_ENDPOINTS.DOCTORS.replace(API_BASE_URL, ''), doctor),
  update: (id: number, doctor: any) => apiClient.put(`${API_ENDPOINTS.DOCTORS.replace(API_BASE_URL, '')}/${id}`, doctor),
  delete: (id: number) => apiClient.delete(`${API_ENDPOINTS.DOCTORS.replace(API_BASE_URL, '')}/${id}`),
};

export const inventoryApi = {
  getAll: (params?: Record<string, any>) => apiClient.get(API_ENDPOINTS.INVENTORY.replace(API_BASE_URL, ''), params),
  getById: (id: number) => apiClient.get(`${API_ENDPOINTS.INVENTORY.replace(API_BASE_URL, '')}/${id}`),
  create: (item: any) => apiClient.post(API_ENDPOINTS.INVENTORY.replace(API_BASE_URL, ''), item),
  update: (id: number, item: any) => apiClient.put(`${API_ENDPOINTS.INVENTORY.replace(API_BASE_URL, '')}/${id}`, item),
  delete: (id: number) => apiClient.delete(`${API_ENDPOINTS.INVENTORY.replace(API_BASE_URL, '')}/${id}`),
};

export const salesApi = {
  getAll: (params?: Record<string, any>) => apiClient.get(API_ENDPOINTS.SALES.replace(API_BASE_URL, ''), params),
  getById: (id: number) => apiClient.get(`${API_ENDPOINTS.SALES.replace(API_BASE_URL, '')}/${id}`),
  create: (sale: any) => apiClient.post(API_ENDPOINTS.SALES.replace(API_BASE_URL, ''), sale),
  update: (id: number, sale: any) => apiClient.put(`${API_ENDPOINTS.SALES.replace(API_BASE_URL, '')}/${id}`, sale),
  delete: (id: number) => apiClient.delete(`${API_ENDPOINTS.SALES.replace(API_BASE_URL, '')}/${id}`),
};

export const financesApi = {
  getAll: (params?: Record<string, any>) => apiClient.get(API_ENDPOINTS.FINANCES.replace(API_BASE_URL, ''), params),
  getById: (id: number) => apiClient.get(`${API_ENDPOINTS.FINANCES.replace(API_BASE_URL, '')}/${id}`),
  create: (finance: any) => apiClient.post(API_ENDPOINTS.FINANCES.replace(API_BASE_URL, ''), finance),
  update: (id: number, finance: any) => apiClient.put(`${API_ENDPOINTS.FINANCES.replace(API_BASE_URL, '')}/${id}`, finance),
  delete: (id: number) => apiClient.delete(`${API_ENDPOINTS.FINANCES.replace(API_BASE_URL, '')}/${id}`),
};

export const agendaApi = {
  getAll: (params?: Record<string, any>) => apiClient.get(API_ENDPOINTS.AGENDA.replace(API_BASE_URL, ''), params),
  getById: (id: number) => apiClient.get(`${API_ENDPOINTS.AGENDA.replace(API_BASE_URL, '')}/${id}`),
  create: (appointment: any) => apiClient.post(API_ENDPOINTS.AGENDA.replace(API_BASE_URL, ''), appointment),
  update: (id: number, appointment: any) => apiClient.put(`${API_ENDPOINTS.AGENDA.replace(API_BASE_URL, '')}/${id}`, appointment),
  delete: (id: number) => apiClient.delete(`${API_ENDPOINTS.AGENDA.replace(API_BASE_URL, '')}/${id}`),
};

export const masterDataApi = {
  getDistricts: () => apiClient.get('/master-data/districts'),
  getGenders: () => apiClient.get('/master-data/genders'),
  getDocumentTypes: () => apiClient.get('/master-data/document-types'),
  getPaymentMethods: () => apiClient.get('/master-data/payment-methods'),
  getJobTitles: () => apiClient.get('/master-data/job-titles'),
  getCategories: () => apiClient.get('/master-data/categories'),
}; 