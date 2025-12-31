// frontend/src/pages/Detection.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ImageUpload } from '../components/detection/ImageUpload';
import { DetectionResult } from '../components/detection/DetectionResult';
import { AnnotatedImage } from '../components/detection/AnnotatedImage';
import { SeverityChart } from '../components/detection/SeverityChart';
import { Button } from '../components/ui/button';
import { ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDetection } from '../contexts/DetectionContext';
import { patientService } from '../services/patientService';
import type { Patient } from '../types/patient.types';
import type { ImageType } from '../types/detection.types';

export const Detection: React.FC = () => {
  const navigate = useNavigate();
  const { createDetection, currentDetection, isLoading, error, clearError } = useDetection();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);

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

  const handleUpload = async (file: File, patientId: string, imageType?: ImageType, notes?: string) => {
    try {
      await createDetection(file, { patient_id: patientId, image_type: imageType, notes: notes });
      toast.success('Analysis complete!');
    } catch (err: any) {
      toast.error(err.message || 'Detection failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mt-2 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-blue-600" />
            AI Diagnostics
          </h1>
          <p className="text-slate-500 mt-1">Upload dental scans for automated caries detection.</p>
        </div>
        {currentDetection && (
          <Button onClick={() => window.location.reload()} className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm">
            <RefreshCw className="mr-2 h-4 w-4" /> New Analysis
          </Button>
        )}
      </div>

      {!currentDetection ? (
        <div className="max-w-4xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {loadingPatients ? (
            <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
          ) : (
            <ImageUpload patients={patients} onUpload={handleUpload} isLoading={isLoading} />
          )}
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="col-span-12 lg:col-span-7 space-y-8">
             <AnnotatedImage detection={currentDetection} />
             <div className="flex gap-4">
                <Button variant="outline" className="flex-1 h-12 rounded-xl bg-white border-none shadow-sm text-slate-600 hover:text-blue-600" onClick={() => navigate(`/patients/${currentDetection.patient_id}`)}>
                    View Patient History
                </Button>
                <Button className="flex-1 h-12 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700" onClick={() => navigate(`/detection/${currentDetection.id}`)}>
                    View Full Report
                </Button>
             </div>
          </div>
          <div className="col-span-12 lg:col-span-5 space-y-8">
             <DetectionResult detection={currentDetection} />
             <SeverityChart detection={currentDetection} />
          </div>
        </div>
      )}
    </div>
  );
};