// frontend/src/services/patientService.ts
import { api } from './api';
import type { Patient, PatientCreate, PatientUpdate } from '../types/patient.types';

export const patientService = {
  async createPatient(data: PatientCreate): Promise<Patient> {
    const response = await api.post<Patient>('/patients/', data);
    return response.data;
  },

  async getPatients(skip: number = 0, limit: number = 100): Promise<Patient[]> {
    const response = await api.get<Patient[]>('/patients/', {
      params: { skip, limit },
    });
    return response.data;
  },

  async getPatient(id: string): Promise<Patient> {
    const response = await api.get<Patient>(`/patients/${id}`);
    return response.data;
  },

  async updatePatient(id: string, data: PatientUpdate): Promise<Patient> {
    const response = await api.put<Patient>(`/patients/${id}`, data);
    return response.data;
  },

  async deletePatient(id: string): Promise<void> {
    await api.delete(`/patients/${id}`);
  },
};