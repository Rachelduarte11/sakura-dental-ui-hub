import { create } from 'zustand';

export interface MasterData {
  districts: District[];
  genders: Gender[];
  documentTypes: DocumentType[];
  paymentMethods: PaymentMethod[];
  jobTitles: JobTitle[];
  categories: CategoryService[];
}

export interface District {
  district_id: number;
  name: string;
  status: boolean;
}

export interface Gender {
  gender_id: number;
  code: string;
  name: string;
  status: boolean;
}

export interface DocumentType {
  document_type_id: number;
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
      await Promise.all([
        get().fetchDistricts(),
        get().fetchGenders(),
        get().fetchDocumentTypes(),
        get().fetchPaymentMethods(),
        get().fetchJobTitles(),
        get().fetchCategories(),
      ]);
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchDistricts: async () => {
    try {
      const response = await fetch('/api/master-data/districts');
      if (!response.ok) {
        throw new Error('Error al cargar distritos');
      }
      const data = await response.json();
      set((state) => ({
        districts: data,
        lastUpdated: { ...state.lastUpdated, districts: new Date().toISOString() },
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  fetchGenders: async () => {
    try {
      const response = await fetch('/api/master-data/genders');
      if (!response.ok) {
        throw new Error('Error al cargar géneros');
      }
      const data = await response.json();
      set((state) => ({
        genders: data,
        lastUpdated: { ...state.lastUpdated, genders: new Date().toISOString() },
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  fetchDocumentTypes: async () => {
    try {
      const response = await fetch('/api/master-data/document-types');
      if (!response.ok) {
        throw new Error('Error al cargar tipos de documento');
      }
      const data = await response.json();
      set((state) => ({
        documentTypes: data,
        lastUpdated: { ...state.lastUpdated, documentTypes: new Date().toISOString() },
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  fetchPaymentMethods: async () => {
    try {
      const response = await fetch('/api/master-data/payment-methods');
      if (!response.ok) {
        throw new Error('Error al cargar métodos de pago');
      }
      const data = await response.json();
      set((state) => ({
        paymentMethods: data,
        lastUpdated: { ...state.lastUpdated, paymentMethods: new Date().toISOString() },
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  fetchJobTitles: async () => {
    try {
      const response = await fetch('/api/master-data/job-titles');
      if (!response.ok) {
        throw new Error('Error al cargar cargos');
      }
      const data = await response.json();
      set((state) => ({
        jobTitles: data,
        lastUpdated: { ...state.lastUpdated, jobTitles: new Date().toISOString() },
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  fetchCategories: async () => {
    try {
      const response = await fetch('/api/master-data/categories');
      if (!response.ok) {
        throw new Error('Error al cargar categorías');
      }
      const data = await response.json();
      set((state) => ({
        categories: data,
        lastUpdated: { ...state.lastUpdated, categories: new Date().toISOString() },
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  // CRUD actions for districts
  createDistrict: async (district) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/master-data/districts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(district),
      });

      if (!response.ok) {
        throw new Error('Error al crear distrito');
      }

      const newDistrict = await response.json();
      set((state) => ({
        districts: [...state.districts, newDistrict],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updateDistrict: async (id: number, district) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/master-data/districts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(district),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar distrito');
      }

      const updatedDistrict = await response.json();
      set((state) => ({
        districts: state.districts.map((d) =>
          d.district_id === id ? updatedDistrict : d
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

  deleteDistrict: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/master-data/districts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar distrito');
      }

      set((state) => ({
        districts: state.districts.filter((d) => d.district_id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  // CRUD actions for genders
  createGender: async (gender) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/master-data/genders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gender),
      });

      if (!response.ok) {
        throw new Error('Error al crear género');
      }

      const newGender = await response.json();
      set((state) => ({
        genders: [...state.genders, newGender],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updateGender: async (id: number, gender) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/master-data/genders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gender),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar género');
      }

      const updatedGender = await response.json();
      set((state) => ({
        genders: state.genders.map((g) =>
          g.gender_id === id ? updatedGender : g
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

  deleteGender: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/master-data/genders/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar género');
      }

      set((state) => ({
        genders: state.genders.filter((g) => g.gender_id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  // CRUD actions for document types
  createDocumentType: async (documentType) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/master-data/document-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentType),
      });

      if (!response.ok) {
        throw new Error('Error al crear tipo de documento');
      }

      const newDocumentType = await response.json();
      set((state) => ({
        documentTypes: [...state.documentTypes, newDocumentType],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updateDocumentType: async (id: number, documentType) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/master-data/document-types/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentType),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar tipo de documento');
      }

      const updatedDocumentType = await response.json();
      set((state) => ({
        documentTypes: state.documentTypes.map((dt) =>
          dt.document_type_id === id ? updatedDocumentType : dt
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

  deleteDocumentType: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/master-data/document-types/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar tipo de documento');
      }

      set((state) => ({
        documentTypes: state.documentTypes.filter((dt) => dt.document_type_id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
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