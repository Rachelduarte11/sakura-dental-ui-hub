import { create } from 'zustand';
import { doctorsApi } from '../api/doctorsApi';
import type { 
  Doctor, 
  DoctorWithDetails, 
  DoctorSpecialization,
  DoctorSchedule,
  DoctorFilters, 
  CreateDoctorRequest, 
  UpdateDoctorRequest,
  CreateScheduleRequest,
  UpdateScheduleRequest,
  DoctorStats,
  DoctorAvailability
} from '../api/types';

interface DoctorsState {
  doctors: Doctor[];
  specializations: DoctorSpecialization[];
  schedules: DoctorSchedule[];
  doctorStats: DoctorStats | null;
  doctorAvailability: DoctorAvailability[];
  selectedDoctor: DoctorWithDetails | null;
  isLoading: boolean;
  error: string | null;
  filters: DoctorFilters;
}

interface DoctorsActions {
  // Fetch actions
  fetchDoctors: () => Promise<void>;
  fetchDoctorById: (id: number) => Promise<void>;
  fetchSpecializations: () => Promise<void>;
  fetchDoctorSchedules: (doctorId: number) => Promise<void>;
  fetchDoctorStats: () => Promise<void>;
  fetchDoctorAvailability: (date?: string) => Promise<void>;
  fetchActiveDoctors: () => Promise<void>;
  fetchDoctorsBySpecialization: (specializationId: number) => Promise<void>;
  
  // Doctor CRUD actions
  createDoctor: (doctor: CreateDoctorRequest) => Promise<void>;
  updateDoctor: (id: number, doctor: UpdateDoctorRequest) => Promise<void>;
  deleteDoctor: (id: number) => Promise<void>;
  
  // Specialization CRUD actions
  createSpecialization: (specialization: Omit<DoctorSpecialization, 'specialization_id'>) => Promise<void>;
  updateSpecialization: (id: number, specialization: Partial<DoctorSpecialization>) => Promise<void>;
  deleteSpecialization: (id: number) => Promise<void>;
  
  // Schedule actions
  createSchedule: (schedule: CreateScheduleRequest) => Promise<void>;
  updateSchedule: (id: number, schedule: UpdateScheduleRequest) => Promise<void>;
  deleteSchedule: (id: number) => Promise<void>;
  
  // State management
  setSelectedDoctor: (doctor: DoctorWithDetails | null) => void;
  setFilters: (filters: Partial<DoctorFilters>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useDoctorsStore = create<DoctorsState & DoctorsActions>((set, get) => ({
  // State
  doctors: [],
  specializations: [],
  schedules: [],
  doctorStats: null,
  doctorAvailability: [],
  selectedDoctor: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    specializationId: null,
    status: null,
    availability: null,
  },

  // Actions
  fetchDoctors: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const response = await doctorsApi.getAllDoctors(filters);
      set({ doctors: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchDoctorById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await doctorsApi.getDoctorById(id);
      set({ selectedDoctor: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchSpecializations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await doctorsApi.getSpecializations();
      set({ specializations: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchDoctorSchedules: async (doctorId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await doctorsApi.getDoctorSchedules(doctorId);
      set({ schedules: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchDoctorStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await doctorsApi.getDoctorStats();
      set({ doctorStats: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchDoctorAvailability: async (date?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await doctorsApi.getDoctorAvailability(date);
      set({ doctorAvailability: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchActiveDoctors: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await doctorsApi.getActiveDoctors();
      set({ doctors: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchDoctorsBySpecialization: async (specializationId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await doctorsApi.getDoctorsBySpecialization(specializationId);
      set({ doctors: response.data || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  createDoctor: async (doctor) => {
    set({ isLoading: true, error: null });
    try {
      const response = await doctorsApi.createDoctor(doctor);
      set((state) => ({
        doctors: [...state.doctors, response.data],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updateDoctor: async (id: number, doctor) => {
    set({ isLoading: true, error: null });
    try {
      const response = await doctorsApi.updateDoctor(id, doctor);
      set((state) => ({
        doctors: state.doctors.map((d) =>
          d.doctor_id === id ? response.data : d
        ),
        selectedDoctor: state.selectedDoctor?.doctor_id === id ? response.data : state.selectedDoctor,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  deleteDoctor: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await doctorsApi.deleteDoctor(id);
      set((state) => ({
        doctors: state.doctors.filter((d) => d.doctor_id !== id),
        selectedDoctor: state.selectedDoctor?.doctor_id === id ? null : state.selectedDoctor,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  createSpecialization: async (specialization) => {
    set({ isLoading: true, error: null });
    try {
      const response = await doctorsApi.createSpecialization(specialization);
      set((state) => ({
        specializations: [...state.specializations, response.data[0]],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updateSpecialization: async (id: number, specialization) => {
    set({ isLoading: true, error: null });
    try {
      const response = await doctorsApi.updateSpecialization(id, specialization);
      set((state) => ({
        specializations: state.specializations.map((s) =>
          s.specialization_id === id ? { ...s, ...specialization } : s
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  deleteSpecialization: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await doctorsApi.deleteSpecialization(id);
      set((state) => ({
        specializations: state.specializations.filter((s) => s.specialization_id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  createSchedule: async (schedule) => {
    set({ isLoading: true, error: null });
    try {
      const response = await doctorsApi.createSchedule(schedule);
      set((state) => ({
        schedules: [...state.schedules, response.data[0]],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updateSchedule: async (id: number, schedule) => {
    set({ isLoading: true, error: null });
    try {
      const response = await doctorsApi.updateSchedule(id, schedule);
      set((state) => ({
        schedules: state.schedules.map((s) =>
          s.schedule_id === id ? { ...s, ...schedule } : s
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  deleteSchedule: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await doctorsApi.deleteSchedule(id);
      set((state) => ({
        schedules: state.schedules.filter((s) => s.schedule_id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  setSelectedDoctor: (doctor) => {
    set({ selectedDoctor: doctor });
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