import { create } from 'zustand';
import { apiClient } from '../utils/api-client';

export interface JobTitle {
  job_title_id: number;
  name: string;
  description?: string;
  status: boolean;
}

interface JobTitlesState {
  jobTitles: JobTitle[];
  isLoading: boolean;
  error: string | null;
  lastUpdated?: string;
}

interface JobTitlesActions {
  fetchJobTitles: () => Promise<void>;
  createJobTitle: (jobTitle: Omit<JobTitle, 'job_title_id'>) => Promise<void>;
  updateJobTitle: (id: number, jobTitle: Partial<JobTitle>) => Promise<void>;
  deleteJobTitle: (id: number) => Promise<void>;
  getActiveJobTitles: () => JobTitle[];
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useJobTitlesStore = create<JobTitlesState & JobTitlesActions>((set, get) => ({
  // State
  jobTitles: [],
  isLoading: false,
  error: null,
  lastUpdated: undefined,

  // Actions
  fetchJobTitles: async () => {
    console.log('🔄 fetchJobTitles: Iniciando llamada a API...');
    set({ isLoading: true, error: null });
    
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        const { data } = await apiClient.get('/api/job-titles');
        console.log('✅ fetchJobTitles: Respuesta exitosa:', data);
        set({
          jobTitles: data as JobTitle[],
          lastUpdated: new Date().toISOString(),
          isLoading: false,
        });
        return; // Success, exit retry loop
      } catch (error) {
        retryCount++;
        console.error(`❌ fetchJobTitles: Intento ${retryCount}/${maxRetries} falló:`, error);
        
        if (retryCount >= maxRetries) {
          console.error('❌ fetchJobTitles: Todos los intentos fallaron');
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

  createJobTitle: async (jobTitle) => {
    set({ isLoading: true, error: null });
    try {
      const { data: newJobTitle } = await apiClient.post('/api/job-titles', jobTitle);
      set((state) => ({
        jobTitles: [...state.jobTitles, newJobTitle as JobTitle],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
    }
  },

  updateJobTitle: async (id, jobTitle) => {
    set({ isLoading: true, error: null });
    try {
      const { data: updatedJobTitle } = await apiClient.put(`/api/job-titles/${id}`, jobTitle);
      set((state) => ({
        jobTitles: state.jobTitles.map((jt) => jt.job_title_id === id ? updatedJobTitle as JobTitle : jt),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
    }
  },

  deleteJobTitle: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/api/job-titles/${id}`);
      set((state) => ({
        jobTitles: state.jobTitles.filter((jt) => jt.job_title_id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error desconocido', isLoading: false });
    }
  },

  getActiveJobTitles: () => {
    return get().jobTitles.filter((jt) => jt.status);
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
})); 