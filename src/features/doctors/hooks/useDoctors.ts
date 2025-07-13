import { useCallback, useEffect } from 'react';
import { useDoctorsStore } from '../store/doctorsStore';
import type { 
  CreateDoctorRequest, 
  UpdateDoctorRequest,
  CreateScheduleRequest,
  UpdateScheduleRequest,
  DoctorFilters 
} from '../api/types';

export const useDoctors = () => {
  const {
    doctors,
    specializations,
    schedules,
    doctorStats,
    doctorAvailability,
    selectedDoctor,
    isLoading,
    error,
    filters,
    fetchDoctors,
    fetchDoctorById,
    fetchSpecializations,
    fetchDoctorSchedules,
    fetchDoctorStats,
    fetchDoctorAvailability,
    fetchActiveDoctors,
    fetchDoctorsBySpecialization,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    createSpecialization,
    updateSpecialization,
    deleteSpecialization,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    setSelectedDoctor,
    setFilters,
    clearError,
    setLoading,
  } = useDoctorsStore();

  // Computed values
  const activeDoctors = doctors.filter((doctor) => doctor.status);

  const doctorsBySpecialization = (specializationId: number) =>
    doctors.filter((doctor) => doctor.specialization === specializations.find(s => s.specialization_id === specializationId)?.name);

  const availableDoctors = doctorAvailability.filter((availability) => availability.is_available_today);

  const totalSalary = doctors.reduce((total, doctor) => total + doctor.salary, 0);

  const averageCommission = doctors.length > 0 
    ? doctors.reduce((total, doctor) => total + doctor.commission_percentage, 0) / doctors.length 
    : 0;

  // Enhanced actions with error handling
  const handleCreateDoctor = useCallback(
    async (doctor: CreateDoctorRequest) => {
      try {
        await createDoctor(doctor);
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
      }
    },
    [createDoctor]
  );

  const handleUpdateDoctor = useCallback(
    async (id: number, doctor: UpdateDoctorRequest) => {
      try {
        await updateDoctor(id, doctor);
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
      }
    },
    [updateDoctor]
  );

  const handleDeleteDoctor = useCallback(
    async (id: number) => {
      try {
        await deleteDoctor(id);
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
      }
    },
    [deleteDoctor]
  );

  const handleCreateSpecialization = useCallback(
    async (specialization: Omit<import('../api/types').DoctorSpecialization, 'specialization_id'>) => {
      try {
        await createSpecialization(specialization);
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
      }
    },
    [createSpecialization]
  );

  const handleUpdateSpecialization = useCallback(
    async (id: number, specialization: Partial<import('../api/types').DoctorSpecialization>) => {
      try {
        await updateSpecialization(id, specialization);
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
      }
    },
    [updateSpecialization]
  );

  const handleDeleteSpecialization = useCallback(
    async (id: number) => {
      try {
        await deleteSpecialization(id);
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
      }
    },
    [deleteSpecialization]
  );

  const handleCreateSchedule = useCallback(
    async (schedule: CreateScheduleRequest) => {
      try {
        await createSchedule(schedule);
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
      }
    },
    [createSchedule]
  );

  const handleUpdateSchedule = useCallback(
    async (id: number, schedule: UpdateScheduleRequest) => {
      try {
        await updateSchedule(id, schedule);
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
      }
    },
    [updateSchedule]
  );

  const handleDeleteSchedule = useCallback(
    async (id: number) => {
      try {
        await deleteSchedule(id);
        return { success: true };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
      }
    },
    [deleteSchedule]
  );

  // Filter actions
  const handleSearchDoctors = useCallback(
    (search: string) => {
      setFilters({ search });
    },
    [setFilters]
  );

  const handleFilterBySpecialization = useCallback(
    (specializationId: number | null) => {
      setFilters({ specializationId });
    },
    [setFilters]
  );

  const handleFilterByStatus = useCallback(
    (status: boolean | null) => {
      setFilters({ status });
    },
    [setFilters]
  );

  const handleFilterByAvailability = useCallback(
    (availability: boolean | null) => {
      setFilters({ availability });
    },
    [setFilters]
  );

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      specializationId: null,
      status: null,
      availability: null,
    });
  }, [setFilters]);

  // Utility functions
  const getDayName = useCallback((dayOfWeek: number) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[dayOfWeek] || 'Desconocido';
  }, []);

  const formatTime = useCallback((time: string) => {
    return time.substring(0, 5); // Remove seconds if present
  }, []);

  const getDoctorFullName = useCallback((doctor: import('../api/types').Doctor) => {
    return `${doctor.first_name} ${doctor.last_name}`;
  }, []);

  // Auto-refresh data when filters change
  useEffect(() => {
    fetchDoctors();
  }, [filters, fetchDoctors]);

  return {
    // State
    doctors,
    specializations,
    schedules,
    doctorStats,
    doctorAvailability,
    selectedDoctor,
    isLoading,
    error,
    filters,
    
    // Computed values
    activeDoctors,
    doctorsBySpecialization,
    availableDoctors,
    totalSalary,
    averageCommission,
    
    // Actions
    fetchDoctors,
    fetchDoctorById,
    fetchSpecializations,
    fetchDoctorSchedules,
    fetchDoctorStats,
    fetchDoctorAvailability,
    fetchActiveDoctors,
    fetchDoctorsBySpecialization,
    
    // Enhanced actions
    handleCreateDoctor,
    handleUpdateDoctor,
    handleDeleteDoctor,
    handleCreateSpecialization,
    handleUpdateSpecialization,
    handleDeleteSpecialization,
    handleCreateSchedule,
    handleUpdateSchedule,
    handleDeleteSchedule,
    
    // Filter actions
    handleSearchDoctors,
    handleFilterBySpecialization,
    handleFilterByStatus,
    handleFilterByAvailability,
    clearFilters,
    
    // Utility functions
    getDayName,
    formatTime,
    getDoctorFullName,
    
    // State management
    setSelectedDoctor,
    setFilters,
    clearError,
    setLoading,
  };
}; 