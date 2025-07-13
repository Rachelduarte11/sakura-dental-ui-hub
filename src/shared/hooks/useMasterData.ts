import { useEffect, useRef, useState } from 'react';
import { useDistrictsStore } from '../stores/districtsStore';
import { useGendersStore } from '../stores/gendersStore';
import { useDocumentTypesStore } from '../stores/documentTypesStore';
import { useJobTitlesStore } from '../stores/jobTitlesStore';

// Shared promise to prevent concurrent calls
let globalLoadPromise: Promise<void> | null = null;

export const useMasterData = () => {
  const districtsStore = useDistrictsStore();
  const gendersStore = useGendersStore();
  const documentTypesStore = useDocumentTypesStore();
  const jobTitlesStore = useJobTitlesStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isInitializedRef = useRef(false);

  // Debug: Log store states
  useEffect(() => {
    console.log('🔍 useMasterData: Estado actual de stores:', {
      districts: {
        count: districtsStore.districts.length,
        isLoading: districtsStore.isLoading,
        error: districtsStore.error
      },
      genders: {
        count: gendersStore.genders.length,
        isLoading: gendersStore.isLoading,
        error: gendersStore.error
      },
      documentTypes: {
        count: documentTypesStore.documentTypes.length,
        isLoading: documentTypesStore.isLoading,
        error: documentTypesStore.error
      },
      jobTitles: {
        count: jobTitlesStore.jobTitles.length,
        isLoading: jobTitlesStore.isLoading,
        error: jobTitlesStore.error
      }
    });
  }, [
    districtsStore.districts.length,
    districtsStore.isLoading,
    districtsStore.error,
    gendersStore.genders.length,
    gendersStore.isLoading,
    gendersStore.error,
    documentTypesStore.documentTypes.length,
    documentTypesStore.isLoading,
    documentTypesStore.error,
    jobTitlesStore.jobTitles.length,
    jobTitlesStore.isLoading,
    jobTitlesStore.error
  ]);

  // Check if all data is loaded
  const isDataLoaded = () => {
    const loaded = (
      districtsStore.districts.length > 0 &&
      gendersStore.genders.length > 0 &&
      documentTypesStore.documentTypes.length > 0 &&
      jobTitlesStore.jobTitles.length > 0
    );
    console.log('🔍 useMasterData: isDataLoaded =', loaded, {
      districts: districtsStore.districts.length,
      genders: gendersStore.genders.length,
      documentTypes: documentTypesStore.documentTypes.length,
      jobTitles: jobTitlesStore.jobTitles.length
    });
    return loaded;
  };

  // Load all master data sequentially
  const loadAllMasterData = async () => {
    console.log('🚀 useMasterData: loadAllMasterData llamado');
    
    // If already loading globally, wait for the existing promise
    if (globalLoadPromise) {
      console.log('🔄 useMasterData: Esperando carga global en progreso...');
      await globalLoadPromise;
      return;
    }

    // Check if data is already loaded
    if (isInitializedRef.current && isDataLoaded()) {
      console.log('✅ useMasterData: Datos ya cargados, saltando carga...');
      return;
    }

    console.log('🔄 useMasterData: Iniciando carga secuencial de datos maestros...');
    setIsLoading(true);
    setError(null);
    
    // Create global promise to prevent concurrent calls
    globalLoadPromise = (async () => {
      try {
        // Load districts first
        if (districtsStore.districts.length === 0) {
          console.log('🔄 Cargando distritos...');
          await districtsStore.fetchDistricts();
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Load genders
        if (gendersStore.genders.length === 0) {
          console.log('🔄 Cargando géneros...');
          await gendersStore.fetchGenders();
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Load document types
        if (documentTypesStore.documentTypes.length === 0) {
          console.log('🔄 Cargando tipos de documento...');
          await documentTypesStore.fetchDocumentTypes();
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Load job titles
        if (jobTitlesStore.jobTitles.length === 0) {
          console.log('🔄 Cargando cargos...');
          await jobTitlesStore.fetchJobTitles();
        }
        
        isInitializedRef.current = true;
        console.log('✅ useMasterData: Todos los datos maestros cargados exitosamente');
      } catch (error) {
        console.error('❌ useMasterData: Error cargando datos maestros:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        setError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
        globalLoadPromise = null;
      }
    })();

    await globalLoadPromise;
  };

  // Load specific data on demand
  const loadDistricts = async () => {
    console.log('🚀 useMasterData: loadDistricts llamado, distritos actuales:', districtsStore.districts.length);
    if (districtsStore.districts.length === 0) {
      console.log('🔄 Cargando distritos específicamente...');
      setIsLoading(true);
      try {
        await districtsStore.fetchDistricts();
        console.log('✅ Distritos cargados exitosamente');
      } catch (error) {
        console.error('❌ Error cargando distritos:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('✅ Distritos ya cargados, saltando...');
    }
  };

  const loadGenders = async () => {
    console.log('🚀 useMasterData: loadGenders llamado, géneros actuales:', gendersStore.genders.length);
    if (gendersStore.genders.length === 0) {
      console.log('🔄 Cargando géneros específicamente...');
      setIsLoading(true);
      try {
        await gendersStore.fetchGenders();
        console.log('✅ Géneros cargados exitosamente');
      } catch (error) {
        console.error('❌ Error cargando géneros:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('✅ Géneros ya cargados, saltando...');
    }
  };

  const loadDocumentTypes = async () => {
    console.log('🚀 useMasterData: loadDocumentTypes llamado, tipos actuales:', documentTypesStore.documentTypes.length);
    if (documentTypesStore.documentTypes.length === 0) {
      console.log('🔄 Cargando tipos de documento específicamente...');
      setIsLoading(true);
      try {
        await documentTypesStore.fetchDocumentTypes();
        console.log('✅ Tipos de documento cargados exitosamente');
      } catch (error) {
        console.error('❌ Error cargando tipos de documento:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('✅ Tipos de documento ya cargados, saltando...');
    }
  };

  const loadJobTitles = async () => {
    console.log('🚀 useMasterData: loadJobTitles llamado, cargos actuales:', jobTitlesStore.jobTitles.length);
    if (jobTitlesStore.jobTitles.length === 0) {
      console.log('🔄 Cargando cargos específicamente...');
      setIsLoading(true);
      try {
        await jobTitlesStore.fetchJobTitles();
        console.log('✅ Cargos cargados exitosamente');
      } catch (error) {
        console.error('❌ Error cargando cargos:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('✅ Cargos ya cargados, saltando...');
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
    districtsStore.clearError();
    gendersStore.clearError();
    documentTypesStore.clearError();
    jobTitlesStore.clearError();
  };

  // Combine loading states from all stores
  const isAnyStoreLoading = 
    districtsStore.isLoading || 
    gendersStore.isLoading || 
    documentTypesStore.isLoading || 
    jobTitlesStore.isLoading;

  // Combine error states from all stores
  const anyStoreError = 
    districtsStore.error || 
    gendersStore.error || 
    documentTypesStore.error || 
    jobTitlesStore.error;

  // Final loading state
  const finalLoadingState = isLoading || isAnyStoreLoading;
  
  // Final error state
  const finalErrorState = error || anyStoreError;

  return {
    // Data
    districts: districtsStore.districts,
    genders: gendersStore.genders,
    documentTypes: documentTypesStore.documentTypes,
    jobTitles: jobTitlesStore.jobTitles,
    
    // States
    isLoading: finalLoadingState,
    error: finalErrorState,
    isDataLoaded: isDataLoaded(),
    
    // Actions
    loadAllMasterData,
    loadDistricts,
    loadGenders,
    loadDocumentTypes,
    loadJobTitles,
    clearError,
    
    // Individual store actions (if needed)
    districtsStore,
    gendersStore,
    documentTypesStore,
    jobTitlesStore,
  };
}; 