// patient-portal/src/pages/Appointments.tsx
import React from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

export const Appointments: React.FC = () => {
  // Mock appointments data
  const appointments = [
    {
      id: 1,
      date: '2026-01-05',
      time: '10:00 AM',
      dentist: 'Dr. Sarah Johnson',
      type: 'Regular Checkup',
      location: 'Main Clinic',
      status: 'upcoming'
    },
    {
      id: 2,
      date: '2026-01-12',
      time: '2:30 PM',
      dentist: 'Dr. Michael Chen',
      type: 'Teeth Cleaning',
      location: 'Downtown Branch',
      status: 'upcoming'
    }
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
        <p className="text-gray-600">View and manage your upcoming dental appointments</p>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Left Side - Date & Time */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-50 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-blue-600">
                    {new Date(appointment.date).getDate()}
                  </span>
                  <span className="text-xs text-blue-600 font-medium">
                    {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{appointment.type}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{appointment.dentist}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{appointment.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Actions */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Reschedule
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {appointments.length === 0 && (
        <div className="text-center py-16">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments</h3>
          <p className="text-gray-600 mb-6">You don't have any upcoming appointments</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Book Appointment
          </button>
        </div>
      )}
    </div>
  );
};
