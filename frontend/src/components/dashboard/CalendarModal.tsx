// frontend/src/components/dashboard/CalendarModal.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { appointmentService } from '../../services/appointmentService';
import type { Appointment } from '../../services/appointmentService';
import { AppointmentForm } from './AppointmentForm';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  startOfWeek, 
  endOfWeek, 
  addMonths, 
  subMonths 
} from 'date-fns';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Appointment Form state
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadAppointments();
    }
  }, [isOpen, currentDate]);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to load appointments', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const handleNewAppointmentClick = () => {
    setSelectedDate(null);
    setShowForm(true);
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    loadAppointments();
  };

  // Calendar calculations
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const getDayAppointments = (day: Date) => {
    return appointments.filter(apt => {
        if (!apt.appointment_date) return false;
        try {
            const aptDate = new Date(apt.appointment_date);
            return isSameDay(aptDate, day);
        } catch (e) {
            return false;
        }
    }).sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime());
  };

  const getStatusColorConfig = (status: string) => {
    switch (status) {
      case 'scheduled': return { bg: 'bg-primary/10', border: 'border-primary', text: 'text-primary' };
      case 'confirmed': return { bg: 'bg-tertiary/10', border: 'border-tertiary', text: 'text-tertiary' };
      case 'cancelled': return { bg: 'bg-error/10', border: 'border-error', text: 'text-error' };
      case 'completed': return { bg: 'bg-outline/10', border: 'border-outline', text: 'text-outline opacity-60' };
      case 'no_show': return { bg: 'bg-secondary-container/30', border: 'border-secondary-container', text: 'text-on-secondary-container' };
      default: return { bg: 'bg-primary/10', border: 'border-primary', text: 'text-primary' };
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        {/* We use a custom un-styled dialog presentation to match the layout exactly */}
        <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 overflow-hidden bg-background border-none shadow-2xl flex flex-col rounded-2xl [&>button]:top-6 [&>button]:right-6 [&>button]:bg-white/80 [&>button]:backdrop-blur [&>button]:p-2 [&>button]:rounded-full [&>button]:z-50 [&>button]:w-10 [&>button]:h-10 hover:[&>button]:bg-white">
          
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2 relative z-10 pr-12">
                <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight">Appointment Calendar</h2>
                <p className="text-slate-500 text-sm font-medium">Manage clinical availability and patient flow with precision.</p>
            </div>

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center min-h-[400px]">
                    <LoadingSpinner size="lg" />
                </div>
            ) : (
                <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col flex-1 border border-surface-container z-0 relative">
                    {/* Calendar Header Controls */}
                    <div className="p-4 bg-white border-b border-surface-container flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h3 className="font-headline text-xl font-bold text-on-surface min-w-[160px]">
                                {format(currentDate, 'MMMM yyyy')}
                            </h3>
                            <div className="flex bg-surface-container-low p-1 rounded-lg">
                                <button onClick={goToToday} className="px-3 py-1.5 text-sm font-medium text-primary bg-white shadow-sm rounded-md transition-all">Today</button>
                                <div className="flex ml-1">
                                    <button onClick={prevMonth} className="p-1.5 hover:bg-white rounded-md transition-all">
                                        <span className="material-symbols-outlined text-sm" data-icon="chevron_left">chevron_left</span>
                                    </button>
                                    <button onClick={nextMonth} className="p-1.5 hover:bg-white rounded-md transition-all">
                                        <span className="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="hidden lg:flex bg-surface-container-low p-1 rounded-lg">
                                <button className="px-4 py-1.5 text-sm font-semibold text-primary bg-white shadow-sm rounded-md">Month</button>
                            </div>
                            <button 
                                onClick={handleNewAppointmentClick}
                                className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary px-4 py-2 rounded-lg font-semibold text-sm shadow-sm hover:opacity-90 active:scale-95 transition-all"
                            >
                                <span className="material-symbols-outlined text-[20px]" data-icon="add">add</span>
                                New Appointment
                            </button>
                        </div>
                    </div>

                    {/* Days of Week */}
                    <div className="grid grid-cols-7 border-b border-surface-container bg-surface-container-low/30 shrink-0">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">{day}</div>
                        ))}
                    </div>

                    {/* Calendar Grid Flow */}
                    <div className="grid grid-cols-7 auto-rows-fr bg-surface-container-low/20 flex-1 overflow-y-auto">
                        {days.map((day, idx) => {
                            const isCurrentMonth = isSameMonth(day, currentDate);
                            const isToday = isSameDay(day, new Date());
                            const dayAppointments = getDayAppointments(day);
                            
                            return (
                                <div 
                                    key={day.toString()} 
                                    onClick={() => handleDayClick(day)}
                                    className={`
                                        min-h-[120px] p-2 group transition-colors hover:bg-slate-50/50 cursor-pointer flex flex-col gap-1
                                        ${!isCurrentMonth ? 'bg-surface-container-low/40' : 'bg-white'}
                                        ${(idx + 1) % 7 !== 0 ? 'border-r' : ''} border-b border-surface-container/30
                                        ${isToday ? 'ring-2 ring-primary ring-inset z-10' : ''}
                                    `}
                                >
                                    <span className={`
                                        block text-right text-sm font-semibold 
                                        ${isToday ? 'text-primary font-bold' : (!isCurrentMonth ? 'text-slate-300' : 'text-on-surface-variant group-hover:text-primary')}
                                    `}>
                                        {format(day, 'd')}
                                    </span>
                                    
                                    <div className="mt-1 space-y-1 flex-1 overflow-hidden" title={dayAppointments.length > 3 ? `${dayAppointments.length} appointments` : ''}>
                                        {dayAppointments.slice(0, 3).map((apt) => {
                                            const colorCfg = getStatusColorConfig(apt.status);
                                            return (
                                                <div 
                                                    key={apt.id} 
                                                    className={`${colorCfg.bg} border-l-2 ${colorCfg.border} p-1.5 rounded flex flex-col gap-0.5`}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <span className={`text-[10px] font-bold ${colorCfg.text} truncate uppercase`}>
                                                        {format(new Date(apt.appointment_date), 'hh:mm a')}
                                                    </span>
                                                    <span className={`text-[11px] font-bold ${colorCfg.text} truncate leading-tight`}>
                                                        {apt.patient_name} - {apt.appointment_type}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                        {dayAppointments.length > 3 && (
                                            <div className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-wider py-1 border border-dashed border-slate-200 rounded mt-1">
                                                + {dayAppointments.length - 3} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-surface-container shrink-0">
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-primary/80"></span>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Scheduled</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-tertiary/80"></span>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Confirmed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-outline/80"></span>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-error/80"></span>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Cancelled</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-secondary-container"></span>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">No Show</span>
                    </div>
                </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Appointment Creation Modal Overlay - Opens over the existing dialog stack */}
      {showForm && (
        <AppointmentForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
          selectedDate={selectedDate}
        />
      )}
    </>
  );
};
