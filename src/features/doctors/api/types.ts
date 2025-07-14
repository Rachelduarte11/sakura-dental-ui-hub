export interface Doctor {
  doctor_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dni: string;
  license_number: string;
  specialization: string;
  status: boolean;
  hire_date: string;
  salary: number;
  commission_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface DoctorWithDetails extends Doctor {
  appointments_count?: number;
  patients_count?: number;
  total_earnings?: number;
  average_rating?: number;
}

export interface DoctorSpecialization {
  specialization_id: number;
  name: string;
  description?: string;
  status: boolean;
}

export interface DoctorSchedule {
  schedule_id: number;
  doctor_id: number;
  day_of_week: number; // 0 = Domingo, 1 = Lunes, etc.
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
}

export interface DoctorFilters {
  search: string;
  specializationId: number | null;
  status: boolean | null;
  availability: boolean | null;
}

export interface CreateDoctorRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dni: string;
  license_number: string;
  specialization: string;
  salary: number;
  commission_percentage: number;
  hire_date: string;
}

export interface UpdateDoctorRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  dni?: string;
  license_number?: string;
  specialization?: string;
  salary?: number;
  commission_percentage?: number;
  status?: boolean;
}

export interface CreateScheduleRequest {
  doctor_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface UpdateScheduleRequest {
  start_time?: string;
  end_time?: string;
  is_available?: boolean;
}

export interface DoctorStats {
  total_doctors: number;
  active_doctors: number;
  total_appointments: number;
  total_patients: number;
  average_rating: number;
  total_earnings: number;
}

export interface DoctorAvailability {
  doctor_id: number;
  doctor_name: string;
  available_days: number[];
  total_hours_per_week: number;
  appointments_today: number;
  is_available_today: boolean;
} 