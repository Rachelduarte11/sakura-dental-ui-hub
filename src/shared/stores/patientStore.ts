import { create } from 'zustand';
import { patientsApi } from '../utils/api-client';

export interface Patient {
  patientId: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  dni?: string;
  status: boolean;
  createdAt: string;
  districtId: number;
  genderId: number;
  documentTypeId: number;
}

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    status: boolean | null;
  };
}

interface PatientActions {
  // Fetch actions
  fetchPatients: () => Promise<void>;
  fetchPatientById: (id: number) => Promise<void>;
  
  // CRUD actions
  createPatient: (patient: Omit<Patient, 'patientId' | 'createdAt'>) => Promise<void>;
  updatePatient: (id: number, patient: Partial<Patient>) => Promise<void>;
  deletePatient: (id: number) => Promise<void>;
  
  // State management
  setSelectedPatient: (patient: Patient | null) => void;
  setFilters: (filters: Partial<PatientState['filters']>) => void;
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
      const response = await patientsApi.getAll();
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
      const response = await patientsApi.getById(id);
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
      const response = await patientsApi.create(patient);
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
      const response = await patientsApi.update(id, patient);
      set((state) => ({
        patients: state.patients.map((p) =>
          p.patientId === id ? response.data : p
        ),
        selectedPatient: state.selectedPatient?.patientId === id ? response.data : state.selectedPatient,
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
      await patientsApi.delete(id);
      set((state) => ({
        patients: state.patients.filter((p) => p.patientId !== id),
        selectedPatient: state.selectedPatient?.patientId === id ? null : state.selectedPatient,
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
