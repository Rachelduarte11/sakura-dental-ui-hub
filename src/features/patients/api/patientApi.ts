import { API_ENDPOINTS } from '../../../config/api';
import { apiClient } from '../../../shared/utils/api-client';
import type { Patient } from './types';

export interface PatientApiResponse {
  data: Patient[];
  message?: string;
  error?: string;
}

export interface SinglePatientApiResponse {
  data: Patient;
  message?: string;
  error?: string;
}

export const patientApi = {
  // Obtener todos los pacientes
  getAll: (params?: Record<string, any>): Promise<PatientApiResponse> => 
    apiClient.get(API_ENDPOINTS.PATIENTS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', ''), params),

  // Obtener paciente por ID
  getById: (id: number): Promise<SinglePatientApiResponse> => 
    apiClient.get(`${API_ENDPOINTS.PATIENTS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/${id}`),

  // Crear nuevo paciente
  create: (patient: Omit<Patient, 'patient_id' | 'created_at'>): Promise<SinglePatientApiResponse> => 
    apiClient.post(API_ENDPOINTS.PATIENTS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', ''), patient),

  // Actualizar paciente
  update: (id: number, patient: Partial<Patient>): Promise<SinglePatientApiResponse> => 
    apiClient.put(`${API_ENDPOINTS.PATIENTS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/${id}`, patient),

  // Eliminar paciente
  delete: (id: number): Promise<{ data: void; message?: string }> => 
    apiClient.delete(`${API_ENDPOINTS.PATIENTS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', '')}/${id}`),

  // Buscar pacientes
  search: (query: string): Promise<PatientApiResponse> => 
    apiClient.get(API_ENDPOINTS.PATIENTS.replace(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', ''), { search: query }),
}; 