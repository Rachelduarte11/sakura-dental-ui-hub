// Auth Store
export { useAuthStore } from './authStore';
export type { User, Role, Permission } from './authStore';

// Patient Store
export { usePatientStore } from './patientStore';
export type { Patient } from './patientStore';

// Service Store
export { useServiceStore } from './serviceStore';
export type { Service } from './serviceStore';

// Quotation Store
export { useQuotationStore } from './quotationStore';
export type { Quotation, QuotationItem, ClinicalHistory } from './quotationStore';

// Payment Store
export { usePaymentStore } from './paymentStore';
export type { Payment, Receipt } from './paymentStore';

// Employee Store
export { useEmployeeStore } from './employeeStore';
export type { Employee } from './employeeStore';

// Agenda Store
export { useAgendaStore } from './agendaStore';
export type { Appointment, AppointmentSlot } from './agendaStore';

// Master Data Store - Contains all shared types
export { useMasterDataStore } from './masterDataStore';
export type { 
  MasterData, 
  District, 
  Gender, 
  DocumentType, 
  PaymentMethod, 
  JobTitle, 
  CategoryService 
} from './masterDataStore';

// Inventory Store
export { useInventoryStore } from './inventoryStore';
export type { InventoryItem, InventoryCategory } from './inventoryStore'; 