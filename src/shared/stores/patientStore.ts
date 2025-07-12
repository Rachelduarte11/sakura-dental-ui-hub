import { create } from 'zustand';

export interface Patient {
  patient_id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  doc_number?: string;
  status: boolean;
  created_at: string;
  district_id: number;
  gender_id: number;
  document_type_id: number;
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
  createPatient: (patient: Omit<Patient, 'patient_id' | 'created_at'>) => Promise<void>;
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
      const response = await fetch('/api/patients');
      if (!response.ok) {
        throw new Error('Error al cargar pacientes');
      }
      const data = await response.json();
      set({ patients: data, isLoading: false });
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
      const response = await fetch(`/api/patients/${id}`);
      if (!response.ok) {
        throw new Error('Error al cargar paciente');
      }
      const data = await response.json();
      set({ selectedPatient: data, isLoading: false });
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
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patient),
      });

      if (!response.ok) {
        throw new Error('Error al crear paciente');
      }

      const newPatient = await response.json();
      set((state) => ({
        patients: [...state.patients, newPatient],
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
      const response = await fetch(`/api/patients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patient),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar paciente');
      }

      const updatedPatient = await response.json();
      set((state) => ({
        patients: state.patients.map((p) =>
          p.patient_id === id ? updatedPatient : p
        ),
        selectedPatient: state.selectedPatient?.patient_id === id ? updatedPatient : state.selectedPatient,
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
      const response = await fetch(`/api/patients/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar paciente');
      }

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