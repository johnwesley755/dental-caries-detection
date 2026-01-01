// frontend/src/services/appointmentService.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }

  async getAppointments(status?: string, patientId?: string): Promise<Appointment[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (patientId) params.append('patient_id', patientId);

      const response = await axios.get(
        `${API_URL}/api/v1/appointments?${params.toString()}`,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  async createAppointment(data: CreateAppointmentData): Promise<{ message: string; appointment_id: string }> {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/appointments`,
        data,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  async updateAppointment(appointmentId: string, data: UpdateAppointmentData): Promise<{ message: string }> {
    try {
      const response = await axios.put(
        `${API_URL}/api/v1/appointments/${appointmentId}`,
        data,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  }

  async cancelAppointment(appointmentId: string): Promise<{ message: string }> {
    try {
      const response = await axios.delete(
        `${API_URL}/api/v1/appointments/${appointmentId}`,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }
}

export const appointmentService = new AppointmentService();
