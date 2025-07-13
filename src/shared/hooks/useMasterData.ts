import { useEffect, useRef } from 'react';
import { useDistrictsStore } from '../stores/districtsStore';
import { useGendersStore } from '../stores/gendersStore';
import { useDocumentTypesStore } from '../stores/documentTypesStore';
import { useJobTitlesStore } from '../stores/jobTitlesStore';

// Global loading state to prevent duplicate calls
let isLoadingGlobal = false;
let isInitialized = false;

export const useMasterData = () => {
  const districtsStore = useDistrictsStore();
  const gendersStore = useGendersStore();
  const documentTypesStore = useDocumentTypesStore();
  const jobTitlesStore = useJobTitlesStore();
  
  const hasInitialized = useRef(false);

  // Load all master data sequentially to avoid concurrency issues
  const loadAllMasterData = async () => {
    // Prevent duplicate calls
    if (isLoadingGlobal) {
      console.log('🔄 useMasterData: Carga ya en progreso, esperando...');
      return;
    }

    // Check if data is already loaded
    if (isInitialized && 
        districtsStore.districts.length > 0 && 
        gendersStore.genders.length > 0 && 
        documentTypesStore.documentTypes.length > 0 && 
        jobTitlesStore.jobTitles.length > 0) {
      console.log('✅ useMasterData: Datos ya cargados, saltando carga...');
      return;
    }

    console.log('🔄 useMasterData: Iniciando carga secuencial de datos maestros...');
    isLoadingGlobal = true;
    
    try {
      // Load districts first
      if (districtsStore.districts.length === 0) {
        await districtsStore.fetchDistricts();
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Load genders
      if (gendersStore.genders.length === 0) {
        await gendersStore.fetchGenders();
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Load document types
      if (documentTypesStore.documentTypes.length === 0) {
        await documentTypesStore.fetchDocumentTypes();
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Load job titles
      if (jobTitlesStore.jobTitles.length === 0) {
        await jobTitlesStore.fetchJobTitles();
      }
      
      isInitialized = true;
      console.log('✅ useMasterData: Todos los datos maestros cargados exitosamente');
    } catch (error) {
      console.error('❌ useMasterData: Error cargando datos maestros:', error);
    } finally {
      isLoadingGlobal = false;
    }
  };

  // Auto-load data on mount only once
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      loadAllMasterData();
    }
  }, []);

  // Combine loading states
  const isLoading = districtsStore.isLoading || gendersStore.isLoading || documentTypesStore.isLoading || jobTitlesStore.isLoading || isLoadingGlobal;
  
  // Combine error states
  const error = districtsStore.error || gendersStore.error || documentTypesStore.error || jobTitlesStore.error;
  
  // Combine data
  const districts = districtsStore.districts;
  const genders = gendersStore.genders;
  const documentTypes = documentTypesStore.documentTypes;
  const jobTitles = jobTitlesStore.jobTitles;

  return {
    // Data
    districts,
    genders,
    documentTypes,
    jobTitles,
    
    // States
    isLoading,
    error,
    
    // Actions
    loadAllMasterData,
    
    // Individual store actions (if needed)
    districtsStore,
    gendersStore,
    documentTypesStore,
    jobTitlesStore,
  };
}; 