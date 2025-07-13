export interface Patient {
  patient_id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  doc_number?: string;
  status: boolean;
  created_at: string;
  district_id: number;
  gender_id: number;
  document_type_id: number;
}

export interface District {
  district_id: number;
  name: string;
  status: boolean;
}

export interface Gender {
  gender_id: number;
  code: string;
  name: string;
  status: boolean;
}

export interface DocumentType {
  document_type_id: number;
  code: string;
  name: string;
  status: boolean;
}

export interface PatientFilters {
  search: string;
  status: boolean | null;
  district_id?: number;
  gender_id?: number;
} 