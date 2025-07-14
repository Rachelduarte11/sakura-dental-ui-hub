import { create } from 'zustand';
import { patientApi } from '../api/patientApi';
import type { Patient, PatientFilters } from '../api/types';

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  isLoading: boolean;
  error: string | null;
  filters: PatientFilters;
}

interface PatientActions {
  // Fetch actions
  fetchPatients: () => Promise<void>;
  fetchPatientById: (id: number) => Promise<void>;
  
  // CRUD actions
  createPatient: (patient: Omit<Patient, 'patient_id' | 'created_at'>) => Promise<void>;
  updatePatient: (id: number, patient: Partial<Patient>) => Promise<void>;
  deletePatient: (id: number) => Promise<void>;
  
  // State management
  setSelectedPatient: (patient: Patient | null) => void;
  setFilters: (filters: Partial<PatientFilters>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const usePatientStore = create<PatientState & PatientActions>((set, get) => ({
  // State
  patients: [],
  selectedPatient: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    status: null,
  },

  // Actions
  fetchPatients: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const response = await patientApi.getAll(filters);
      set({ patients: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchPatientById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await patientApi.getById(id);
      set({ selectedPatient: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  createPatient: async (patient) => {
    set({ isLoading: true, error: null });
    try {
      const response = await patientApi.create(patient);
      set((state) => ({
        patients: [...state.patients, response.data],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updatePatient: async (id: number, patient) => {
    set({ isLoading: true, error: null });
    try {
      const response = await patientApi.update(id, patient);
      set((state) => ({
        patients: state.patients.map((p) =>
          p.patient_id === id ? response.data : p
        ),
        selectedPatient: state.selectedPatient?.patient_id === id ? response.data : state.selectedPatient,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  deletePatient: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await patientApi.delete(id);
      set((state) => ({
        patients: state.patients.filter((p) => p.patient_id !== id),
        selectedPatient: state.selectedPatient?.patient_id === id ? null : state.selectedPatient,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  setSelectedPatient: (patient) => {
    set({ selectedPatient: patient });
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
})); 