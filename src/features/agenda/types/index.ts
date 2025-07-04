export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  color: string;
  email?: string;
  phone?: string;
}

export interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  dni?: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  serviceId: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  patient?: Patient;
  doctor?: Doctor;
  service?: Service;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  appointments: Appointment[];
}

export interface AppointmentFormData {
  patientId: string;
  doctorId: string;
  serviceId: string;
  date: string;
  startTime: string;
  notes?: string;
} 