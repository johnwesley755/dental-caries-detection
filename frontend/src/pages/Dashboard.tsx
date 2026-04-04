import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { patientService } from '../services/patientService';
import { detectionService } from '../services/detectionService';
import { api } from '../services/api';
import type { Patient } from '../types/patient.types';
import type { Detection } from '../types/detection.types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { TopNavBar } from '../components/layout/TopNavBar';
import { format, subDays, isSameDay } from 'date-fns';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const patientsData = await patientService.getPatients(0, 100);
      setPatients(patientsData);

      if (patientsData.length > 0) {
        const allDetections = await Promise.all(
          patientsData.slice(0, 10).map((p) =>
            detectionService.getPatientDetections(p.id).catch(() => [])
          )
        );
        // Sort by date, newest first
        const sortedDetections = allDetections.flat().sort((a, b) => 
          new Date(b.detection_date).getTime() - new Date(a.detection_date).getTime()
        );
        setDetections(sortedDetections.slice(0, 20));
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Failed to load dashboard data:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const response = await api.get('/reports/dashboard/pdf', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Clinic_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Clinical report exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export clinical report');
    } finally {
      setIsExporting(false);
    }
  };

  const { filteredPatients, filteredDetections } = (() => {
    if (!searchQuery.trim()) return { filteredPatients: patients, filteredDetections: detections };
    const lowerQuery = searchQuery.toLowerCase();
    const fp = patients.filter((p) =>
      p.full_name.toLowerCase().includes(lowerQuery) || p.patient_id.toLowerCase().includes(lowerQuery)
    );
    const fd = detections.filter((d) => {
      return d.detection_id.toLowerCase().includes(lowerQuery) || fp.some(p => p.id === d.patient_id);
    });
    return { filteredPatients: fp, filteredDetections: fd };
  })();

  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dayDetections = filteredDetections.filter(det => det.detection_date && isSameDay(new Date(det.detection_date), d));
    const caries = dayDetections.filter(det => det.total_caries_detected > 0).length;
    const healthy = dayDetections.length - caries;
    return {
      day: format(d, 'EEE'),
      healthy,
      caries,
      rawTotal: dayDetections.length
    };
  });
  
  const maxTotal = Math.max(...chartData.map(d => d.healthy + d.caries), 1);
  const scaleHeight = (val: number) => Math.max((val / maxTotal) * 160, val > 0 ? 8 : 0);

  const latestDetection = filteredDetections[0];
  const insightFinding = latestDetection?.caries_findings?.[0];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" text="Loading AI intelligence..." />
      </div>
    );
  }

  return (
    <>
      <TopNavBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="p-4 sm:p-6 lg:p-10 min-h-screen">
        {/* Header Section */}
        <div className="mb-8 lg:mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-manrope tracking-tight text-on-surface mb-1">Intelligence Overview</h2>
            <p className="text-slate-500 text-sm font-medium">Real-time clinical insights and analytics</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-sm font-bold text-slate-700 shadow-sm hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg" data-icon="file_download">
                {isExporting ? 'sync' : 'file_download'}
              </span>
              {isExporting ? 'Generating...' : 'Export PDF'}
            </button>
          </div>
        </div>

        {/* Bento Grid Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-8 mb-8 lg:mb-10">
          <div 
            onClick={() => navigate('/patients')}
            className="md:col-span-1 lg:col-span-4 bg-surface-container-lowest p-6 lg:p-8 rounded-2xl shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md transition-all active:scale-95"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-6xl lg:text-8xl" data-icon="group">group</span>
            </div>
            <p className="text-[11px] lg:text-xs font-bold text-slate-500 mb-4 lg:mb-6">Total Patients</p>
            <div className="flex items-end gap-3 mb-2">
              <h3 className="text-4xl lg:text-5xl font-extrabold font-manrope text-primary tracking-tighter">{filteredPatients.length}</h3>
              <div className="flex items-center gap-1 text-tertiary font-bold text-xs lg:text-sm mb-1">
                <span className="material-symbols-outlined text-sm" data-icon="analytics">analytics</span>
                Current
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium italic">Based on active database</p>
          </div>

          <div 
            onClick={() => navigate('/history')}
            className="md:col-span-1 lg:col-span-4 bg-surface-container-lowest p-6 lg:p-8 rounded-2xl shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md transition-all active:scale-95"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-6xl lg:text-8xl" data-icon="biotech">biotech</span>
            </div>
            <p className="text-[11px] lg:text-xs font-bold text-slate-500 mb-4 lg:mb-6">Total Analyses</p>
            <div className="flex items-end gap-3 mb-2">
              <h3 className="text-4xl lg:text-5xl font-extrabold font-manrope text-secondary tracking-tighter">{filteredDetections.length}</h3>
              <div className="flex items-center gap-1 text-tertiary font-bold text-xs lg:text-sm mb-1">
                <span className="material-symbols-outlined text-sm" data-icon="history">history</span>
                Recent
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium italic">AI processing historical data</p>
          </div>

          <div 
            onClick={() => navigate('/detection')}
            className="md:col-span-2 lg:col-span-4 bg-gradient-to-br from-primary to-blue-800 p-6 lg:p-8 rounded-2xl shadow-xl shadow-primary/20 text-on-primary flex flex-col justify-between group cursor-pointer active:scale-95 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <span className="material-symbols-outlined text-xl lg:text-2xl" data-icon="add_a_photo">add_a_photo</span>
              </div>
              <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
            </div>
            <div>
              <h3 className="text-lg lg:text-xl font-bold font-manrope mb-2">New Clinical Analysis</h3>
              <p className="text-xs lg:text-sm text-blue-100/80 leading-relaxed">Upload dental imaging for instant AI diagnostics and caries detection reports.</p>
            </div>
          </div>
        </div>

        {/* Charts & Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 mb-8 lg:mb-10">
          <div className="lg:col-span-8 bg-surface-container-lowest p-6 lg:p-8 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 lg:mb-10 gap-4">
              <h3 className="text-lg lg:text-xl font-bold font-manrope">Analysis Overview</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                  <span className="text-[11px] lg:text-xs font-bold text-slate-500">Healthy</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                  <span className="text-[11px] lg:text-xs font-bold text-slate-500">Caries</span>
                </div>
              </div>
            </div>
            
            <div className="h-48 sm:h-64 flex items-end justify-between gap-1 sm:gap-2 px-1 relative group">
              {chartData.map((col) => (
                <div key={col.day} className="flex-1 flex flex-col items-center gap-2 relative">
                  <div className="w-full flex items-end gap-0.5 sm:gap-1 px-0.5">
                    <div className="flex-1 bg-secondary rounded-t-sm sm:rounded-t-lg transition-all hover:brightness-110" style={{ height: `${scaleHeight(col.healthy)}px` }} title={`Healthy: ${col.healthy}`}></div>
                    <div className="flex-1 bg-error/30 rounded-t-sm sm:rounded-t-lg transition-all hover:brightness-90" style={{ height: `${scaleHeight(col.caries)}px` }} title={`Caries: ${col.caries}`}></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{col.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 bg-surface-container-lowest p-6 lg:p-8 rounded-2xl shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-center mb-6 lg:mb-8">
              <h3 className="text-lg lg:text-xl font-bold font-manrope">Recent Activity</h3>
              <button onClick={() => navigate('/history')} className="text-xs font-bold text-primary hover:underline">View All</button>
            </div>
            <div className="space-y-5 flex-1 overflow-y-auto max-h-[300px] lg:max-h-64 pr-2 custom-scrollbar">
              {filteredDetections.map((detection) => {
                const patient = patients.find(p => p.id === detection.patient_id);
                const isCaries = detection.total_caries_detected > 0; 
                
                return (
                  <div 
                    key={detection.id} 
                    className="flex items-center gap-3 lg:gap-4 group cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors"
                    onClick={() => navigate(`/detection/${detection.id}`)}
                  >
                    <div 
                        className="relative shrink-0 hover:scale-105 transition-transform"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (patient?.id) navigate(`/patients/${patient.id}`);
                        }}
                    >
                        <img 
                            alt="Patient Avatar" 
                            className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover ring-2 ring-surface-container-high" 
                            src={`https://ui-avatars.com/api/?name=${patient?.full_name || 'U'}&background=random&color=fff`} 
                        />
                    </div>
                    <div 
                        className="flex-1 min-w-0 text-left hover:opacity-80 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (patient?.id) navigate(`/patients/${patient.id}`);
                        }}
                    >
                      <p className="text-sm font-bold text-on-surface truncate">{patient?.full_name || 'Unknown Patient'}</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">#{detection.detection_id?.split('-')[0] || detection.id.slice(0,4)}</p>
                    </div>
                    <span 
                      className={`px-2 py-1 rounded-lg text-[9px] lg:text-[10px] font-extrabold whitespace-nowrap ${
                        isCaries ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'
                      }`}
                    >
                      {isCaries ? 'Caries' : 'Healthy'}
                    </span>
                  </div>
                );
              })}
              {filteredDetections.length === 0 && (
                <div className="text-center text-sm text-slate-400 py-10">No recent activity</div>
              )}
            </div>
          </div>
        </div>

        {/* Deep Learning Insight */}
        <div className="bg-surface-container-low rounded-2xl lg:rounded-3xl p-1 overflow-hidden">
          {latestDetection ? (
            <div className="bg-white rounded-xl lg:rounded-[1.4rem] p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-10 items-center">
              <div className="w-full lg:w-1/2 relative">
                <img 
                  alt="Dental X-ray analysis" 
                  className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-xl lg:rounded-2xl shadow-inner border border-slate-200" 
                  src={latestDetection.annotated_image_url || latestDetection.original_image_url || "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80"} 
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 lg:w-24 lg:h-24 border-2 border-secondary rounded-full animate-pulse border-dashed"></div>
                </div>
                
                {/* Glassmorphic Overlay */}
                <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-6 glass-panel p-3 lg:p-5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary hidden sm:block" data-icon="troubleshoot">troubleshoot</span>
                    <div className="w-full">
                      <p className="text-[10px] lg:text-xs font-bold text-slate-500 mb-1">
                        Confidence Level
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 lg:h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-secondary transition-all" 
                            style={{ width: `${Math.max((insightFinding?.confidence_score || latestDetection.confidence_threshold) * 100, 50)}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] lg:text-xs font-extrabold text-on-surface">
                          {(Math.max((insightFinding?.confidence_score || latestDetection.confidence_threshold) * 100, 50)).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 text-left">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm" data-icon="auto_awesome">auto_awesome</span>
                    AI Insight
                  </span>
                  <span className="text-slate-400 text-[10px] font-medium">Model: CurateAI-v4.2</span>
                </div>
                {insightFinding ? (
                  <>
                    <h2 className="text-xl lg:text-2xl font-extrabold font-manrope text-on-surface mb-4 lg:mb-6 leading-tight">
                      {insightFinding.caries_type || 'General'} Caries on {insightFinding.location || 'Tooth Segment'}
                    </h2>
                    <div className="space-y-4 mb-6 lg:mb-8">
                      <div className="flex gap-3 lg:gap-4">
                        <div className="w-1 h-10 lg:w-1.5 lg:h-12 bg-secondary rounded-full shrink-0"></div>
                        <div>
                          <p className="text-xs lg:text-sm font-bold text-on-surface mb-0.5 lg:mb-1">Clinical Summary</p>
                          <p className="text-xs lg:text-sm text-slate-500 leading-relaxed">
                            Neural analysis identifies {insightFinding.severity || 'mild'} stage radiolucency. Intervention recommended.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 lg:gap-4">
                        <div className="w-1 h-10 lg:w-1.5 lg:h-12 bg-primary rounded-full shrink-0"></div>
                        <div>
                          <p className="text-xs lg:text-sm font-bold text-on-surface mb-0.5 lg:mb-1">Recommended Action</p>
                          <p className="text-xs lg:text-sm text-slate-500 leading-relaxed">
                            {insightFinding.treatment_recommendation || 'Schedule clinical examination for validation.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl lg:text-2xl font-extrabold font-manrope text-on-surface mb-4 lg:mb-6 leading-tight">
                      No Pathologies Detected
                    </h2>
                    <div className="space-y-4 mb-6 lg:mb-8">
                      <div className="flex gap-3 lg:gap-4">
                        <div className="w-1 h-10 lg:w-1.5 lg:h-12 bg-secondary rounded-full shrink-0"></div>
                        <div>
                          <p className="text-xs lg:text-sm font-bold text-on-surface mb-0.5 lg:mb-1">Clinical Summary</p>
                          <p className="text-xs lg:text-sm text-slate-500 leading-relaxed">
                            Neural analysis found no signs of enamel breach or caries development in the region.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex">
                  <button 
                    onClick={() => navigate(`/detection/${latestDetection.id}`)}
                    className="w-full sm:w-auto bg-primary text-on-primary px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    View Full Analysis
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-10 lg:p-16 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-4xl lg:text-6xl text-slate-200 mb-4" data-icon="cloud_off">cloud_off</span>
              <h2 className="text-lg lg:text-xl font-bold text-slate-500 font-manrope">No Scans Available</h2>
              <p className="text-xs lg:text-sm text-slate-400 mt-2">Upload a scan to view deep learning insights.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 lg:mt-16 pt-8 border-t border-slate-200/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400">
          <p className="text-[10px] lg:text-xs font-medium">© 2024 Dental AI Systems. HIPAA Compliant.</p>
          <div className="flex gap-6 text-xs font-bold">
            <a href="#" className="hover:text-primary transition-colors">Status</a>
            <a href="#" className="hover:text-primary transition-colors">Docs</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
        </footer>
      </main>

    </>
  );
};