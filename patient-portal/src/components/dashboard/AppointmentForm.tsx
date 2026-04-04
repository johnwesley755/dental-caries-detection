// frontend/src/components/dashboard/AppointmentForm.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { appointmentService, type Appointment } from '../../services/appointmentService';
import { patientService } from '../../services/patientService';
import type { Detection } from '../../types/detection.types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { userService } from '../../services/userService';

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
  const [detections, setDetections] = useState<Detection[]>([]);
  const [dentists, setDentists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    appointment_date: '',
    appointment_time: '',
    duration_minutes: '30',
    appointment_type: 'checkup',
    notes: '',
    detection_id: 'none',
    dentist_id: '',
  });

  useEffect(() => {
    loadDetections();
    loadDentists();
    
    if (appointment) {
      // Edit mode
      const date = new Date(appointment.appointment_date);
      setFormData(prev => ({
        ...prev,
        appointment_date: format(date, 'yyyy-MM-dd'),
        appointment_time: format(date, 'HH:mm'),
        duration_minutes: appointment.duration_minutes,
        appointment_type: appointment.appointment_type,
        notes: appointment.notes || '',
        detection_id: appointment.detection_id || 'none',
        dentist_id: appointment.dentist_id || '',
      }));
    } else if (selectedDate) {
      // New appointment with selected date
      setFormData(prev => ({
        ...prev,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: format(selectedDate, 'HH:mm'),
      }));
    }
  }, [appointment, selectedDate]);

  const loadDetections = async () => {
    try {
      const data = await patientService.getMyDetections();
      setDetections(data);
    } catch (error) {
      console.error('Failed to load detections', error);
    }
  };

  const loadDentists = async () => {
    try {
      const data = await userService.getDentists();
      setDentists(data);
    } catch (error) {
      console.error('Failed to load dentists', error);
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
          notes: formData.notes,
        });
        toast.success('Appointment request updated');
      } else {
        // Create new appointment request
        await appointmentService.createAppointment({
          appointment_date: appointmentDateTime,
          duration_minutes: formData.duration_minutes,
          appointment_type: formData.appointment_type,
          notes: formData.notes,
          detection_id: formData.detection_id === 'none' ? undefined : formData.detection_id,
          dentist_id: formData.dentist_id ? formData.dentist_id : undefined,
        });
        toast.success('Appointment requested successfully');
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
          {/* Optional Detection Link */}
          <div>
            <Label>Attach AI Report (Optional)</Label>
            <Select
              value={formData.detection_id}
              onValueChange={(value) => setFormData({ ...formData, detection_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a scan to attach" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No specific report</SelectItem>
                {detections.map((det) => (
                  <SelectItem key={det.id} value={det.id}>
                    Scan #{det.detection_id.substring(0, 8)} ({format(new Date(det.detection_date), 'MMM d, yyyy')})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-1">Linking a scan helps your dentist prepare for your visit.</p>
          </div>

          {/* Dentist Selection */}
          {!appointment && (
            <div>
              <Label>Dentist / Clinic *</Label>
              <Select
                value={formData.dentist_id}
                onValueChange={(value) => setFormData({ ...formData, dentist_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a dentist" />
                </SelectTrigger>
                <SelectContent>
                  {dentists.map((dentist) => (
                    <SelectItem key={dentist.id} value={dentist.id}>
                      Dr. {dentist.full_name || dentist.email}
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

          {/* Status (only for editing) - REMOVED since patients can only request */}

          {/* Notes */}
          <div>
            <Label>Notes</Label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
            <Button type="submit" disabled={loading} className="bg-blue-900 hover:bg-blue-950">
              {loading ? 'Sending...' : appointment ? 'Update' : 'Request'} Appointment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
