export interface Patient {
  patientId: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  dni?: string;
  status: boolean;
  createdAt: string;
  districtId: number;
  genderId: number;
  documentTypeId: number;
}

export interface District {
  districtId: number;
  name: string;
  status: boolean;
}

export interface Gender {
  genderId: number;
  code: string;
  name: string;
  status: boolean;
}

export interface DocumentType {
  documentTypeId: number;
  code: string;
  name: string;
  status: boolean;
}

export interface PatientFilters {
  search: string;
  status: boolean | null;
  districtId?: number;
  genderId?: number;
} 