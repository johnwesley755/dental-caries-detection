// frontend/src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Statistics } from '../components/dashboard/Statistics';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Calendar as CalendarIcon } from 'lucide-react';
import { patientService } from '../services/patientService';
import { detectionService } from '../services/detectionService';
import { useAuth } from '../contexts/AuthContext';
import type { Patient } from '../types/patient.types';
import type { Detection } from '../types/detection.types';
import { CalendarModal } from '../components/dashboard/CalendarModal';
import { NotificationDropdown } from '../components/dashboard/NotificationDropdown';
import { DetectionTrendsChart } from '../components/charts/DetectionTrendsChart';
import { CariesDistributionChart } from '../components/charts/CariesDistributionChart';
import { PatientGrowthChart } from '../components/charts/PatientGrowthChart';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get real user data
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  
  // Calendar Modal State
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [patientsData, detectionsData] = await Promise.all([
        patientService.getPatients(0, 100),
        // Get recent detections from all patients
        Promise.all(
          patients.map((p) => detectionService.getPatientDetections(p.id))
        ).then((results) => results.flat()),
      ]);

      setPatients(patientsData);
      
      if (patientsData.length > 0) {
        const allDetections = await Promise.all(
          patientsData.slice(0, 10).map((p) => 
            detectionService.getPatientDetections(p.id).catch(() => [])
          )
        );
        setDetections(allDetections.flat().slice(0, 20));
      }
    } catch (error: any) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Filtering Logic ---
  const getFilteredData = () => {
    if (!searchQuery.trim()) {
      return { filteredPatients: patients, filteredDetections: detections };
    }

    const lowerQuery = searchQuery.toLowerCase();

    // 1. Filter Patients matching name or ID
    const filteredPatients = patients.filter(
      (p) => 
        p.full_name.toLowerCase().includes(lowerQuery) || 
        p.patient_id.toLowerCase().includes(lowerQuery)
    );

    // 2. Filter Detections matching ID OR belonging to matched patients
    const filteredDetections = detections.filter((d) => {
      const matchesId = d.detection_id.toLowerCase().includes(lowerQuery);
      const matchesPatient = filteredPatients.some(p => p.id === d.patient_id);
      return matchesId || matchesPatient;
    });

    return { filteredPatients, filteredDetections };
  };

  const { filteredPatients, filteredDetections } = getFilteredData();

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F4F7FE]">
      
      {/* Top Header */}
      <header className="px-8 py-6 flex items-center justify-between sticky top-0 bg-[#F4F7FE]/90 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              className="pl-12 py-6 bg-white border-none rounded-full shadow-sm text-gray-600 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500 transition-all"
              placeholder="Search patients, IDs, or analysis records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="bg-white rounded-full h-12 w-12 p-0 shadow-sm text-gray-500 hover:text-blue-600 transition-colors"
            onClick={() => setShowCalendar(true)}
          >
            <CalendarIcon className="h-5 w-5" />
          </Button>
          
          <div className="relative">
            <NotificationDropdown />
          </div>
          
          {/* User Profile Avatar - Clickable & Real Data */}
          <div 
            className="flex items-center gap-3 pl-2 cursor-pointer" 
            onClick={() => navigate('/profile')}
          >
             <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-700 leading-tight">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs text-gray-500 uppercase font-medium">
                  {user?.role || 'Guest'}
                </p>
             </div>
             <div className="h-12 w-12 bg-white rounded-full border-2 border-white shadow-sm overflow-hidden hover:ring-2 hover:ring-blue-200 transition-all">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user?.full_name || 'User'}&background=0D8ABC&color=fff&bold=true`} 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-8 pb-8">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-400 mt-4">Loading dashboard analytics...</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             {searchQuery && (
               <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                 <Search className="h-4 w-4" />
                 Showing results for <span className="font-bold text-gray-900">"{searchQuery}"</span>
               </div>
             )}
             
             <Statistics 
                patients={filteredPatients} 
                detections={filteredDetections} 
             />
             
             {/* Analytics Charts */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
               <DetectionTrendsChart />
               <CariesDistributionChart />
             </div>
             
             <div className="mt-6">
               <PatientGrowthChart />
             </div>
          </div>
        )}
      </main>
      
      {/* Calendar Modal */}
      {showCalendar && (
        <CalendarModal 
          isOpen={showCalendar} 
          onClose={() => setShowCalendar(false)} 
        />
      )}
    </div>
  );
};