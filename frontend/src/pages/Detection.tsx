import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { DetectionResult } from '../components/detection/DetectionResult';
import { AnnotatedImage } from '../components/detection/AnnotatedImage';
import { SeverityChart } from '../components/detection/SeverityChart';
import { Button } from '../components/ui/button';
import { ArrowLeft, RefreshCw, History as HistoryIcon, Search, CloudUpload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDetection } from '../contexts/DetectionContext';
import { patientService } from '../services/patientService';
import type { Patient } from '../types/patient.types';
import type { ImageType } from '../types/detection.types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { TopNavBar } from '../components/layout/TopNavBar';

export const Detection: React.FC = () => {
    const navigate = useNavigate();
    const { createDetection, currentDetection, isLoading, error, clearError } = useDetection();

    const [patients, setPatients] = useState<Patient[]>([]);
    const [loadingPatients, setLoadingPatients] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [patientId, setPatientId] = useState('');
    const [imageType, setImageType] = useState<string>('');
    const [captureDate, setCaptureDate] = useState('');
    const [notes, setNotes] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        loadPatients();
    }, []);

    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    const loadPatients = async () => {
        setLoadingPatients(true);
        try {
            const data = await patientService.getPatients();
            setPatients(data);
        } catch (err: any) {
            toast.error('Failed to load patients');
        } finally {
            setLoadingPatients(false);
        }
    };

    const handleRunAnalysis = async () => {
        if (!selectedFile) {
            toast.error('Please select an image file to analyze');
            return;
        }
        if (!patientId) {
            toast.error('Please select a patient');
            return;
        }

        try {
            await createDetection(selectedFile, {
                patient_id: patientId,
                image_type: (imageType as ImageType) || 'intraoral',
                notes: notes
            });
            toast.success('Analysis complete!');
        } catch (err: any) {
            toast.error(err.message || 'Detection failed');
        }
    };

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file (DICOM, JPG, PNG, TIFF)');
            return;
        }
        if (file.size > 256 * 1024 * 1024) {
            toast.error('File size exceeds 256MB limit');
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const resetForm = () => {
        window.location.reload();
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-background overflow-hidden relative">
            <TopNavBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <section className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                {!currentDetection ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Page Header Section */}
                        <div className="px-10 py-6">
                            <div className="flex justify-between items-end flex-wrap gap-4">
                                <div>
                                    <h1 className="text-3xl font-extrabold tracking-tight text-primary mb-1 font-headline">Upload New Scan</h1>
                                    <p className="text-on-surface-variant text-sm max-w-xl font-body">Harness AI-driven precision detection. Our neural networks analyze DICOM imagery for clinical anomalies with 99.2% verified accuracy.</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-surface-container-high text-primary hover:bg-surface-container-highest transition-colors flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg">description</span>
                                        View Guidelines
                                    </button>
                                    <button className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-surface-container-high text-primary hover:bg-surface-container-highest transition-colors flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg">history</span>
                                        Patient History
                                    </button>
                                </div>
                            </div>
                        </div>

                        {loadingPatients ? (
                            <div className="h-64 flex items-center justify-center">
                                <LoadingSpinner size="lg" />
                            </div>
                        ) : (
                            <div className="px-10 grid grid-cols-1 md:grid-cols-12 gap-6 pb-10">
                                {/* Left Panel: Form Sections */}
                                <div className="col-span-1 md:col-span-4 space-y-6">
                                    <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-slate-100/50">
                                        <div className="flex items-center gap-2 mb-6">
                                            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>badge</span>
                                            <h3 className="font-bold text-lg font-headline">Patient Details</h3>
                                        </div>

                                        <div className="space-y-5">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1 font-label">Select Patient</label>
                                                <div className="relative group">
                                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary z-10 pointer-events-none">person_search</span>
                                                    <select
                                                        value={patientId}
                                                        onChange={(e) => setPatientId(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-secondary/20 transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option disabled value="">Select from directory...</option>
                                                        {patients.map(p => (
                                                            <option key={p.id} value={p.id}>{p.full_name} ({p.patient_id})</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1 font-label">Scan Type</label>
                                                <div className="relative group">
                                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary z-10 pointer-events-none">radiology</span>
                                                    <select
                                                        value={imageType}
                                                        onChange={(e) => setImageType(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-secondary/20 transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option disabled value="">e.g. Panoramic, Bitewing</option>
                                                        <option value="intraoral">Intraoral</option>
                                                        <option value="panoramic">Panoramic</option>
                                                        <option value="bitewing">Bitewing</option>
                                                        <option value="periapical">Periapical</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1 font-label">Capture Date</label>
                                                <div className="relative group">
                                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary z-10 pointer-events-none">calendar_today</span>
                                                    <input
                                                        type="date"
                                                        value={captureDate}
                                                        onChange={(e) => setCaptureDate(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-secondary/20 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-slate-100/50">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>notes</span>
                                            <h3 className="font-bold text-lg font-headline">Clinical Notes</h3>
                                        </div>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            className="w-full p-4 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-secondary/20 transition-all resize-none font-body"
                                            placeholder="Add any specific areas of concern or patient symptoms..."
                                            rows={5}
                                        ></textarea>
                                    </section>
                                </div>

                                {/* Right Panel: Upload Area */}
                                <div className="col-span-1 md:col-span-8 space-y-6">
                                    {/* Dropzone Card */}
                                    <section
                                        onDragOver={onDragOver}
                                        onDragLeave={onDragLeave}
                                        onDrop={onDrop}
                                        onClick={!selectedFile ? triggerFileSelect : undefined}
                                        className={`
                                    bg-surface-container-lowest rounded-xl p-8 border-2 border-dashed 
                                    flex flex-col items-center justify-center text-center relative overflow-hidden h-[516px] group transition-all
                                    ${isDragging ? 'border-primary bg-primary/5' : 'border-primary/20 hover:border-primary/50 cursor-pointer'} 
                                `}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                                            className="hidden"
                                            accept="image/*,.dicom,.dcm"
                                        />

                                        {previewUrl ? (
                                            <div className="absolute inset-0 p-4">
                                                <div className="w-full h-full rounded-lg overflow-hidden relative bg-black/5 group-hover:bg-black/10 transition-colors">
                                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                                    <div className="absolute top-4 right-4 flex gap-2">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); triggerFileSelect(); }}
                                                            className="bg-white/90 backdrop-blur text-primary p-2 rounded-lg shadow-sm hover:bg-white transition-colors flex items-center justify-center"
                                                        >
                                                            <span className="material-symbols-outlined text-xl">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setPreviewUrl(null); }}
                                                            className="bg-white/90 backdrop-blur text-error p-2 rounded-lg shadow-sm hover:bg-white transition-colors flex items-center justify-center"
                                                        >
                                                            <span className="material-symbols-outlined text-xl">delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="absolute inset-0 bg-blue-50/10 pointer-events-none group-hover:bg-blue-50/30 transition-colors"></div>
                                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-blue-50/50">
                                                    <span className="material-symbols-outlined text-primary text-4xl transform group-hover:-translate-y-1 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_upload</span>
                                                </div>
                                                <h2 className="text-2xl font-bold text-primary mb-3 font-headline">Import Diagnostic Scans</h2>
                                                <p className="text-on-surface-variant max-w-md text-sm mb-8 font-body">Drag and drop DICOM or high-res JPEG/PNG files directly into this workspace or browse local drives.</p>

                                                <div className="flex gap-4 mb-8">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); triggerFileSelect(); }}
                                                        className="bg-primary bg-gradient-to-tr from-primary to-primary-container text-on-primary px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                                                    >
                                                        <span className="material-symbols-outlined">folder_open</span>
                                                        Browse Files
                                                    </button>
                                                    <button
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="bg-white border border-outline-variant text-primary px-8 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center gap-2"
                                                    >
                                                        <span className="material-symbols-outlined">cloud</span>
                                                        Cloud Import
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-8 text-[10px] font-bold text-slate-400 tracking-widest uppercase font-label">
                                                    <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-xs">settings_overscan</span> MAX FILE SIZE: 256MB</div>
                                                    <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-xs">extension</span> SUPPORTED: DICOM, JPG, PNG, TIFF</div>
                                                    <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-xs">enhanced_encryption</span> ENCRYPTED UPLOAD</div>
                                                </div>
                                            </>
                                        )}
                                    </section>

                                    <div className="flex justify-end pt-2">
                                        <button
                                            onClick={handleRunAnalysis}
                                            disabled={isLoading}
                                            className={`
                                        bg-primary bg-gradient-to-r from-primary to-primary-container text-on-primary px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/30 transition-all flex items-center gap-3
                                        ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}
                                    `}
                                        >
                                            {isLoading ? (
                                                <LoadingSpinner size="sm" />
                                            ) : (
                                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                                            )}
                                            {isLoading ? 'Analyzing Neural Network...' : 'Run AI Analysis'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-extrabold tracking-tight text-primary font-headline">Analysis Diagnostics</h2>
                            <Button onClick={resetForm} className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm rounded-xl py-6 px-6">
                                <RefreshCw className="mr-2 h-4 w-4" /> New AI Screening
                            </Button>
                        </div>
                        <div className="grid grid-cols-12 gap-8">
                            <div className="col-span-12 lg:col-span-7 space-y-8 bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-slate-100/50">
                                <AnnotatedImage detection={currentDetection} />
                                <div className="flex gap-4 pt-4 border-t border-slate-100">
                                    <Button variant="outline" className="flex-1 h-12 rounded-xl bg-surface-container-low border-none shadow-none text-slate-600 hover:text-primary hover:bg-surface-container-high transition-colors font-bold" onClick={() => navigate(`/patients/${currentDetection.patient_id}`)}>
                                        Open Patient Record
                                    </Button>
                                    <Button className="flex-1 h-12 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-container font-bold" onClick={() => navigate(`/detection/${currentDetection.id}`)}>
                                        Download Full Report
                                    </Button>
                                </div>
                            </div>
                            <div className="col-span-12 lg:col-span-5 space-y-8">
                                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-slate-100/50">
                                    <DetectionResult detection={currentDetection} />
                                </div>
                                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-slate-100/50">
                                    <SeverityChart detection={currentDetection} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};