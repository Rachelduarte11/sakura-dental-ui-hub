import { create } from 'zustand';

export interface Service {
  service_id: number;
  name: string;
  description?: string;
  base_price: number;
  status: boolean;
  category_id?: number;
  category_name?: string;
}

interface ServiceState {
  services: Service[];
  isLoading: boolean;
  error: string | null;
}

interface ServiceActions {
  fetchServices: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useServiceStore = create<ServiceState & ServiceActions>((set, get) => ({
  // State
  services: [],
  isLoading: false,
  error: null,

  // Actions
  fetchServices: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock data for now - replace with actual API call when ready
      const mockServices: Service[] = [
        {
          service_id: 1,
          name: 'Limpieza Dental',
          description: 'Limpieza profesional y profilaxis',
          base_price: 80.00,
          status: true,
          category_id: 1,
          category_name: 'Higiene'
        },
        {
          service_id: 2,
          name: 'Extracción Dental',
          description: 'Extracción de diente o muela',
          base_price: 120.00,
          status: true,
          category_id: 2,
          category_name: 'Cirugía'
        },
        {
          service_id: 3,
          name: 'Empaste Dental',
          description: 'Restauración con composite',
          base_price: 90.00,
          status: true,
          category_id: 3,
          category_name: 'Restauración'
        },
        {
          service_id: 4,
          name: 'Blanqueamiento Dental',
          description: 'Tratamiento de blanqueamiento profesional',
          base_price: 200.00,
          status: true,
          category_id: 4,
          category_name: 'Estética'
        },
        {
          service_id: 5,
          name: 'Ortodoncia',
          description: 'Tratamiento de ortodoncia',
          base_price: 1500.00,
          status: true,
          category_id: 5,
          category_name: 'Ortodoncia'
        }
      ];
      
      set({ services: mockServices, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error fetching services',
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));

