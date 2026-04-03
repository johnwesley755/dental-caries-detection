import React, { useState, useEffect } from 'react';
import { TopNavBar } from '../components/layout/TopNavBar';
import { appointmentService } from '../services/appointmentService';
import type { Appointment } from '../services/appointmentService';
import { AppointmentForm } from '../components/dashboard/AppointmentForm';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  startOfWeek, 
  endOfWeek, 
  subMonths,
  addMonths,
  addWeeks,
  subWeeks
} from 'date-fns';

export const Schedules: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  
  // Appointment Form state
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    loadAppointments();
  }, [currentDate]);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      // In a real app we might pass date filters, here we just fetch all
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to load appointments', error);
    } finally {
      setIsLoading(false);
    }
  };

  const next = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const prev = () => {
    if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

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
  
  const startDate = viewMode === 'month' ? startOfWeek(monthStart) : startOfWeek(currentDate);
  const endDate = viewMode === 'month' ? endOfWeek(monthEnd) : endOfWeek(currentDate);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const getDayAppointments = (day: Date) => {
    return appointments.filter(apt => {
        // Safe check for missing or invalid dates
        if (!apt.appointment_date) return false;
        try {
            const aptDate = new Date(apt.appointment_date);
            return isSameDay(aptDate, day);
        } catch {
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
    <div className="flex flex-col min-h-screen bg-surface relative">
      <TopNavBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-10 flex flex-col gap-6 lg:gap-8 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-1">
                <h2 className="font-headline text-2xl lg:text-3xl font-extrabold text-primary tracking-tight">Appointment Calendar</h2>
                <p className="text-slate-500 text-sm font-medium">Manage clinical availability and patient flow.</p>
            </div>
            <button 
                onClick={handleNewAppointmentClick}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
            >
                <span className="material-symbols-outlined text-[20px]" data-icon="add">add</span>
                New Appointment
            </button>
        </div>

        {isLoading ? (
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size="lg" text="Loading schedule..." />
            </div>
        ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col border border-slate-100">
                {/* Calendar Header Controls */}
                <div className="p-4 lg:p-6 bg-white border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                        <h3 className="font-headline text-lg lg:text-xl font-bold text-on-surface min-w-[140px]">
                            {format(currentDate, viewMode === 'month' ? 'MMMM yyyy' : 'MMM d, yyyy')}
                        </h3>
                        <div className="flex bg-slate-50 p-1 rounded-xl">
                            <button onClick={goToToday} className="px-3 py-1.5 text-xs font-bold text-primary bg-white shadow-sm rounded-lg transition-all hover:bg-slate-50">Today</button>
                            <div className="flex ml-1">
                                <button onClick={prev} className="p-1.5 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-primary">
                                    <span className="material-symbols-outlined text-lg" data-icon="chevron_left">chevron_left</span>
                                </button>
                                <button onClick={next} className="p-1.5 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-primary">
                                    <span className="material-symbols-outlined text-lg" data-icon="chevron_right">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-slate-50 p-1 rounded-xl flex gap-1">
                            <button 
                                onClick={() => setViewMode('month')}
                                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'month' ? 'text-primary bg-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Month
                            </button>
                            <button 
                                onClick={() => setViewMode('week')}
                                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'week' ? 'text-primary bg-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Week
                            </button>
                        </div>
                    </div>
                </div>

                {/* Days of Week */}
                <div className="grid grid-cols-7 border-b border-slate-50 bg-slate-50/50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-3 text-center text-xs font-bold text-slate-400">{day}</div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 auto-rows-fr bg-slate-50/20">
                    {days.map((day, idx) => {
                        const isCurrentMonth = isSameMonth(day, currentDate);
                        const isToday = isSameDay(day, new Date());
                        const dayAppointments = getDayAppointments(day);
                        
                        return (
                            <div 
                                key={day.toString()} 
                                onClick={() => handleDayClick(day)}
                                className={`
                                    min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 group transition-colors hover:bg-slate-50/50 cursor-pointer flex flex-col gap-1
                                    ${!isCurrentMonth ? 'bg-slate-50/40 opacity-40' : 'bg-white'}
                                    ${(idx + 1) % 7 !== 0 ? 'border-r' : ''} border-b border-slate-100/50
                                `}
                            >
                                <div className="flex justify-end">
                                    <span className={`
                                        flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs sm:text-sm font-bold transition-all
                                        ${isToday 
                                            ? 'bg-primary text-on-primary shadow-md shadow-primary/20 scale-110' 
                                            : (!isCurrentMonth ? 'text-slate-300' : 'text-slate-500 group-hover:text-primary')
                                        }
                                    `}>
                                        {format(day, 'd')}
                                    </span>
                                </div>
                                
                                <div className="space-y-1 flex-1 overflow-hidden">
                                    {/* Desktop View: Full badges */}
                                    <div className="hidden sm:block space-y-1">
                                        {dayAppointments.slice(0, 3).map((apt) => {
                                            const colorCfg = getStatusColorConfig(apt.status);
                                            return (
                                                <div 
                                                    key={apt.id} 
                                                    className={`${colorCfg.bg} border-l-2 ${colorCfg.border} p-1 rounded flex flex-col overflow-hidden`}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <span className={`text-[9px] font-bold ${colorCfg.text} truncate`}>
                                                        {format(new Date(apt.appointment_date), 'h:mm a')}
                                                    </span>
                                                    <span className={`text-[10px] font-bold ${colorCfg.text} truncate leading-tight`}>
                                                        {apt.patient_name}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                        {dayAppointments.length > 3 && (
                                            <div className="text-[9px] font-bold text-slate-400 text-center py-0.5 bg-slate-50 rounded">
                                                +{dayAppointments.length - 3} more
                                            </div>
                                        )}
                                    </div>

                                    {/* Mobile View: High-level indicators (dots) */}
                                    <div className="sm:hidden flex flex-wrap justify-center gap-0.5 mt-auto pb-1">
                                        {dayAppointments.slice(0, 4).map((apt) => {
                                            const colorCfg = getStatusColorConfig(apt.status);
                                            return (
                                                <div 
                                                    key={apt.id} 
                                                    className={`w-1.5 h-1.5 rounded-full ${colorCfg.border.replace('border', 'bg')}`}
                                                />
                                            );
                                        })}
                                        {dayAppointments.length > 4 && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

        {/* Legend */}
        <div className="flex flex-col gap-4 mt-auto pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400">Status Legend</h4>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <span className="text-xs font-bold text-slate-500">Scheduled</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                    <span className="text-xs font-bold text-slate-500">Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-outline"></span>
                    <span className="text-xs font-bold text-slate-500">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                    <span className="text-xs font-bold text-slate-500">Cancelled</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
                    <span className="text-xs font-bold text-slate-500">No Show</span>
                </div>
            </div>
        </div>
      </main>

      {/* Appointment Creation Modal Overlay */}
      {showForm && (
        <AppointmentForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};
