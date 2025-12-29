// frontend/src/pages/Detection.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ImageUpload } from '../components/detection/ImageUpload';
import { DetectionResult } from '../components/detection/DetectionResult';
import { AnnotatedImage } from '../components/detection/AnnotatedImage';
import { SeverityChart } from '../components/detection/SeverityChart';
import { Button } from '../components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
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
      console.error(err);
    } finally {
      setLoadingPatients(false);
    }
  };

  const handleUpload = async (
    file: File,
    patientId: string,
    imageType?: ImageType,
    notes?: string
  ) => {
    try {
      await createDetection(file, {
        patient_id: patientId,
        image_type: imageType,
        notes: notes,
      });
      toast.success('Detection completed successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Detection failed');
    }
  };

  const handleNewDetection = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Dental Caries Detection</h1>
              <p className="text-gray-600 mt-1">
                Upload dental images for AI-powered caries analysis
              </p>
            </div>
          </div>
          {currentDetection && (
            <Button onClick={handleNewDetection} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              New Detection
            </Button>
          )}
        </div>

        {/* Content */}
        {!currentDetection ? (
          /* Upload Form */
          <div className="max-w-3xl mx-auto">
            {loadingPatients ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : patients.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No patients found
                </h3>
                <p className="text-gray-600 mb-4">
                  Please add a patient before performing detection
                </p>
                <Button onClick={() => navigate('/patients')}>Add Patient</Button>
              </div>
            ) : (
              <ImageUpload
                patients={patients}
                onUpload={handleUpload}
                isLoading={isLoading}
              />
            )}
          </div>
        ) : (
          /* Detection Results */
          <div className="space-y-8">
            {/* Results and Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DetectionResult detection={currentDetection} />
              </div>
              <div>
                <SeverityChart detection={currentDetection} />
              </div>
            </div>

            {/* Annotated Image */}
            <AnnotatedImage detection={currentDetection} />

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => navigate('/history')}>
                View All Detections
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/patients/${currentDetection.patient_id}`)}
              >
                View Patient Details
              </Button>
              <Button onClick={handleNewDetection}>
                <RefreshCw className="mr-2 h-4 w-4" />
                New Detection
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
