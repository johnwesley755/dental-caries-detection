// patient-portal/src/pages/Appointments.tsx
import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, Plus, Search, ShieldCheck, AlertCircle } from 'lucide-react';
import { appointmentService, Appointment } from '../services/appointmentService';
import { toast } from 'sonner';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { AppointmentForm } from '../components/dashboard/AppointmentForm';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [showForm, setShowForm] = useState(false);

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
    if (!confirm('Are you sure you want to cancel this clinical appointment?')) return;

    try {
      await appointmentService.cancelAppointment(appointmentId);
      toast.success('Appointment cancelled successfully');
      loadAppointments();
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      toast.error('Failed to cancel appointment');
    }
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
        return 'bg-blue-50 text-primary border-blue-100';
      case 'completed':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'cancelled':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'pending_approval':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50">
        <LoadingSpinner size="md" text="Syncing schedule..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 p-4 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
             <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary shadow-inner">
                   <Calendar className="h-5 w-5" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Appointment Center</h1>
             </div>
             <p className="text-slate-500 font-bold tracking-tight">Schedule and manage your personal clinical consultations</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-blue-900 text-white px-8 h-12 rounded-2xl shadow-xl shadow-primary/20 font-black text-[10px] transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" strokeWidth={3} />
            Request Slot
          </Button>
        </div>

        {/* Filter Section */}
        <div className="flex items-center gap-3 p-1 bg-white border border-slate-100 rounded-2xl w-fit shadow-sm">
          {[
            { label: 'All Events', value: '' },
            { label: 'Upcoming', value: 'scheduled' },
            { label: 'History', value: 'completed' }
          ].map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all ${filter === btn.value
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        {appointments.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {appointments.map((appointment) => {
              const appointmentDate = new Date(appointment.appointment_date);
              const isUpcoming = appointmentDate > new Date();

              return (
                <div
                  key={appointment.id}
                  className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-white p-8 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    {/* Left Side - Date & Time */}
                    <div className="flex items-center gap-8 flex-1">
                      <div className="w-20 h-20 bg-blue-50 rounded-[1.5rem] flex flex-col items-center justify-center flex-shrink-0 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <span className="text-3xl font-black tracking-tighter leading-none mb-1">
                          {appointmentDate.getDate()}
                        </span>
                        <span className="text-[10px] font-black opacity-60">
                          {appointmentDate.toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4 flex-wrap">
                          <h3 className="text-xl font-black text-slate-900 tracking-tight">
                            {appointment.appointment_type || 'General Consultation'}
                          </h3>
                          <Badge variant="outline" className={`px-3 py-1 rounded-xl text-[10px] font-black border-2 ${getStatusColor(appointment.status)}`}>
                            {appointment.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-6 flex-wrap">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Clock className="h-4 w-4" />
                            <span className="text-xs font-bold">{formatTime(appointment.appointment_date)}</span>
                            <span className="opacity-30 mx-1">•</span>
                            <span className="text-xs font-bold">{appointment.duration_minutes || 30} MINS</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <User className="h-4 w-4" />
                            <span className="text-xs font-bold tracking-tight">{appointment.dentist_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                             <ShieldCheck className="h-4 w-4 text-emerald-500" />
                             <span className="text-[10px] font-black">Verified Specialist</span>
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 max-w-2xl">
                            <Search className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                            <p className="text-[10px] font-bold text-slate-500 leading-relaxed tracking-tight">
                              Context: {typeof appointment.notes === 'string' ? appointment.notes : JSON.stringify(appointment.notes)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex items-center gap-3">
                       <Button
                          variant="outline"
                          className="px-6 h-12 rounded-[1.25rem] border-2 border-slate-100 hover:bg-slate-50 text-slate-400 font-black text-[10px]"
                          onClick={() => toast.info('Coming soon: Add to Calendar')}
                       >
                          Add to Calendar
                       </Button>
                       {isUpcoming && appointment.status !== 'cancelled' && (
                         <Button
                            variant="destructive"
                            onClick={() => handleCancel(appointment.id)}
                            className="bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border-2 border-red-100 hover:border-red-500 rounded-[1.25rem] h-12 px-8 font-black text-[10px] shadow-xl shadow-red-900/5 transition-all"
                         >
                            Cancel Slot
                         </Button>
                       )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <Card className="border-none shadow-2xl shadow-blue-900/5 rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-xl">
            <CardContent className="py-24 text-center space-y-6">
              <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                <Calendar className="h-10 w-10 text-primary opacity-30" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Scheduled Events</h3>
                <p className="text-slate-400 font-bold max-w-sm mx-auto">
                  {filter ? `No records found for the "${filter}" filter status.` : "You don't have any upcoming diagnostic appointments."}
                </p>
              </div>
              <Button
                onClick={() => setShowForm(true)}
                className="mt-4 bg-primary hover:bg-blue-900 text-white rounded-[1.25rem] px-8 h-12 font-black text-[10px] shadow-xl shadow-primary/20 transition-all hover:scale-105"
              >
                Request Consultation
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info Alert */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-4">
           <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
           <p className="text-xs font-bold text-amber-700 leading-relaxed tracking-tight">
             Clinical Reminders: Please arrive 10 minutes prior to your scheduled slot for pre-diagnostic registration. Cancellation requires a minimum 24-hour notice to prioritize patient flow.
           </p>
        </div>
      </div>

      {showForm && (
        <AppointmentForm 
          isOpen={showForm} 
          onClose={() => setShowForm(false)} 
          onSuccess={() => {
            setShowForm(false);
            loadAppointments();
          }} 
        />
      )}
    </div>
  );
};
