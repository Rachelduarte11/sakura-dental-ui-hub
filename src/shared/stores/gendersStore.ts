import { create } from 'zustand';
import { apiClient } from '../utils/api-client';

export interface Gender {
  genderId: number;
  code: string;
  name: string;
  status: boolean;
}

interface GendersState {
  genders: Gender[];
  isLoading: boolean;
  error: string | null;
  lastUpdated?: string;
}

interface GendersActions {
  fetchGenders: () => Promise<void>;
  createGender: (gender: Omit<Gender, 'genderId'>) => Promise<void>;
  updateGender: (id: number, gender: Partial<Gender>) => Promise<void>;
  deleteGender: (id: number) => Promise<void>;
  getActiveGenders: () => Gender[];
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useGendersStore = create<GendersState & GendersActions>((set, get) => ({
  // State
  genders: [],
  isLoading: false,
  error: null,
  lastUpdated: undefined,

  // Actions
  fetchGenders: async () => {
    console.log('🔄 fetchGenders: Iniciando llamada a API...');
    set({ isLoading: true, error: null });
    
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        const { data } = await apiClient.get('/api/genders');
        console.log('✅ fetchGenders: Respuesta exitosa:', data);
        set({
          genders: data as Gender[],
          lastUpdated: new Date().toISOString(),
          isLoading: false,
        });
        return; // Success, exit retry loop
      } catch (error) {
        retryCount++;
        console.error(`❌ fetchGenders: Intento ${retryCount}/${maxRetries} falló:`, error);
        
        if (retryCount >= maxRetries) {
          console.error('❌ fetchGenders: Todos los intentos fallaron');
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

  getActiveGenders: () => {
    return get().genders.filter((g) => g.status);
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
})); 