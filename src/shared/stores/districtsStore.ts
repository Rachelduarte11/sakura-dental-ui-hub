import { create } from 'zustand';
import { apiClient } from '../utils/api-client';

export interface District {
  districtId: number;
  name: string;
  status: boolean;
}

interface DistrictsState {
  districts: District[];
  isLoading: boolean;
  error: string | null;
  lastUpdated?: string;
}

interface DistrictsActions {
  fetchDistricts: () => Promise<void>;
  createDistrict: (district: Omit<District, 'districtId'>) => Promise<void>;
  updateDistrict: (id: number, district: Partial<District>) => Promise<void>;
  deleteDistrict: (id: number) => Promise<void>;
  getActiveDistricts: () => District[];
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useDistrictsStore = create<DistrictsState & DistrictsActions>((set, get) => ({
  // State
  districts: [],
  isLoading: false,
  error: null,
  lastUpdated: undefined,

  // Actions
  fetchDistricts: async () => {
    console.log('🔄 fetchDistricts: Iniciando llamada a API...');
    set({ isLoading: true, error: null });
    
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        const { data } = await apiClient.get('/api/districts');
        console.log('✅ fetchDistricts: Respuesta exitosa:', data);
        set({
          districts: data as District[],
          lastUpdated: new Date().toISOString(),
          isLoading: false,
        });
        return; // Success, exit retry loop
      } catch (error) {
        retryCount++;
        console.error(`❌ fetchDistricts: Intento ${retryCount}/${maxRetries} falló:`, error);
        
        if (retryCount >= maxRetries) {
          console.error('❌ fetchDistricts: Todos los intentos fallaron');
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

  getActiveDistricts: () => {
    return get().districts.filter((d) => d.status);
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
})); 