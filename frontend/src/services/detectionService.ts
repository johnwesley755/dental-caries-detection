// frontend/src/services/detectionService.ts
import { api } from './api';
import type { Detection, DetectionCreate } from '../types/detection.types';

export const detectionService = {
  async createDetection(file: File, data: DetectionCreate): Promise<Detection> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patient_id', data.patient_id);
    if (data.image_type) {
      formData.append('image_type', data.image_type);
    }
    if (data.notes) {
      formData.append('notes', data.notes);
    }

    const response = await api.post<Detection>('/detections/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getDetection(id: string): Promise<Detection> {
    const response = await api.get<Detection>(`/detections/${id}`);
    return response.data;
  },

  async getPatientDetections(
    patientId: string,
    skip: number = 0,
    limit: number = 100
  ): Promise<Detection[]> {
    const response = await api.get<Detection[]>(
      `/detections/patient/${patientId}`,
      {
        params: { skip, limit },
      }
    );
    return response.data;
  },
};