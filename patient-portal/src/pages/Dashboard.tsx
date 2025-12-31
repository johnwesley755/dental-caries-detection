// patient-portal/src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { 
  Activity, 
  Calendar, 
  AlertCircle, 
  TrendingUp, 
  ScanFace, 
  ArrowRight, 
  FileText,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { patientService } from '../services/patientService';
import type { Patient, Detection } from '../types/detection.types';

// --- Utility for merging classes ---
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [patientData, detectionsData] = await Promise.all([
        patientService.getMyInfo(),
        patientService.getMyDetections(),
      ]);
      setPatient(patientData);
      setDetections(detectionsData);
    } catch (error: any) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const totalCaries = detections.reduce((sum, d) => sum + d.total_caries_detected, 0);
  const recentDetections = detections.slice(0, 5);

  // Helper for greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-500 font-medium">Loading your health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
        
      {/* Background Elements */}
      <div 
        className="fixed inset-0 -z-20 h-full w-full opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {getGreeting()}, <span className="text-blue-600">{patient?.full_name?.split(' ')[0]}</span>
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Here is the latest summary of your dental diagnostics.
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Total Scans */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ScanFace className="h-24 w-24 text-blue-600 transform rotate-12 translate-x-4 -translate-y-4" />
               </div>
               <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                   <Activity className="h-6 w-6" />
                 </div>
                 <div>
                   <p className="text-sm font-medium text-slate-500">Total Scans</p>
                   <h3 className="text-2xl font-bold text-slate-900">{detections.length}</h3>
                 </div>
               </div>
            </div>
          </motion.div>

          {/* Card 2: Latest Scan */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Calendar className="h-24 w-24 text-indigo-600 transform rotate-12 translate-x-4 -translate-y-4" />
               </div>
               <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                   <Calendar className="h-6 w-6" />
                 </div>
                 <div>
                   <p className="text-sm font-medium text-slate-500">Latest Checkup</p>
                   <h3 className="text-lg font-bold text-slate-900">
                     {detections.length > 0
                        ? new Date(detections[0].detection_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : 'N/A'}
                   </h3>
                 </div>
               </div>
            </div>
          </motion.div>

          {/* Card 3: Issues Found */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <AlertCircle className="h-24 w-24 text-orange-600 transform rotate-12 translate-x-4 -translate-y-4" />
               </div>
               <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                   <AlertCircle className="h-6 w-6" />
                 </div>
                 <div>
                   <p className="text-sm font-medium text-slate-500">Detections</p>
                   <h3 className="text-2xl font-bold text-slate-900">{totalCaries}</h3>
                 </div>
               </div>
            </div>
          </motion.div>

          {/* Card 4: Health Status */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <TrendingUp className="h-24 w-24 text-emerald-600 transform rotate-12 translate-x-4 -translate-y-4" />
               </div>
               <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                   <TrendingUp className="h-6 w-6" />
                 </div>
                 <div>
                   <p className="text-sm font-medium text-slate-500">Status</p>
                   <h3 className="text-lg font-bold text-emerald-600">Stable</h3>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main List */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Recent Diagnostics</h2>
                    <p className="text-sm text-slate-500">Your latest AI analysis results</p>
                  </div>
                  <Button variant="ghost" onClick={() => navigate('/detections')} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="divide-y divide-slate-50">
                  {recentDetections.length === 0 ? (
                     <div className="p-12 text-center flex flex-col items-center text-slate-400">
                        <FileText className="h-12 w-12 mb-3 opacity-20" />
                        <p>No records found.</p>
                     </div>
                  ) : (
                    recentDetections.map((detection) => (
                      <div
                        key={detection.id}
                        className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
                        onClick={() => navigate(`/detection/${detection.detection_id}`)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                             AI
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">Scan #{detection.detection_id.substring(0, 8)}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                               <Calendar className="h-3 w-3" />
                               {new Date(detection.detection_date).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                               })}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                           <div className="text-right">
                              <span className={cn(
                                 "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                 detection.total_caries_detected > 0 
                                    ? "bg-orange-100 text-orange-800" 
                                    : "bg-emerald-100 text-emerald-800"
                              )}>
                                 {detection.total_caries_detected > 0 
                                    ? `${detection.total_caries_detected} Issues Found`
                                    : "All Clear"
                                 }
                              </span>
                           </div>
                           <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>

            {/* Side Panel (Tips/Info) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="lg:col-span-1"
            >
               <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
                  <div className="relative z-10">
                     <h3 className="text-xl font-bold mb-2">Oral Health Tip</h3>
                     <p className="text-blue-100 text-sm leading-relaxed mb-6">
                        Regular AI screenings help detect cavities early, often before they become visible to the naked eye. Keep up the good work!
                     </p>
                     <Button 
                        onClick={() => window.open('https://www.ada.org', '_blank')}
                        className="w-full bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm"
                     >
                        Learn More
                     </Button>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-[-20%] right-[-10%] h-32 w-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-[-10%] left-[-10%] h-32 w-32 bg-indigo-500/30 rounded-full blur-2xl" />
               </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
};