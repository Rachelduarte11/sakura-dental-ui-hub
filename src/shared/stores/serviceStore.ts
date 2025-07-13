import { create } from 'zustand';

interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  status: boolean;
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
      // Add your API call here when ready
      // const response = await fetch('/api/services');
      // const services = await response.json();
      set({ services: [], isLoading: false });
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

