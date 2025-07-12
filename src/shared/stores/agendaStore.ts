import { create } from 'zustand';

export interface Appointment {
  appointment_id: number;
  patient_id: number;
  employee_id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'PROGRAMADA' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA' | 'NO_SHOW';
  notes?: string;
  created_at: string;
  updated_at: string;
  patient?: {
    first_name: string;
    last_name: string;
    phone?: string;
    email?: string;
  };
  employee?: {
    first_name: string;
    last_name: string;
    specialty?: string;
  };
}

export interface AppointmentSlot {
  start_time: string;
  end_time: string;
  is_available: boolean;
  appointment_id?: number;
}

interface AgendaState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  availableSlots: AppointmentSlot[];
  isLoading: boolean;
  error: string | null;
  filters: {
    date: string | null;
    employeeId: number | null;
    patientId: number | null;
    status: Appointment['status'] | null;
    dateFrom: string | null;
    dateTo: string | null;
  };
}

interface AgendaActions {
  // Fetch actions
  fetchAppointments: () => Promise<void>;
  fetchAppointmentById: (id: number) => Promise<void>;
  fetchAvailableSlots: (date: string, employeeId: number) => Promise<void>;
  
  // CRUD actions for appointments
  createAppointment: (appointment: Omit<Appointment, 'appointment_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateAppointment: (id: number, appointment: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: number) => Promise<void>;
  
  // Business logic actions
  confirmAppointment: (id: number) => Promise<void>;
  cancelAppointment: (id: number, reason?: string) => Promise<void>;
  completeAppointment: (id: number, notes?: string) => Promise<void>;
  markNoShow: (id: number) => Promise<void>;
  rescheduleAppointment: (id: number, newDate: string, newStartTime: string, newEndTime: string) => Promise<void>;
  
  // Utility actions
  checkConflicts: (employeeId: number, date: string, startTime: string, endTime: string, excludeAppointmentId?: number) => Promise<boolean>;
  
  // State management
  setSelectedAppointment: (appointment: Appointment | null) => void;
  setFilters: (filters: Partial<AgendaState['filters']>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAgendaStore = create<AgendaState & AgendaActions>((set, get) => ({
  // State
  appointments: [],
  selectedAppointment: null,
  availableSlots: [],
  isLoading: false,
  error: null,
  filters: {
    date: null,
    employeeId: null,
    patientId: null,
    status: null,
    dateFrom: null,
    dateTo: null,
  },

  // Actions
  fetchAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const params = new URLSearchParams();
      
      if (filters.date) params.append('date', filters.date);
      if (filters.employeeId) params.append('employeeId', filters.employeeId.toString());
      if (filters.patientId) params.append('patientId', filters.patientId.toString());
      if (filters.status) params.append('status', filters.status);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);

      const response = await fetch(`/api/agenda/appointments?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Error al cargar citas');
      }
      const data = await response.json();
      set({ appointments: data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchAppointmentById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/agenda/appointments/${id}`);
      if (!response.ok) {
        throw new Error('Error al cargar cita');
      }
      const data = await response.json();
      set({ selectedAppointment: data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  fetchAvailableSlots: async (date: string, employeeId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/agenda/slots?date=${date}&employeeId=${employeeId}`);
      if (!response.ok) {
        throw new Error('Error al cargar horarios disponibles');
      }
      const data = await response.json();
      set({ availableSlots: data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  createAppointment: async (appointment) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/agenda/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
      });

      if (!response.ok) {
        throw new Error('Error al crear cita');
      }

      const newAppointment = await response.json();
      set((state) => ({
        appointments: [...state.appointments, newAppointment],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  updateAppointment: async (id: number, appointment) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/agenda/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar cita');
      }

      const updatedAppointment = await response.json();
      set((state) => ({
        appointments: state.appointments.map((a) =>
          a.appointment_id === id ? updatedAppointment : a
        ),
        selectedAppointment: state.selectedAppointment?.appointment_id === id ? updatedAppointment : state.selectedAppointment,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  deleteAppointment: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/agenda/appointments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar cita');
      }

      set((state) => ({
        appointments: state.appointments.filter((a) => a.appointment_id !== id),
        selectedAppointment: state.selectedAppointment?.appointment_id === id ? null : state.selectedAppointment,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  confirmAppointment: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/agenda/appointments/${id}/confirm`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Error al confirmar cita');
      }

      const updatedAppointment = await response.json();
      set((state) => ({
        appointments: state.appointments.map((a) =>
          a.appointment_id === id ? updatedAppointment : a
        ),
        selectedAppointment: state.selectedAppointment?.appointment_id === id ? updatedAppointment : state.selectedAppointment,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  cancelAppointment: async (id: number, reason?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/agenda/appointments/${id}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Error al cancelar cita');
      }

      const updatedAppointment = await response.json();
      set((state) => ({
        appointments: state.appointments.map((a) =>
          a.appointment_id === id ? updatedAppointment : a
        ),
        selectedAppointment: state.selectedAppointment?.appointment_id === id ? updatedAppointment : state.selectedAppointment,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  completeAppointment: async (id: number, notes?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/agenda/appointments/${id}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) {
        throw new Error('Error al completar cita');
      }

      const updatedAppointment = await response.json();
      set((state) => ({
        appointments: state.appointments.map((a) =>
          a.appointment_id === id ? updatedAppointment : a
        ),
        selectedAppointment: state.selectedAppointment?.appointment_id === id ? updatedAppointment : state.selectedAppointment,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  markNoShow: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/agenda/appointments/${id}/no-show`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Error al marcar como no asistió');
      }

      const updatedAppointment = await response.json();
      set((state) => ({
        appointments: state.appointments.map((a) =>
          a.appointment_id === id ? updatedAppointment : a
        ),
        selectedAppointment: state.selectedAppointment?.appointment_id === id ? updatedAppointment : state.selectedAppointment,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  rescheduleAppointment: async (id: number, newDate: string, newStartTime: string, newEndTime: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/agenda/appointments/${id}/reschedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointment_date: newDate,
          start_time: newStartTime,
          end_time: newEndTime,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al reprogramar cita');
      }

      const updatedAppointment = await response.json();
      set((state) => ({
        appointments: state.appointments.map((a) =>
          a.appointment_id === id ? updatedAppointment : a
        ),
        selectedAppointment: state.selectedAppointment?.appointment_id === id ? updatedAppointment : state.selectedAppointment,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
    }
  },

  checkConflicts: async (employeeId: number, date: string, startTime: string, endTime: string, excludeAppointmentId?: number): Promise<boolean> => {
    try {
      const params = new URLSearchParams({
        employeeId: employeeId.toString(),
        date,
        startTime,
        endTime,
      });
      
      if (excludeAppointmentId) {
        params.append('excludeAppointmentId', excludeAppointmentId.toString());
      }

      const response = await fetch(`/api/agenda/check-conflicts?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Error al verificar conflictos');
      }
      
      const { hasConflicts } = await response.json();
      return hasConflicts;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
      return true; // Asumir que hay conflicto en caso de error
    }
  },

  setSelectedAppointment: (appointment) => {
    set({ selectedAppointment: appointment });
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