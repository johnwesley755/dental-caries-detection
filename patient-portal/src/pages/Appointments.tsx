// patient-portal/src/pages/Appointments.tsx
import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, User, Loader2 } from 'lucide-react';
import { appointmentService, Appointment } from '../services/appointmentService';
import { toast } from 'sonner';

export const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    loadAppointments();
  }, [filter]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointments(filter || undefined);
      setAppointments(data);
    } catch (error) {
      console.error('Failed to load appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      await appointmentService.cancelAppointment(appointmentId);
      toast.success('Appointment cancelled successfully');
      loadAppointments();
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
        <p className="text-gray-600">View and manage your dental appointments</p>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('scheduled')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'scheduled' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Scheduled
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Appointments List */}
      {appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => {
            const appointmentDate = new Date(appointment.appointment_date);
            const isUpcoming = appointmentDate > new Date();

            return (
              <div
                key={appointment.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left Side - Date & Time */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-blue-600">
                        {appointmentDate.getDate()}
                      </span>
                      <span className="text-xs text-blue-600 font-medium">
                        {appointmentDate.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.appointment_type || 'Checkup'}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(appointment.appointment_date)}</span>
                          <span className="text-gray-400">•</span>
                          <span>{appointment.duration_minutes || 30} mins</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{appointment.dentist_name}</span>
                        </div>
                        {appointment.notes && (
                          <div className="flex items-start gap-2 mt-2">
                            <MapPin className="h-4 w-4 mt-0.5" />
                            <span className="text-xs">{appointment.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Actions */}
                  {isUpcoming && appointment.status !== 'cancelled' && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button 
                        onClick={() => handleCancel(appointment.id)}
                        className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments</h3>
          <p className="text-gray-600 mb-6">
            {filter ? `No ${filter} appointments found` : "You don't have any appointments"}
          </p>
        </div>
      )}
    </div>
  );
};
