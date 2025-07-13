import { useEffect, useCallback } from 'react';
import { usePatientStore } from '../store/patientStore';
import type { Patient, PatientFilters } from '../api/types';

export const usePatients = () => {
  const {
    patients,
    selectedPatient,
    isLoading,
    error,
    filters,
    fetchPatients,
    fetchPatientById,
    createPatient,
    updatePatient,
    deletePatient,
    setSelectedPatient,
    setFilters,
    clearError,
  } = usePatientStore();

  // Cargar pacientes al montar el componente
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Hook para manejar búsqueda
  const handleSearch = useCallback((search: string) => {
    setFilters({ search });
  }, [setFilters]);

  // Hook para manejar filtros de estado
  const handleStatusFilter = useCallback((status: boolean | null) => {
    setFilters({ status });
  }, [setFilters]);

  // Hook para limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters({ search: '', status: null });
  }, [setFilters]);

  // Hook para obtener paciente por ID
  const getPatientById = useCallback(async (id: number) => {
    await fetchPatientById(id);
  }, [fetchPatientById]);

  // Hook para crear paciente
  const handleCreatePatient = useCallback(async (patient: Omit<Patient, 'patient_id' | 'created_at'>) => {
    await createPatient(patient);
  }, [createPatient]);

  // Hook para actualizar paciente
  const handleUpdatePatient = useCallback(async (id: number, patient: Partial<Patient>) => {
    await updatePatient(id, patient);
  }, [updatePatient]);

  // Hook para eliminar paciente
  const handleDeletePatient = useCallback(async (id: number) => {
    await deletePatient(id);
  }, [deletePatient]);

  // Hook para seleccionar paciente
  const selectPatient = useCallback((patient: Patient | null) => {
    setSelectedPatient(patient);
  }, [setSelectedPatient]);

  // Hook para limpiar error
  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    // State
    patients,
    selectedPatient,
    isLoading,
    error,
    filters,
    
    // Actions
    fetchPatients,
    handleSearch,
    handleStatusFilter,
    clearFilters,
    getPatientById,
    handleCreatePatient,
    handleUpdatePatient,
    handleDeletePatient,
    selectPatient,
    handleClearError,
  };
};

// Hook específico para un paciente individual
export const usePatient = (patientId?: number) => {
  const { selectedPatient, isLoading, error, fetchPatientById } = usePatientStore();

  useEffect(() => {
    if (patientId) {
      fetchPatientById(patientId);
    }
  }, [patientId, fetchPatientById]);

  return {
    patient: selectedPatient,
    isLoading,
    error,
  };
};

// Hook para filtros de pacientes
export const usePatientFilters = () => {
  const { filters, setFilters } = usePatientStore();

  const updateFilters = useCallback((newFilters: Partial<PatientFilters>) => {
    setFilters(newFilters);
  }, [setFilters]);

  const resetFilters = useCallback(() => {
    setFilters({ search: '', status: null });
  }, [setFilters]);

  return {
    filters,
    updateFilters,
    resetFilters,
  };
}; 