import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { patientService } from '../services/patientService';
import { detectionService } from '../services/detectionService';
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
    } catch (error: any) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
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
      <main className="p-10 min-h-screen">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-extrabold font-manrope tracking-tight text-on-surface mb-1">Intelligence Overview</h2>
            <p className="text-slate-500 font-medium">Real-time clinical insights and patient analytics</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-sm font-bold text-slate-700 shadow-sm hover:bg-surface-container-high transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-lg" data-icon="file_download">file_download</span>
              Export PDF
            </button>
          </div>
        </div>

        {/* Bento Grid Analytics */}
        <div className="grid grid-cols-12 gap-8 mb-10">
          <div className="col-span-12 md:col-span-4 bg-surface-container-lowest p-8 rounded-2xl shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-8xl" data-icon="group">group</span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Total Patients</p>
            <div className="flex items-end gap-3 mb-2">
              <h3 className="text-5xl font-extrabold font-manrope text-primary tracking-tighter">{filteredPatients.length}</h3>
              <div className="flex items-center gap-1 text-tertiary font-bold text-sm mb-1">
                <span className="material-symbols-outlined text-sm" data-icon="analytics">analytics</span>
                Current
              </div>
            </div>
            <p className="text-xs text-slate-400 font-medium italic">Based on active database</p>
          </div>

          <div className="col-span-12 md:col-span-4 bg-surface-container-lowest p-8 rounded-2xl shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-8xl" data-icon="biotech">biotech</span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Total Analyses</p>
            <div className="flex items-end gap-3 mb-2">
              <h3 className="text-5xl font-extrabold font-manrope text-secondary tracking-tighter">{filteredDetections.length}</h3>
              <div className="flex items-center gap-1 text-tertiary font-bold text-sm mb-1">
                <span className="material-symbols-outlined text-sm" data-icon="history">history</span>
                Recent
              </div>
            </div>
            <p className="text-xs text-slate-400 font-medium italic">AI processing historical data</p>
          </div>

          <div 
            onClick={() => navigate('/detection')}
            className="col-span-12 md:col-span-4 bg-gradient-to-br from-primary to-blue-800 p-8 rounded-2xl shadow-xl shadow-primary/20 text-on-primary flex flex-col justify-between group cursor-pointer active:scale-95 transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <span className="material-symbols-outlined text-2xl" data-icon="add_a_photo">add_a_photo</span>
              </div>
              <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
            </div>
            <div>
              <h3 className="text-xl font-bold font-manrope mb-2">New Clinical Analysis</h3>
              <p className="text-sm text-blue-100/80 leading-relaxed">Upload dental imaging for instant AI diagnostics and caries detection reports.</p>
            </div>
          </div>
        </div>

        {/* Charts & Activity Row */}
        <div className="grid grid-cols-12 gap-8 mb-10">
          <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-8 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-bold font-manrope">Analysis Overview</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-secondary"></span>
                  <span className="text-xs font-bold text-slate-500">Healthy Scans</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-error"></span>
                  <span className="text-xs font-bold text-slate-500">Caries Detected</span>
                </div>
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-2 px-2 relative group">
              {chartData.map((col) => (
                <div key={col.day} className="flex-1 flex flex-col items-center gap-2 relative">
                  <div className="w-full flex items-end gap-1 px-1">
                    <div className="flex-1 bg-secondary rounded-t-lg transition-all hover:brightness-110" style={{ height: `${scaleHeight(col.healthy)}px` }} title={`Healthy: ${col.healthy}`}></div>
                    <div className="flex-1 bg-error/30 rounded-t-lg transition-all hover:brightness-90" style={{ height: `${scaleHeight(col.caries)}px` }} title={`Caries: ${col.caries}`}></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{col.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-8 rounded-2xl shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold font-manrope">Recent Activity</h3>
              <button className="text-xs font-bold text-primary hover:underline">View All</button>
            </div>
            <div className="space-y-6 flex-1 overflow-y-auto max-h-64 pr-2">
              {filteredDetections.map((detection) => {
                const patient = patients.find(p => p.id === detection.patient_id);
                const isCaries = detection.total_caries_detected > 0; 
                
                return (
                  <div 
                    key={detection.id} 
                    className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors"
                    onClick={() => navigate(`/detections/${detection.id}`)}
                  >
                    <img 
                      alt="Patient Avatar" 
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-surface-container-high" 
                      src={`https://ui-avatars.com/api/?name=${patient?.full_name || 'U'}&background=random&color=fff`} 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface truncate">{patient?.full_name || 'Unknown Patient'}</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">Scan ID: #{detection.detection_id?.split('-')[0] || detection.id.slice(0,4)}</p>
                    </div>
                    <span 
                      className={`px-2 py-1 rounded-lg text-[9px] font-extrabold uppercase whitespace-nowrap ${
                        isCaries ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'
                      }`}
                    >
                      {isCaries ? 'Caries Detected' : 'Healthy'}
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
        <div className="bg-surface-container-low rounded-3xl p-1 overflow-hidden">
          {latestDetection ? (
            <div className="bg-white rounded-[1.4rem] p-8 flex flex-col md:flex-row gap-10 items-center">
              <div className="w-full md:w-1/2 relative">
                <img 
                  alt="Dental X-ray analysis" 
                  className="w-full h-80 object-cover rounded-2xl shadow-inner border border-slate-200" 
                  src={latestDetection.annotated_image_url || latestDetection.original_image_url || "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80"} 
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-24 h-24 border-2 border-secondary rounded-full animate-pulse border-dashed"></div>
                </div>
                
                {/* Glassmorphic Overlay */}
                <div className="absolute bottom-6 left-6 right-6 glass-panel p-5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary" data-icon="troubleshoot">troubleshoot</span>
                    <div className="w-full">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                        {insightFinding ? 'AI Detection Confidence' : 'Scan Confidence Level'}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-secondary transition-all" 
                            style={{ width: `${Math.max((insightFinding?.confidence_score || latestDetection.confidence_threshold) * 100, 50)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-extrabold text-on-surface">
                          {(Math.max((insightFinding?.confidence_score || latestDetection.confidence_threshold) * 100, 50)).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm" data-icon="auto_awesome">auto_awesome</span>
                    Deep Learning Insight
                  </span>
                  <span className="text-slate-400 text-xs font-medium">Model: CurateAI-v4.2</span>
                </div>
                {insightFinding ? (
                  <>
                    <h2 className="text-2xl font-extrabold font-manrope text-on-surface mb-6 leading-tight">
                      {insightFinding.caries_type || 'General'} Caries Detection on {insightFinding.location || 'Tooth Segment'}
                    </h2>
                    <div className="space-y-4 mb-8">
                      <div className="flex gap-4">
                        <div className="w-1.5 h-12 bg-secondary rounded-full"></div>
                        <div>
                          <p className="text-sm font-bold text-on-surface mb-1">Clinical Summary</p>
                          <p className="text-sm text-slate-500 leading-relaxed">
                            Neural analysis identifies {insightFinding.severity || 'mild'} stage radiolucency. Intervention recommended.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-1.5 h-12 bg-primary rounded-full"></div>
                        <div>
                          <p className="text-sm font-bold text-on-surface mb-1">Recommended Action</p>
                          <p className="text-sm text-slate-500 leading-relaxed">
                            {insightFinding.treatment_recommendation || 'Schedule clinical examination for validation.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-extrabold font-manrope text-on-surface mb-6 leading-tight">
                      No Pathologies Detected
                    </h2>
                    <div className="space-y-4 mb-8">
                      <div className="flex gap-4">
                        <div className="w-1.5 h-12 bg-secondary rounded-full"></div>
                        <div>
                          <p className="text-sm font-bold text-on-surface mb-1">Clinical Summary</p>
                          <p className="text-sm text-slate-500 leading-relaxed">
                            Neural analysis found no signs of enamel breach or caries development in the region.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex gap-4">
                  <button 
                    onClick={() => navigate(`/detections/${latestDetection.id}`)}
                    className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                  >
                    View Full Analysis
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[1.4rem] p-16 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-6xl text-slate-200 mb-4" data-icon="cloud_off">cloud_off</span>
              <h2 className="text-xl font-bold text-slate-500 font-manrope">No Scans Available</h2>
              <p className="text-sm text-slate-400 mt-2">Upload a scan to view deep learning insights.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200/50 flex justify-between items-center text-slate-400">
          <p className="text-xs font-medium">© 2024 Dental AI Systems. HIPAA Compliant.</p>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest hidden md:flex">
            <a href="#" className="hover:text-primary transition-colors">System Status</a>
            <a href="#" className="hover:text-primary transition-colors">Documentation</a>
            <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
          </div>
        </footer>
      </main>
    </>
  );
};