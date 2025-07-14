import { create } from 'zustand';
import { useMemo } from 'react';
import { patientsApi, quotationsApi, servicesApi, paymentsApi, type Patient, type Service, type Payment } from '../utils/api-client';
import type { Quotation } from '../utils/api-client';

export type { Patient, Quotation, Service, Payment };

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  patientQuotations: Quotation[];
  patientPayments: Payment[];
  services: Service[];
  isLoading: boolean;
  isLoadingQuotations: boolean;
  isLoadingPayments: boolean;
  isLoadingServices: boolean;
  error: string | null;
  quotationsError: string | null;
  paymentsError: string | null;
  servicesError: string | null;
  filters: {
    search: string;
    status: boolean | null;
  };
}

interface PatientActions {
  // Fetch actions
  fetchPatients: () => Promise<void>;
  fetchPatientById: (id: number) => Promise<void>;
  searchPatients: (searchTerm: string) => Promise<void>;
  fetchPatientQuotations: (patientId: number) => Promise<void>;
  fetchPatientPayments: (patientId: number) => Promise<void>;
  fetchServices: () => Promise<void>;
  
  // CRUD actions
  createPatient: (patient: Omit<Patient, 'patientId' | 'createdAt'>) => Promise<void>;
  updatePatient: (id: number, patient: Partial<Patient>) => Promise<void>;
  deletePatient: (id: number) => Promise<void>;
  
  // State management
  setSelectedPatient: (patient: Patient | null) => void;
  setFilters: (filters: Partial<PatientState['filters']>) => void;
  clearError: () => void;
  clearQuotationsError: () => void;
  clearPaymentsError: () => void;
  clearServicesError: () => void;
  setLoading: (loading: boolean) => void;
}

export const usePatientStore = create<PatientState & PatientActions>((set, get) => ({
  // State
  patients: [],
  selectedPatient: null,
  patientQuotations: [],
  patientPayments: [],
  services: [],
  isLoading: false,
  isLoadingQuotations: false,
  isLoadingPayments: false,
  isLoadingServices: false,
  error: null,
  quotationsError: null,
  paymentsError: null,
  servicesError: null,
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

  searchPatients: async (searchTerm: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await patientsApi.search(searchTerm);
      set({ patients: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al buscar pacientes',
        isLoading: false,
      });
    }
  },

  fetchPatientQuotations: async (patientId: number) => {
    set({ isLoadingQuotations: true, quotationsError: null });
    try {
      const response = await quotationsApi.getByPatientId(patientId);
      set({ patientQuotations: response.data || [], isLoadingQuotations: false });
    } catch (error) {
      set({
        quotationsError: error instanceof Error ? error.message : 'Error al cargar cotizaciones',
        isLoadingQuotations: false,
      });
    }
  },

  fetchPatientPayments: async (patientId: number) => {
    set({ isLoadingPayments: true, paymentsError: null });
    try {
      const response = await paymentsApi.getByPatientId(patientId);
      set({ patientPayments: Array.isArray(response.data) ? response.data : [], isLoadingPayments: false });
    } catch (error) {
      set({
        paymentsError: error instanceof Error ? error.message : 'Error al cargar pagos',
        isLoadingPayments: false,
      });
    }
  },

  fetchServices: async () => {
    set({ isLoadingServices: true, servicesError: null });
    try {
      const response = await servicesApi.getAll();
      set({ services: response.data || [], isLoadingServices: false });
    } catch (error) {
      set({
        servicesError: error instanceof Error ? error.message : 'Error al cargar servicios',
        isLoadingServices: false,
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

  clearQuotationsError: () => {
    set({ quotationsError: null });
  },

  clearPaymentsError: () => {
    set({ paymentsError: null });
  },

  clearServicesError: () => {
    set({ servicesError: null });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));

// Selector: Get quotations with their payments and totals
export const usePatientQuotationsWithPayments = () => {
  const patientQuotations = usePatientStore((state) => state.patientQuotations);
  const patientPayments = usePatientStore((state) => state.patientPayments);
  
  return useMemo(() => {
    return patientQuotations.map((quotation) => {
      const payments = patientPayments.filter(
        (p) => p.quotationId === quotation.quotationId
      );
      const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const pending = (quotation.totalAmount || 0) - totalPaid;
      return {
        ...quotation,
        payments,
        totalPaid,
        pending,
      };
    });
  }, [patientQuotations, patientPayments]);
};
