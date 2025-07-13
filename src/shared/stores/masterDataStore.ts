import { create } from 'zustand';
import { API_BASE_URL } from '../../config/api';
import { apiClient } from '../utils/api-client';

export interface MasterData {
  districts: District[];
  genders: Gender[];
  documentTypes: DocumentType[];
  paymentMethods: PaymentMethod[];
  jobTitles: JobTitle[];
  categories: CategoryService[];
}

export interface District {
  districtId: number;
  name: string;
  status: boolean;
}

export interface Gender {
  genderId: number;
  code: string;
  name: string;
  status: boolean;
}

export interface DocumentType {
  documentTypeId: number;
  code: string;
  name: string;
  status: boolean;
}

export interface PaymentMethod {
  method_id: number;
  name: string;
}

export interface JobTitle {
  job_title_id: number;
  name: string;
  description?: string;
  status: boolean;
}

export interface CategoryService {
  categorie_service_id: number;
  name: string;
  description?: string;
  status: boolean;
}

interface MasterDataState {
  districts: District[];
  genders: Gender[];
  documentTypes: DocumentType[];
  paymentMethods: PaymentMethod[];
  jobTitles: JobTitle[];
  categories: CategoryService[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: {
    districts?: string;
    genders?: string;
    documentTypes?: string;
    paymentMethods?: string;
    jobTitles?: string;
    categories?: string;
  };
}

interface MasterDataActions {
  // Fetch actions
  fetchAllMasterData: () => Promise<void>;
  fetchDistricts: () => Promise<void>;
  fetchGenders: () => Promise<void>;
  fetchDocumentTypes: () => Promise<void>;
  fetchPaymentMethods: () => Promise<void>;
  fetchJobTitles: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  
  // CRUD actions for districts
  createDistrict: (district: Omit<District, 'district_id'>) => Promise<void>;
  updateDistrict: (id: number, district: Partial<District>) => Promise<void>;
  deleteDistrict: (id: number) => Promise<void>;
  
  // CRUD actions for genders
  createGender: (gender: Omit<Gender, 'gender_id'>) => Promise<void>;
  updateGender: (id: number, gender: Partial<Gender>) => Promise<void>;
  deleteGender: (id: number) => Promise<void>;
  
  // CRUD actions for document types
  createDocumentType: (documentType: Omit<DocumentType, 'document_type_id'>) => Promise<void>;
  updateDocumentType: (id: number, documentType: Partial<DocumentType>) => Promise<void>;
  deleteDocumentType: (id: number) => Promise<void>;
  
  // CRUD actions for payment methods
  createPaymentMethod: (paymentMethod: Omit<PaymentMethod, 'method_id'>) => Promise<void>;
  updatePaymentMethod: (id: number, paymentMethod: Partial<PaymentMethod>) => Promise<void>;
  deletePaymentMethod: (id: number) => Promise<void>;
  
  // CRUD actions for job titles
  createJobTitle: (jobTitle: Omit<JobTitle, 'job_title_id'>) => Promise<void>;
  updateJobTitle: (id: number, jobTitle: Partial<JobTitle>) => Promise<void>;
  deleteJobTitle: (id: number) => Promise<void>;
  
  // CRUD actions for categories
  createCategory: (category: Omit<CategoryService, 'categorie_service_id'>) => Promise<void>;
  updateCategory: (id: number, category: Partial<CategoryService>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  
  // Utility actions
  getActiveDistricts: () => District[];
  getActiveGenders: () => Gender[];
  getActiveDocumentTypes: () => DocumentType[];
  getActivePaymentMethods: () => PaymentMethod[];
  getActiveJobTitles: () => JobTitle[];
  getActiveCategories: () => CategoryService[];
  
  // State management
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useMasterDataStore = create<MasterDataState & MasterDataActions>((set, get) => ({
  // State
  districts: [],
  genders: [],
  documentTypes: [],
  paymentMethods: [],
  jobTitles: [],
  categories: [],
  isLoading: false,
  error: null,
  lastUpdated: {},

  // Actions
  fetchAllMasterData: async () => {
    set({ isLoading: true, error: null });
    try {
      // Make requests sequential instead of parallel to avoid concurrency issues
      console.log('🔄 fetchAllMasterData: Iniciando carga secuencial de datos maestros...');
      
      await get().fetchDistricts();
      // Add delay between requests to avoid overwhelming the backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await get().fetchGenders();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await get().fetchDocumentTypes();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await get().fetchPaymentMethods();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await get().fetchJobTitles();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await get().fetchCategories();
      
      console.log('✅ fetchAllMasterData: Todos los datos maestros cargados exitosamente');
      set({ isLoading: false });
    } catch (error) {
      console.error('❌ fetchAllMasterData: Error cargando datos maestros:', error);
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  // --- DISTRICTS ---
  fetchDistricts: async () => {
    console.log('🔄 fetchDistricts: Iniciando llamada a API...');
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        const { data } = await apiClient.get('/api/districts');
        console.log('✅ fetchDistricts: Respuesta exitosa:', data);
        set((state) => ({
          districts: data as District[],
          lastUpdated: { ...state.lastUpdated, districts: new Date().toISOString() },
        }));
        return; // Success, exit retry loop
      } catch (error) {
        retryCount++;
        console.error(`❌ fetchDistricts: Intento ${retryCount}/${maxRetries} falló:`, error);
        
        if (retryCount >= maxRetries) {
          console.error('❌ fetchDistricts: Todos los intentos fallaron');
          set({ error: error instanceof Error ? error.message : 'Error desconocido' });
          return;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }
  },
  createDistrict: async (district) => {
    set({ isLoading: true, error: null });
    try {
      const { data: newDistrict } = await apiClient.post('/api/districts', district);
      set((state) => ({
        districts: [...state.districts, newDistrict as District],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
    }
  },
  updateDistrict: async (id, district) => {
    set({ isLoading: true, error: null });
    try {
      const { data: updatedDistrict } = await apiClient.put(`/api/districts/${id}`, district);
      set((state) => ({
        districts: state.districts.map((d) => d.districtId === id ? updatedDistrict as District : d),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
    }
  },
  deleteDistrict: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/api/districts/${id}`);
      set((state) => ({
        districts: state.districts.filter((d) => d.districtId !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
    }
  },

  // --- GENDERS ---
  fetchGenders: async () => {
    console.log('🔄 fetchGenders: Iniciando llamada a API...');
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        const { data } = await apiClient.get('/api/genders');
        console.log('✅ fetchGenders: Respuesta exitosa:', data);
        set((state) => ({
          genders: data as Gender[],
          lastUpdated: { ...state.lastUpdated, genders: new Date().toISOString() },
        }));
        return; // Success, exit retry loop
      } catch (error) {
        retryCount++;
        console.error(`❌ fetchGenders: Intento ${retryCount}/${maxRetries} falló:`, error);
        
        if (retryCount >= maxRetries) {
          console.error('❌ fetchGenders: Todos los intentos fallaron');
          set({ error: error instanceof Error ? error.message : 'Error desconocido' });
          return;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }
  },
  createGender: async (gender) => {
    set({ isLoading: true, error: null });
    try {
      const { data: newGender } = await apiClient.post('/api/genders', gender);
      set((state) => ({
        genders: [...state.genders, newGender as Gender],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
    }
  },
  updateGender: async (id, gender) => {
    set({ isLoading: true, error: null });
    try {
      const { data: updatedGender } = await apiClient.put(`/api/genders/${id}`, gender);
      set((state) => ({
        genders: state.genders.map((g) => g.genderId === id ? updatedGender as Gender : g),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
    }
  },
  deleteGender: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/api/genders/${id}`);
      set((state) => ({
        genders: state.genders.filter((g) => g.genderId !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
    }
  },

  // --- DOCUMENT TYPES ---
  fetchDocumentTypes: async () => {
    console.log('🔄 fetchDocumentTypes: Iniciando llamada a API...');
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        const { data } = await apiClient.get('/api/document-type');
        console.log('✅ fetchDocumentTypes: Respuesta exitosa:', data);
        set((state) => ({
          documentTypes: data as DocumentType[],
          lastUpdated: { ...state.lastUpdated, documentTypes: new Date().toISOString() },
        }));
        return; // Success, exit retry loop
      } catch (error) {
        retryCount++;
        console.error(`❌ fetchDocumentTypes: Intento ${retryCount}/${maxRetries} falló:`, error);
        
        if (retryCount >= maxRetries) {
          console.error('❌ fetchDocumentTypes: Todos los intentos fallaron');
          set({ error: error instanceof Error ? error.message : 'Error desconocido' });
          return;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }
  },
  createDocumentType: async (documentType) => {
    set({ isLoading: true, error: null });
    try {
      const { data: newDocumentType } = await apiClient.post('/api/document-type', documentType);
      set((state) => ({
        documentTypes: [...state.documentTypes, newDocumentType as DocumentType],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
    }
  },
  updateDocumentType: async (id, documentType) => {
    set({ isLoading: true, error: null });
    try {
      const { data: updatedDocumentType } = await apiClient.put(`/api/document-type/${id}`, documentType);
      set((state) => ({
        documentTypes: state.documentTypes.map((dt) => dt.documentTypeId === id ? updatedDocumentType as DocumentType : dt),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
    }
  },
  deleteDocumentType: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/api/document-type/${id}`);
      set((state) => ({
        documentTypes: state.documentTypes.filter((dt) => dt.documentTypeId !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
    }
  },

  // --- PAYMENT METHODS ---
  fetchPaymentMethods: async () => {
    console.log('🔄 fetchPaymentMethods: Iniciando llamada a API...');
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        const { data } = await apiClient.get('/api/master-data/payment-methods');
        console.log('✅ fetchPaymentMethods: Respuesta exitosa:', data);
        set((state) => ({
          paymentMethods: data as PaymentMethod[],
          lastUpdated: { ...state.lastUpdated, paymentMethods: new Date().toISOString() },
        }));
        return; // Success, exit retry loop
      } catch (error) {
        retryCount++;
        console.error(`❌ fetchPaymentMethods: Intento ${retryCount}/${maxRetries} falló:`, error);
        
        if (retryCount >= maxRetries) {
          console.error('❌ fetchPaymentMethods: Todos los intentos fallaron');
          set({ error: error instanceof Error ? error.message : 'Error desconocido' });
          return;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }
  },
  
  // --- JOB TITLES ---
  fetchJobTitles: async () => {
    console.log('🔄 fetchJobTitles: Iniciando llamada a API...');
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        const { data } = await apiClient.get('/api/master-data/job-titles');
        console.log('✅ fetchJobTitles: Respuesta exitosa:', data);
        set((state) => ({
          jobTitles: data as JobTitle[],
          lastUpdated: { ...state.lastUpdated, jobTitles: new Date().toISOString() },
        }));
        return; // Success, exit retry loop
      } catch (error) {
        retryCount++;
        console.error(`❌ fetchJobTitles: Intento ${retryCount}/${maxRetries} falló:`, error);
        
        if (retryCount >= maxRetries) {
          console.error('❌ fetchJobTitles: Todos los intentos fallaron');
          set({ error: error instanceof Error ? error.message : 'Error desconocido' });
          return;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }
  },
  
  // --- CATEGORIES ---
  fetchCategories: async () => {
    console.log('🔄 fetchCategories: Iniciando llamada a API...');
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        const { data } = await apiClient.get('/api/master-data/categories');
        console.log('✅ fetchCategories: Respuesta exitosa:', data);
        set((state) => ({
          categories: data as CategoryService[],
          lastUpdated: { ...state.lastUpdated, categories: new Date().toISOString() },
        }));
        return; // Success, exit retry loop
      } catch (error) {
        retryCount++;
        console.error(`❌ fetchCategories: Intento ${retryCount}/${maxRetries} falló:`, error);
        
        if (retryCount >= maxRetries) {
          console.error('❌ fetchCategories: Todos los intentos fallaron');
          set({ error: error instanceof Error ? error.message : 'Error desconocido' });
          return;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }
  },

  // CRUD actions for payment methods
  createPaymentMethod: async (paymentMethod) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/master-data/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentMethod),
      });

      if (!response.ok) {
        throw new Error('Error al crear método de pago');
      }

      const newPaymentMethod = await response.json();
      set((state) => ({
        paymentMethods: [...state.paymentMethods, newPaymentMethod],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updatePaymentMethod: async (id: number, paymentMethod) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/master-data/payment-methods/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentMethod),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar método de pago');
      }

      const updatedPaymentMethod = await response.json();
      set((state) => ({
        paymentMethods: state.paymentMethods.map((pm) =>
          pm.method_id === id ? updatedPaymentMethod : pm
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

  deletePaymentMethod: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/master-data/payment-methods/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar método de pago');
      }

      set((state) => ({
        paymentMethods: state.paymentMethods.filter((pm) => pm.method_id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  // CRUD actions for job titles
  createJobTitle: async (jobTitle) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/master-data/job-titles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobTitle),
      });

      if (!response.ok) {
        throw new Error('Error al crear cargo');
      }

      const newJobTitle = await response.json();
      set((state) => ({
        jobTitles: [...state.jobTitles, newJobTitle],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updateJobTitle: async (id: number, jobTitle) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/master-data/job-titles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobTitle),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar cargo');
      }

      const updatedJobTitle = await response.json();
      set((state) => ({
        jobTitles: state.jobTitles.map((jt) =>
          jt.job_title_id === id ? updatedJobTitle : jt
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

  deleteJobTitle: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/master-data/job-titles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar cargo');
      }

      set((state) => ({
        jobTitles: state.jobTitles.filter((jt) => jt.job_title_id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  // CRUD actions for categories
  createCategory: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/master-data/categories', {
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
      const response = await fetch(`/api/master-data/categories/${id}`, {
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
          c.categorie_service_id === id ? updatedCategory : c
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
      const response = await fetch(`/api/master-data/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar categoría');
      }

      set((state) => ({
        categories: state.categories.filter((c) => c.categorie_service_id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  // Utility actions
  getActiveDistricts: () => {
    return get().districts.filter((d) => d.status);
  },

  getActiveGenders: () => {
    return get().genders.filter((g) => g.status);
  },

  getActiveDocumentTypes: () => {
    return get().documentTypes.filter((dt) => dt.status);
  },

  getActivePaymentMethods: () => {
    return get().paymentMethods;
  },

  getActiveJobTitles: () => {
    return get().jobTitles.filter((jt) => jt.status);
  },

  getActiveCategories: () => {
    return get().categories.filter((c) => c.status);
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
})); 