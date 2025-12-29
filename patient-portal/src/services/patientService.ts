// patient-portal/src/services/patientService.ts
import { api } from './api';
import type { Patient, Detection } from '../types/detection.types';

export const patientService = {
  async getMyInfo(): Promise<Patient> {
    const response = await api.get<Patient>('/api/v1/patient/me');
    return response.data;
  },

  async getMyDetections(): Promise<Detection[]> {
    const response = await api.get<Detection[]>('/api/v1/patient/detections');
    return response.data;
  },

  async getDetection(detectionId: string): Promise<Detection> {
    const response = await api.get<Detection>(`/api/v1/patient/detection/${detectionId}`);
    return response.data;
  },
};
