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

  async uploadDetection(file: File, notes?: string): Promise<Detection> {
    const formData = new FormData();
    formData.append('file', file);
    if (notes) formData.append('notes', notes);

    const response = await api.post<Detection>('/api/v1/patient/detections', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
