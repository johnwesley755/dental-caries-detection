// frontend/src/types/patient.types.ts
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export interface Patient {
  id: string;
  patient_id: string;
  full_name: string;
  age?: number;
  gender?: Gender;
  contact_number?: string;
  email?: string;
  address?: string;
  medical_history?: Record<string, any>;
  created_by: string;
  created_at: string;
  updated_at?: string;
}

export interface PatientCreate {
  full_name: string;
  age?: number;
  gender?: Gender;
  contact_number?: string;
  email?: string;
  address?: string;
  medical_history?: Record<string, any>;
}

export interface PatientUpdate {
  full_name?: string;
  age?: number;
  gender?: Gender;
  contact_number?: string;
  email?: string;
  address?: string;
  medical_history?: Record<string, any>;
}