export interface Patient {
  patientId: number;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  birthDate?: string;
  dni?: string;
  status: boolean;
  createdAt: string;
  districtId: number;
  genderId: number;
  documentTypeId: number;
}
