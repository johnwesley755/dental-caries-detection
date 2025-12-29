// frontend/src/pages/PatientDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Activity,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { HistoryCard } from '../components/dashboard/HistoryCard';
import { patientService } from '../services/patientService';
import { detectionService } from '../services/detectionService';
import type { Patient } from '../types/patient.types';
import {Gender} from "../types/patient.types"
import type { Detection } from '../types/detection.types';

export const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPatientData(id);
    }
  }, [id]);

  const loadPatientData = async (patientId: string) => {
    setIsLoading(true);
    try {
      const [patientData, detectionsData] = await Promise.all([
        patientService.getPatient(patientId),
        detectionService.getPatientDetections(patientId),
      ]);

      setPatient(patientData);
      setDetections(detectionsData);
    } catch (error: any) {
      toast.error('Failed to load patient data');
      console.error(error);
      navigate('/patients');
    } finally {
      setIsLoading(false);
    }
  };

  const getGenderBadgeColor = (gender?: Gender) => {
    switch (gender) {
      case Gender.MALE:
        return 'bg-blue-100 text-blue-800';
      case Gender.FEMALE:
        return 'bg-pink-100 text-pink-800';
      case Gender.OTHER:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  if (!patient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Patient not found</h2>
          <Button onClick={() => navigate('/patients')}>Back to Patients</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/patients')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{patient.full_name}</h1>
              <p className="text-gray-600 mt-1">Patient ID: {patient.patient_id}</p>
            </div>
          </div>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Patient
          </Button>
        </div>

        {/* Patient Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{patient.full_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="font-medium">{patient.age || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    {patient.gender ? (
                      <Badge variant="outline" className={getGenderBadgeColor(patient.gender)}>
                        {patient.gender.toUpperCase()}
                      </Badge>
                    ) : (
                      <p className="font-medium">N/A</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Contact Number</p>
                    <p className="font-medium">{patient.contact_number || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium break-all">{patient.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{patient.address || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              {patient.medical_history && Object.keys(patient.medical_history).length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-3">Medical History</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap">
                      {JSON.stringify(patient.medical_history, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-blue-600">{detections.length}</p>
                <p className="text-sm text-gray-600">Total Detections</p>
              </div>

              <div className="text-center p-4 bg-red-50 rounded-lg">
                <Activity className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-red-600">
                  {detections.reduce((sum, d) => sum + d.total_caries_detected, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Caries Found</p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium">
                  {new Date(patient.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detection History */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Detection History</h2>
            <Button onClick={() => navigate('/detection')}>
              <Activity className="mr-2 h-4 w-4" />
              New Detection
            </Button>
          </div>

          {detections.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No detections yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start by uploading a dental image for this patient
              </p>
              <Button onClick={() => navigate('/detection')}>
                <Activity className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
};
