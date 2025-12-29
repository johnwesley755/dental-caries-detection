// frontend/src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Statistics } from '../components/dashboard/Statistics';
import { HistoryCard } from '../components/dashboard/HistoryCard';
import { Button } from '../components/ui/button';
import { Upload, Users, Activity } from 'lucide-react';
import { patientService } from '../services/patientService';
import { detectionService } from '../services/detectionService';
import type { Patient } from '../types/patient.types';
import type { Detection } from '../types/detection.types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      
      // If we have patients, fetch their detections
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

  // Get recent detections (last 5)
  const recentDetections = detections
    .sort((a, b) => new Date(b.detection_date).getTime() - new Date(a.detection_date).getTime())
    .slice(0, 5);

  // Get patient name for detection
  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient?.full_name || 'Unknown Patient';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Overview of your dental caries detection system
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/patients')} variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Patients
            </Button>
            <Button onClick={() => navigate('/detection')}>
              <Upload className="mr-2 h-4 w-4" />
              New Detection
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <Statistics patients={patients} detections={detections} />

        {/* Recent Detections */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Detections</h2>
            <Button variant="ghost" onClick={() => navigate('/history')}>
              <Activity className="mr-2 h-4 w-4" />
              View All
            </Button>
          </div>

          {recentDetections.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No detections yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start by uploading a dental image for analysis
              </p>
              <Button onClick={() => navigate('/detection')}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentDetections.map((detection) => (
                <HistoryCard
                  key={detection.id}
                  detection={detection}
                  patientName={getPatientName(detection.patient_id)}
                  showPatientInfo={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="p-6 border-2 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
            onClick={() => navigate('/detection')}
          >
            <Upload className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">New Detection</h3>
            <p className="text-sm text-gray-600">
              Upload a dental image for AI-powered caries detection
            </p>
          </div>

          <div
            className="p-6 border-2 border-dashed rounded-lg hover:border-green-500 hover:bg-green-50 cursor-pointer transition-colors"
            onClick={() => navigate('/patients')}
          >
            <Users className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Manage Patients</h3>
            <p className="text-sm text-gray-600">
              View, add, or edit patient information and records
            </p>
          </div>

          <div
            className="p-6 border-2 border-dashed rounded-lg hover:border-purple-500 hover:bg-purple-50 cursor-pointer transition-colors"
            onClick={() => navigate('/history')}
          >
            <Activity className="h-8 w-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">View History</h3>
            <p className="text-sm text-gray-600">
              Browse all detection history and patient records
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
