import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { patientService } from '../services/patientService';
import { detectionService } from '../services/detectionService';
import type { Patient } from '../types/patient.types';
import type { Detection } from '../types/detection.types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { HistoryCard } from '../components/dashboard/HistoryCard';
import { TopNavBar } from '../components/layout/TopNavBar';
import { useAuth } from '../contexts/AuthContext';

export const PatientDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // Stand-in for topnav search
    const [searchQuery, setSearchQuery] = useState('');

    const [patient, setPatient] = useState<Patient | null>(null);
    const [detections, setDetections] = useState<Detection[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) loadPatientData(id);
    }, [id]);

    const loadPatientData = async (patientId: string) => {
        setIsLoading(true);
        try {
            const [patientData, detectionsData] = await Promise.all([
                patientService.getPatient(patientId),
                detectionService.getPatientDetections(patientId).catch(() => []),
            ]);
            setPatient(patientData);
            
            // Sort detections newest first
            const sortedDetections = detectionsData.sort((a, b) => 
                new Date(b.detection_date).getTime() - new Date(a.detection_date).getTime()
            );
            setDetections(sortedDetections);
        } catch (error: any) {
            toast.error('Failed to load patient data');
            navigate('/patients');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-surface">
                <LoadingSpinner size="lg" text="Loading patient profile..." />
            </div>
        );
    }

    if (!patient) return null;

    const totalCaries = detections.reduce((sum, d) => sum + d.total_caries_detected, 0);
    const lastVisit = detections.length > 0
        ? new Date(detections[0].detection_date).toLocaleDateString()
        : 'Never';

    const getNotes = () => {
        if (!patient.medical_history) return "No clinical notes currently recorded for this patient.";
        if (typeof patient.medical_history === 'string') return patient.medical_history;
        if (patient.medical_history.notes) return patient.medical_history.notes;
        return JSON.stringify(patient.medical_history);
    };

    return (
        <>
            <TopNavBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <main className="p-8 min-h-[calc(100vh-4rem)] bg-surface">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Return Action */}
                    <div>
                        <button 
                            onClick={() => navigate('/patients')}
                            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            Back to Directory
                        </button>
                    </div>

                    {/* Patient Header & Metrics Bento */}
                    <div className="grid grid-cols-12 gap-6 items-stretch">
                        
                        {/* Profile Card */}
                        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-sm">
                            <div className="relative group shrink-0">
                                <img 
                                    alt="Patient Image" 
                                    className="w-32 h-32 rounded-xl object-cover shadow-lg border-4 border-white" 
                                    src={`https://ui-avatars.com/api/?name=${patient.full_name}&background=003d9b&color=fff&size=200`} 
                                />
                                <div className="absolute -bottom-2 -right-2 bg-secondary text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-tighter">
                                    Active
                                </div>
                            </div>
                            
                            <div className="flex-1 space-y-4 w-full">
                                <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-3xl font-headline font-extrabold tracking-tight text-blue-900">{patient.full_name}</h2>
                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-black tracking-widest uppercase">
                                                {patient.patient_id}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-slate-500 text-sm font-medium">
                                            <span className="flex items-center gap-1 capitalize">
                                                <span className="material-symbols-outlined text-lg">
                                                    {patient.gender === 'female' ? 'female' : 'male'}
                                                </span> 
                                                {patient.gender || 'Unknown Identity'}
                                            </span>
                                            {patient.age && (
                                                <>
                                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                    <span>{patient.age} Years Old</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        {patient.user_id && (
                                            <button 
                                                onClick={() => navigate(`/messages?patientId=${patient.user_id}`)}
                                                className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-base">chat</span> Message Patient
                                            </button>
                                        )}
                                        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors opacity-50 cursor-not-allowed">
                                            <span className="material-symbols-outlined text-base">edit</span> Edit Profile
                                        </button>
                                        <button 
                                            onClick={() => navigate('/detection')}
                                            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 shadow-sm transition-opacity"
                                        >
                                            <span className="material-symbols-outlined text-base">add_box</span> New Analysis
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Mini Metrics Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100/50">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Scans</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xl font-black text-blue-900">{detections.length}</span>
                                            <span className="material-symbols-outlined text-sm text-slate-300">biotech</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100/50">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Issues</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xl font-black text-error">{totalCaries}</span>
                                            <span className="material-symbols-outlined text-sm text-slate-300">warning</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100/50">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Last Visit</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-sm font-bold text-slate-600">{lastVisit}</span>
                                            <span className="material-symbols-outlined text-sm text-slate-300">event</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col justify-between">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Patient Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-slate-400 text-lg">call</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Phone</p>
                                        <p className="text-sm font-semibold text-slate-800 truncate">{patient.contact_number || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-slate-400 text-lg">mail</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                                        <p className="text-sm font-semibold text-slate-800 truncate" title={patient.email}>{patient.email || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-slate-400 text-lg">home</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Address</p>
                                        <p className="text-sm font-semibold text-slate-800 leading-tight break-words">{patient.address || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-slate-400 text-lg">calendar_month</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Registered Date</p>
                                        <p className="text-sm font-semibold text-slate-800">{new Date(patient.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Medical History & Analysis Split */}
                    <div className="grid grid-cols-12 gap-6">
                        
                        {/* Medical History Section */}
                        <div className="col-span-12 md:col-span-4 lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between shadow-sm z-10 relative">
                                <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-xl">history_edu</span>
                                    Medical History
                                </h3>
                                <button className="text-[10px] font-black uppercase text-primary hover:underline hover:text-blue-900 transition-all">Update Notes</button>
                            </div>
                            <div className="p-6 bg-slate-50/50 flex-1">
                                <div className="bg-white p-5 rounded-lg border border-slate-100 font-mono text-xs text-slate-600 leading-relaxed min-h-[200px] shadow-inner break-words">
                                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-50">
                                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                        <span className="font-sans font-bold text-slate-400 text-[10px] uppercase tracking-wider">Raw Clinical Notes</span>
                                    </div>
                                    {getNotes()}
                                </div>
                            </div>
                        </div>

                        {/* Analysis History Section */}
                        <div className="col-span-12 md:col-span-8 lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-xl">biotech</span>
                                    Analysis History
                                </h3>
                                <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-bold uppercase">
                                    Showing {detections.length} Records
                                </span>
                            </div>
                            <div className="flex-1 bg-white">
                                {detections.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 h-full min-h-[300px]">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-4xl text-slate-200">folder_off</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-lg font-headline font-bold text-slate-800">No records found</h4>
                                            <p className="text-sm text-slate-400 max-w-xs mx-auto">This patient has no previous clinical scans or AI analysis reports available in the system.</p>
                                        </div>
                                        <button 
                                            onClick={() => navigate('/detection')}
                                            className="bg-primary text-white px-8 py-3 rounded-lg font-bold text-sm shadow-md shadow-primary/20 hover:shadow-lg active:scale-95 transition-all flex items-center gap-2 mt-4"
                                        >
                                            <span className="material-symbols-outlined">rocket_launch</span>
                                            Start Detection
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                        {detections.map((detection) => (
                                            <HistoryCard
                                                key={detection.id}
                                                detection={detection}
                                                showPatientInfo={false}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Quick Actions / System Status */}
                    {/* <div className="bg-blue-900 rounded-xl p-8 text-white flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800 rounded-full -mr-20 -mt-20 opacity-20 blur-3xl pointer-events-none"></div>
                        <div className="relative z-10 mb-6 md:mb-0">
                            <h4 className="text-xl font-headline font-bold">Clinical Workstation Sync</h4>
                            <p className="text-blue-200 text-sm opacity-80 mt-1">
                                All data for Patient {patient.patient_id} ({patient.full_name}) is currently synchronized with the central medical vault.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 relative z-10 shrink-0">
                            <div className="text-right hidden md:block">
                                <p className="text-[10px] uppercase font-bold text-blue-300">System Integrity</p>
                                <p className="text-xs font-bold mt-0.5">Optimal / AES-256</p>
                            </div>
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                                <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                            </div>
                        </div>
                    </div> */}

                </div>
            </main>
        </>
    );
};