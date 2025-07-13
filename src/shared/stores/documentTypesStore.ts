import { create } from 'zustand';
import { apiClient } from '../utils/api-client';

export interface DocumentType {
  documentTypeId: number;
  code: string;
  name: string;
  status: boolean;
}

interface DocumentTypesState {
  documentTypes: DocumentType[];
  isLoading: boolean;
  error: string | null;
  lastUpdated?: string;
}

interface DocumentTypesActions {
  fetchDocumentTypes: () => Promise<void>;
  createDocumentType: (documentType: Omit<DocumentType, 'documentTypeId'>) => Promise<void>;
  updateDocumentType: (id: number, documentType: Partial<DocumentType>) => Promise<void>;
  deleteDocumentType: (id: number) => Promise<void>;
  getActiveDocumentTypes: () => DocumentType[];
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useDocumentTypesStore = create<DocumentTypesState & DocumentTypesActions>((set, get) => ({
  // State
  documentTypes: [],
  isLoading: false,
  error: null,
  lastUpdated: undefined,

  // Actions
  fetchDocumentTypes: async () => {
    console.log('🔄 fetchDocumentTypes: Iniciando llamada a API...');
    set({ isLoading: true, error: null });
    
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        const { data } = await apiClient.get('/api/document-types');
        console.log('✅ fetchDocumentTypes: Respuesta exitosa:', data);
        set({
          documentTypes: data as DocumentType[],
          lastUpdated: new Date().toISOString(),
          isLoading: false,
        });
        return; // Success, exit retry loop
      } catch (error) {
        retryCount++;
        console.error(`❌ fetchDocumentTypes: Intento ${retryCount}/${maxRetries} falló:`, error);
        
        if (retryCount >= maxRetries) {
          console.error('❌ fetchDocumentTypes: Todos los intentos fallaron');
          set({ 
            error: error instanceof Error ? error.message : 'Error desconocido',
            isLoading: false 
          });
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
      const { data: newDocumentType } = await apiClient.post('/api/document-types', documentType);
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
      const { data: updatedDocumentType } = await apiClient.put(`/api/document-types/${id}`, documentType);
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
      await apiClient.delete(`/api/document-types/${id}`);
      set((state) => ({
        documentTypes: state.documentTypes.filter((dt) => dt.documentTypeId !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
    }
  },

  getActiveDocumentTypes: () => {
    return get().documentTypes.filter((dt) => dt.status);
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
})); 