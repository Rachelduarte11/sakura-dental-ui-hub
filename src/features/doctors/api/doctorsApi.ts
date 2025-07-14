import { API_ENDPOINTS } from '../../../config/api';
import { apiClient } from '../../../shared/utils/api-client';
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
} from './types';

export interface DoctorsApiResponse {
  data: Doctor[];
  message?: string;
  error?: string;
}

export interface SingleDoctorApiResponse {
  data: DoctorWithDetails;
  message?: string;
  error?: string;
}

export interface SpecializationsApiResponse {
  data: DoctorSpecialization[];
  message?: string;
  error?: string;
}

export interface SchedulesApiResponse {
  data: DoctorSchedule[];
  message?: string;
  error?: string;
}

export interface DoctorStatsApiResponse {
  data: DoctorStats;
  message?: string;
  error?: string;
}

export interface DoctorAvailabilityApiResponse {
  data: DoctorAvailability[];
  message?: string;
  error?: string;
}

export const doctorsApi = {
  // Obtener todos los doctores
  getAllDoctors: (params?: DoctorFilters): Promise<DoctorsApiResponse> => 
    apiClient.get(API_ENDPOINTS.DOCTORS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '') + '/doctors', params),

  // Obtener doctor por ID
  getDoctorById: (id: number): Promise<SingleDoctorApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.DOCTORS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/doctors/${id}`),

  // Crear nuevo doctor
  createDoctor: (doctor: CreateDoctorRequest): Promise<SingleDoctorApiResponse> => 
    apiClient.post(API_ENDPOINTS.DOCTORS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '') + '/doctors', doctor),

  // Actualizar doctor
  updateDoctor: (id: number, doctor: UpdateDoctorRequest): Promise<SingleDoctorApiResponse> => 
    apiClient.put(`${API_ENDPOINTS.DOCTORS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/doctors/${id}`, doctor),

  // Eliminar doctor
  deleteDoctor: (id: number): Promise<{ data: void; message?: string }> => 
    apiClient.delete(`${API_ENDPOINTS.DOCTORS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/doctors/${id}`),

  // Obtener especializaciones
  getSpecializations: (): Promise<SpecializationsApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.DOCTORS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/specializations`),

  // Crear especialización
  createSpecialization: (specialization: Omit<DoctorSpecialization, 'specialization_id'>): Promise<SpecializationsApiResponse> => 
    apiClient.post(`${API_ENDPOINTS.DOCTORS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/specializations`, specialization),

  // Actualizar especialización
  updateSpecialization: (id: number, specialization: Partial<DoctorSpecialization>): Promise<SpecializationsApiResponse> => 
    apiClient.put(`${API_ENDPOINTS.DOCTORS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/specializations/${id}`, specialization),

  // Eliminar especialización
  deleteSpecialization: (id: number): Promise<{ data: void; message?: string }> => 
    apiClient.delete(`${API_ENDPOINTS.DOCTORS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/specializations/${id}`),

  // Obtener horarios de un doctor
  getDoctorSchedules: (doctorId: number): Promise<SchedulesApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.DOCTORS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/doctors/${doctorId}/schedules`),

  // Crear horario para un doctor
  createSchedule: (schedule: CreateScheduleRequest): Promise<SchedulesApiResponse> => 
    apiClient.post(`${API_ENDPOINTS.DOCTORS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/schedules`, schedule),

  // Actualizar horario
  updateSchedule: (id: number, schedule: UpdateScheduleRequest): Promise<SchedulesApiResponse> => 
    apiClient.put(`${API_ENDPOINTS.DOCTORS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/schedules/${id}`, schedule),

  // Eliminar horario
  deleteSchedule: (id: number): Promise<{ data: void; message?: string }> => 
    apiClient.delete(`${API_ENDPOINTS.DOCTORS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/schedules/${id}`),

  // Obtener estadísticas de doctores
  getDoctorStats: (): Promise<DoctorStatsApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.DOCTORS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/stats`),

  // Obtener disponibilidad de doctores
  getDoctorAvailability: (date?: string): Promise<DoctorAvailabilityApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.DOCTORS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/availability`, date ? { date } : undefined),

  // Obtener doctores activos
  getActiveDoctors: (): Promise<DoctorsApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.DOCTORS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/doctors/active`),

  // Obtener doctores por especialización
  getDoctorsBySpecialization: (specializationId: number): Promise<DoctorsApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.DOCTORS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/doctors/specialization/${specializationId}`),

  // Buscar doctores
  searchDoctors: (query: string): Promise<DoctorsApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.DOCTORS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/doctors`, { search: query }),

  // Obtener doctores disponibles para una fecha
  getAvailableDoctors: (date: string, time?: string): Promise<DoctorsApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.DOCTORS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/doctors/available`, { date, time }),

  // Obtener historial de citas de un doctor
  getDoctorAppointments: (doctorId: number, startDate?: string, endDate?: string): Promise<any> => 
    apiClient.get(`${API_ENDPOINTS.DOCTORS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/doctors/${doctorId}/appointments`, { start_date: startDate, end_date: endDate }),

  // Obtener pacientes de un doctor
  getDoctorPatients: (doctorId: number): Promise<any> => 
    apiClient.get(`${API_ENDPOINTS.DOCTORS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/doctors/${doctorId}/patients`),
}; 