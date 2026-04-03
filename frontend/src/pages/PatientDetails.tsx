import React, { useState, useEffect, useCallback } from 'react';
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
    useAuth();
    
    // Stand-in for topnav search
    const [searchQuery, setSearchQuery] = useState('');

    const [patient, setPatient] = useState<Patient | null>(null);
    const [detections, setDetections] = useState<Detection[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadPatientData = useCallback(async (patientId: string) => {
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
        } catch {
            toast.error('Failed to load patient data');
            navigate('/patients');
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        if (id) loadPatientData(id);
    }, [id, loadPatientData]);

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
            <main className="p-4 sm:p-6 lg:p-10 min-h-[calc(100vh-4rem)] bg-surface">
                <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
                    {/* Return Action */}
                    <div className="px-1">
                        <button 
                            onClick={() => navigate('/patients')}
                            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            Back to Patients
                        </button>
                    </div>

                    {/* Patient Header & Metrics Bento */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                        
                        {/* Profile Card */}
                        <div className="col-span-1 lg:col-span-8 bg-surface-container-lowest rounded-2xl p-5 lg:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-8 shadow-sm border border-slate-100/50">
                            <div className="relative group shrink-0">
                                <img 
                                    alt="Patient Image" 
                                    className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl object-cover shadow-lg border-4 border-white" 
                                    src={`https://ui-avatars.com/api/?name=${patient.full_name}&background=003d9b&color=fff&size=200`} 
                                />
                                <div className="absolute -bottom-2 -right-2 bg-secondary text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-tighter">
                                    Active
                                </div>
                            </div>
                            
                            <div className="flex-1 space-y-6 w-full text-center md:text-left">
                                <div className="flex flex-col xl:flex-row items-center md:items-start xl:items-center justify-between gap-6">
                                    <div className="space-y-1">
                                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                                            <h2 className="text-2xl lg:text-3xl font-headline font-extrabold tracking-tight text-blue-900">{patient.full_name}</h2>
                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-black tracking-widest uppercase">
                                                {patient.patient_id}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-slate-500 text-sm font-medium">
                                            <span className="flex items-center gap-1 capitalize">
                                                <span className="material-symbols-outlined text-lg">
                                                    {patient.gender === 'female' ? 'female' : 'male'}
                                                </span> 
                                                {patient.gender || 'Unknown Identity'}
                                            </span>
                                            {patient.age && (
                                                <>
                                                    <span className="hidden sm:inline w-1 h-1 bg-slate-300 rounded-full"></span>
                                                    <span>{patient.age} Years Old</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap justify-center md:justify-start gap-2 w-full sm:w-auto">
                                        {patient.user_id && (
                                            <button 
                                                onClick={() => navigate(`/messages?patientId=${patient.user_id}`)}
                                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-base">chat</span> Message
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => navigate('/detection')}
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95"
                                        >
                                            <span className="material-symbols-outlined text-base">add_box</span> New Analysis
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Mini Metrics Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/50 flex sm:flex-col justify-between items-center sm:items-start">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Scans</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-black text-blue-900">{detections.length}</span>
                                            <span className="material-symbols-outlined text-sm text-slate-300">biotech</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/50 flex sm:flex-col justify-between items-center sm:items-start">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Issues</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-black text-error">{totalCaries}</span>
                                            <span className="material-symbols-outlined text-sm text-slate-300">warning</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/50 flex sm:flex-col justify-between items-center sm:items-start">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Last Visit</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-slate-600">{lastVisit}</span>
                                            <span className="material-symbols-outlined text-sm text-slate-300">event</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="col-span-1 lg:col-span-4 bg-surface-container-lowest rounded-2xl p-6 lg:p-8 shadow-sm flex flex-col justify-between border border-slate-100/50">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Contact Information</h3>
                            <div className="space-y-5 flex-1">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-slate-400 text-xl">call</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                                        <p className="text-sm font-bold text-slate-800 truncate">{patient.contact_number || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-slate-400 text-xl">mail</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                                        <p className="text-sm font-bold text-slate-800 truncate" title={patient.email}>{patient.email || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-slate-400 text-xl">home</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Address</p>
                                        <p className="text-sm font-bold text-slate-800 leading-snug">{patient.address || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Medical History & Analysis Split */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* Medical History Section */}
                        <div className="col-span-1 lg:col-span-5 bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden flex flex-col border border-slate-100/50">
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                <h3 className="text-sm font-black text-blue-900 uppercase tracking-wider flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>history_edu</span>
                                    Medical History
                                </h3>
                                <button className="text-[10px] font-black uppercase text-primary hover:text-blue-900 transition-all px-3 py-1 bg-primary/5 rounded-full">Update</button>
                            </div>
                            <div className="p-5 lg:p-6 bg-slate-50/30 flex-1 min-h-[300px]">
                                <div className="bg-white p-5 rounded-xl border border-slate-100 font-body text-sm text-slate-600 leading-relaxed h-full shadow-inner">
                                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-50">
                                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                        <span className="font-sans font-bold text-slate-400 text-[10px] uppercase tracking-widest">Clinical Journal</span>
                                    </div>
                                    <div className="whitespace-pre-wrap">
                                        {getNotes()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Analysis History Section */}
                        <div className="col-span-1 lg:col-span-7 bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden flex flex-col border border-slate-100/50">
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                <h3 className="text-sm font-black text-blue-900 uppercase tracking-wider flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>biotech</span>
                                    Analysis History
                                </h3>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full font-bold text-[10px] uppercase">
                                    {detections.length} Records
                                </div>
                            </div>
                            <div className="flex-1 bg-white min-h-[400px]">
                                {detections.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-12 text-center space-y-6 h-full">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-4xl text-slate-200">folder_off</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-lg font-headline font-bold text-slate-800">No records found</h4>
                                            <p className="text-sm text-slate-400 max-w-xs mx-auto">This patient has no clinical scans or reports available.</p>
                                        </div>
                                        <button 
                                            onClick={() => navigate('/detection')}
                                            className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md shadow-primary/20 hover:shadow-lg active:scale-95 transition-all flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined">rocket_launch</span>
                                            Start Primary Analysis
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-5 lg:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                                        {detections.map((detection) => (
                                            <div key={detection.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                <HistoryCard
                                                    detection={detection}
                                                    showPatientInfo={false}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};