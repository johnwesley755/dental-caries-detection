// frontend/src/components/dashboard/AppointmentForm.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { appointmentService, type Appointment } from '../../services/appointmentService';
import { patientService } from '../../services/patientService';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedDate?: Date | null;
  appointment?: Appointment | null;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedDate,
  appointment,
}) => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: '',
    appointment_date: '',
    appointment_time: '',
    duration_minutes: '30',
    appointment_type: 'checkup',
    status: 'scheduled',
    notes: '',
  });

  useEffect(() => {
    loadPatients();
    
    if (appointment) {
      // Edit mode
      const date = new Date(appointment.appointment_date);
      setFormData({
        patient_id: appointment.patient_id,
        appointment_date: format(date, 'yyyy-MM-dd'),
        appointment_time: format(date, 'HH:mm'),
        duration_minutes: appointment.duration_minutes,
        appointment_type: appointment.appointment_type,
        status: appointment.status,
        notes: appointment.notes || '',
      });
    } else if (selectedDate) {
      // New appointment with selected date
      setFormData(prev => ({
        ...prev,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: format(selectedDate, 'HH:mm'),
      }));
    }
  }, [appointment, selectedDate]);

  const loadPatients = async () => {
    try {
      const data = await patientService.getPatients();
      setPatients(data);
    } catch (error) {
      toast.error('Failed to load patients');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const appointmentDateTime = `${formData.appointment_date}T${formData.appointment_time}:00`;

      if (appointment) {
        // Update existing appointment
        await appointmentService.updateAppointment(appointment.id, {
          appointment_date: appointmentDateTime,
          duration_minutes: formData.duration_minutes,
          appointment_type: formData.appointment_type,
          status: formData.status,
          notes: formData.notes,
        });
        toast.success('Appointment updated successfully');
      } else {
        // Create new appointment
        await appointmentService.createAppointment({
          patient_id: formData.patient_id,
          appointment_date: appointmentDateTime,
          duration_minutes: formData.duration_minutes,
          appointment_type: formData.appointment_type,
          notes: formData.notes,
        });
        toast.success('Appointment created successfully');
      }

      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!appointment) return;

    if (confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.cancelAppointment(appointment.id);
        toast.success('Appointment cancelled');
        onSuccess();
      } catch (error) {
        toast.error('Failed to cancel appointment');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {appointment ? 'Edit Appointment' : 'Schedule New Appointment'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Selection */}
          {!appointment && (
            <div>
              <Label>Patient *</Label>
              <Select
                value={formData.patient_id}
                onValueChange={(value) => setFormData({ ...formData, patient_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.full_name} ({patient.patient_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date *</Label>
              <Input
                type="date"
                value={formData.appointment_date}
                onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Time *</Label>
              <Input
                type="time"
                value={formData.appointment_time}
                onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Duration and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Duration (minutes)</Label>
              <Select
                value={formData.duration_minutes}
                onValueChange={(value) => setFormData({ ...formData, duration_minutes: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Appointment Type</Label>
              <Select
                value={formData.appointment_type}
                onValueChange={(value) => setFormData({ ...formData, appointment_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checkup">Checkup</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="treatment">Treatment</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status (only for editing) */}
          {appointment && (
            <div>
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no_show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label>Notes</Label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any notes or special instructions..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {appointment && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleCancel}
                className="mr-auto"
              >
                Cancel Appointment
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : appointment ? 'Update' : 'Create'} Appointment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
