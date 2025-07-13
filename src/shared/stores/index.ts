// Export all stores
export * from './authStore';
export * from './patientStore';
export * from './agendaStore';
export * from './employeeStore';
export * from './inventoryStore';
export * from './paymentStore';
export * from './quotationStore';
export * from './serviceStore';
export * from '../../features/services/store/categorieServiceStore';

// Export new modularized stores (these replace the old masterDataStore exports)
export * from './districtsStore';
export * from './gendersStore';
export * from './documentTypesStore';
export * from './jobTitlesStore';

// Export types from masterDataStore that are not duplicated
export type { 
  PaymentMethod, 
  CategoryService 
} from './masterDataStore';

// Re-export JobTitle from jobTitlesStore to avoid conflicts
export type { JobTitle } from './jobTitlesStore'; 