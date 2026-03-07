// patient-portal/src/services/appointmentService.ts
import { api } from './api';

export interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  dentist_id: string;
  dentist_name: string;
  appointment_date: string;
  duration_minutes: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  appointment_type: string;
  notes?: string;
  created_at: string;
}

export interface CreateAppointmentData {
  patient_id: string;
  appointment_date: string;
  duration_minutes?: string;
  appointment_type?: string;
  notes?: string;
}

export interface UpdateAppointmentData {
  appointment_date?: string;
  duration_minutes?: string;
  status?: string;
  appointment_type?: string;
  notes?: string;
}

class AppointmentService {
  async getAppointments(status?: string, patientId?: string): Promise<Appointment[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (patientId) params.append('patient_id', patientId);

      const response = await api.get(
        `/appointments?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  async createAppointment(data: CreateAppointmentData): Promise<{ message: string; appointment_id: string }> {
    try {
      const response = await api.post(
        '/appointments',
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  async updateAppointment(appointmentId: string, data: UpdateAppointmentData): Promise<{ message: string }> {
    try {
      const response = await api.put(
        `/appointments/${appointmentId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  }

  async cancelAppointment(appointmentId: string): Promise<{ message: string }> {
    try {
      const response = await api.delete(
        `/appointments/${appointmentId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }
}

export const appointmentService = new AppointmentService();
