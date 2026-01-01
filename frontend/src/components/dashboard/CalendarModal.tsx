// frontend/src/components/dashboard/CalendarModal.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Calendar as BigCalendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { appointmentService, type Appointment } from '../../services/appointmentService';
import { AppointmentForm } from './AppointmentForm';
import { toast } from 'sonner';
import { enUS } from 'date-fns/locale';

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
        const end = new Date(start.getTime() + parseInt(apt.duration_minutes) * 60000);
        
        return {
          id: apt.id,
          title: `${apt.patient_name} - ${apt.appointment_type}`,
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

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    setSelectedAppointment(null);
    setShowAppointmentForm(true);
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
    const status = event.resource.status;
    const colors = {
      scheduled: { backgroundColor: '#3b82f6', borderColor: '#2563eb' },
      confirmed: { backgroundColor: '#10b981', borderColor: '#059669' },
      completed: { backgroundColor: '#6b7280', borderColor: '#4b5563' },
      cancelled: { backgroundColor: '#ef4444', borderColor: '#dc2626' },
      no_show: { backgroundColor: '#f59e0b', borderColor: '#d97706' },
    };

    return {
      style: {
        ...colors[status],
        color: 'white',
        borderRadius: '6px',
        border: 'none',
        padding: '2px 6px',
        fontSize: '13px',
      },
    };
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Calendar className="h-6 w-6 text-blue-600" />
              Appointment Calendar
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 h-full overflow-auto">
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 'calc(100% - 60px)' }}
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable
              eventPropGetter={eventStyleGetter}
              views={['month', 'week', 'day']}
            />

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500 rounded"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Cancelled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span>No Show</span>
              </div>
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
