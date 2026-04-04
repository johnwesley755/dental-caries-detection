// patient-portal/src/components/dashboard/CalendarModal.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Calendar as BigCalendar, dateFnsLocalizer, type View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { appointmentService, type Appointment } from '../../services/appointmentService';
import { AppointmentForm } from './AppointmentForm';
import { toast } from 'sonner';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: enUS }),
  getDay,
  locales: { 'en-US': enUS },
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Appointment;
}

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadAppointments();
    }
  }, [isOpen]);

  const loadAppointments = async () => {
    try {
      const appointments = await appointmentService.getAppointments();
      const calendarEvents: CalendarEvent[] = appointments.map(apt => {
        const start = new Date(apt.appointment_date);
        const duration = apt.duration_minutes ? parseInt(apt.duration_minutes) : 30;
        const end = new Date(start.getTime() + duration * 60000);
        
        return {
          id: apt.id,
          title: `${apt.appointment_type || 'Consultation'}`,
          start,
          end,
          resource: apt,
        };
      });
      setEvents(calendarEvents);
    } catch (error) {
      toast.error('Failed to load appointments');
    }
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedAppointment(event.resource);
    setShowAppointmentForm(true);
  };

  const handleAppointmentCreated = () => {
    setShowAppointmentForm(false);
    setSelectedDate(null);
    setSelectedAppointment(null);
    loadAppointments();
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const status = event.resource.status as string;
    
    const colors: Record<string, { backgroundColor: string; borderColor: string }> = {
      scheduled: { backgroundColor: '#1e3a8a', borderColor: '#1e3a8a' },
      confirmed: { backgroundColor: '#10b981', borderColor: '#10b981' },
      completed: { backgroundColor: '#64748b', borderColor: '#64748b' },
      cancelled: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
      pending_approval: { backgroundColor: '#f59e0b', borderColor: '#f59e0b' },
      no_show: { backgroundColor: '#94a3b8', borderColor: '#94a3b8' },
    };

    const style = colors[status] || colors.scheduled;

    return {
      style: {
        ...style,
        color: 'white',
        borderRadius: '8px',
        border: 'none',
        padding: '4px 8px',
        fontSize: '11px',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      },
    };
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden border-none shadow-2xl rounded-[2.5rem]">
          <DialogHeader className="px-10 py-8 border-b border-slate-100 flex flex-row items-center justify-between bg-white shrink-0">
            <div className="space-y-1">
               <DialogTitle className="flex items-center gap-3 text-2xl font-black text-slate-900 uppercase tracking-tight">
                <Calendar className="h-6 w-6 text-primary" />
                Diagnostic Schedule
              </DialogTitle>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-9">Clinical Appointment Longitudinal Audit</p>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-all border border-slate-100"
            >
               <X className="h-6 w-6 text-slate-400" />
            </button>
          </DialogHeader>

          <div className="p-10 h-full overflow-hidden flex flex-col bg-slate-50/30">
            <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-blue-900/5 border border-white flex-1 overflow-hidden relative">
              <div className="absolute inset-0 bg-slate-50/50 pattern-grid-lg opacity-10 pointer-events-none" />
              <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                view={view}
                onView={setView}
                date={date}
                onNavigate={setDate}
                onSelectEvent={handleSelectEvent}
                selectable
                eventPropGetter={eventStyleGetter}
                views={['month', 'week', 'day']}
              />
            </div>

            {/* Legend */}
            <div className="mt-8 flex flex-wrap gap-8 px-4">
              {[
                { label: 'Scheduled', color: 'bg-primary' },
                { label: 'Confirmed', color: 'bg-emerald-500' },
                { label: 'Completed', color: 'bg-slate-500' },
                { label: 'Pending', color: 'bg-amber-500' },
                { label: 'Cancelled', color: 'bg-red-500' }
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-3 h-3 ${item.color} rounded-full shadow-lg shadow-black/5`}></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Appointment Form Modal */}
      {showAppointmentForm && (
        <AppointmentForm
          isOpen={showAppointmentForm}
          onClose={() => {
            setShowAppointmentForm(false);
            setSelectedDate(null);
            setSelectedAppointment(null);
          }}
          onSuccess={handleAppointmentCreated}
          selectedDate={selectedDate}
          appointment={selectedAppointment}
        />
      )}
    </>
  );
};
