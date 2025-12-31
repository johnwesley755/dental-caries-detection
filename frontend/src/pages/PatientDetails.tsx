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
  Clock,
  FileText
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { HistoryCard } from '../components/dashboard/HistoryCard';
import { patientService } from '../services/patientService';
import { detectionService } from '../services/detectionService';
import type { Patient } from '../types/patient.types';
import { Gender } from "../types/patient.types";
import type { Detection } from '../types/detection.types';

export const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
        detectionService.getPatientDetections(patientId),
      ]);
      setPatient(patientData);
      setDetections(detectionsData);
    } catch (error: any) {
      toast.error('Failed to load patient data');
      navigate('/patients');
    } finally {
      setIsLoading(false);
    }
  };

  const getGenderBadge = (gender?: Gender) => {
    switch (gender) {
      case Gender.MALE: return <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Male</Badge>;
      case Gender.FEMALE: return <Badge variant="secondary" className="bg-pink-50 text-pink-700 hover:bg-pink-50">Female</Badge>;
      default: return <Badge variant="secondary">Other</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!patient) return null;

  const totalCaries = detections.reduce((sum, d) => sum + d.total_caries_detected, 0);

  return (
    <div className="min-h-screen bg-[#F4F7FE] p-8">
      
      {/* Top Navigation */}
      <div className="mb-8 flex items-center justify-between">
        <Button 
            variant="ghost" 
            onClick={() => navigate('/patients')}
            className="text-slate-500 hover:text-slate-800 hover:bg-white/50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
        </Button>
        <div className="flex gap-3">
            <Button variant="outline" className="bg-white border-none shadow-sm text-slate-600 hover:text-blue-600">
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
            <Button onClick={() => navigate('/detection')} className="bg-blue-600 shadow-lg shadow-blue-200 text-white rounded-xl">
                <Activity className="mr-2 h-4 w-4" /> New Analysis
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Patient Profile Card */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card className="border-none shadow-sm bg-white rounded-[20px] overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white text-center">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4 shadow-inner">
                    {patient.full_name.charAt(0)}
                </div>
                <h1 className="text-2xl font-bold">{patient.full_name}</h1>
                <p className="opacity-80 text-sm mt-1">ID: {patient.patient_id}</p>
                <div className="flex justify-center gap-2 mt-4">
                    {getGenderBadge(patient.gender)}
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">
                        {patient.age} Years
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/50">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600"><Phone className="h-4 w-4" /></div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase">Phone</p>
                            <p className="text-sm font-semibold text-slate-700">{patient.contact_number || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/50">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600"><Mail className="h-4 w-4" /></div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase">Email</p>
                            <p className="text-sm font-semibold text-slate-700 break-all">{patient.email || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/50">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600"><MapPin className="h-4 w-4" /></div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase">Address</p>
                            <p className="text-sm font-semibold text-slate-700">{patient.address || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/50">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600"><Clock className="h-4 w-4" /></div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase">Registered</p>
                            <p className="text-sm font-semibold text-slate-700">{new Date(patient.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {patient.medical_history && (
                    <div className="pt-6 border-t border-gray-100">
                        <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-400" /> Medical History
                        </h3>
                        <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100 text-sm text-slate-600">
                            {patient.medical_history}
                        </div>
                    </div>
                )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Stats & History */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* KPI Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-white rounded-[20px] p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-400">Total Scans</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-2">{detections.length}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                            <Activity className="h-6 w-6" />
                        </div>
                    </div>
                </Card>
                <Card className="border-none shadow-sm bg-white rounded-[20px] p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-400">Total Issues</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-2">{totalCaries}</h3>
                        </div>
                        <div className="p-3 bg-red-50 rounded-xl text-red-600">
                            <Activity className="h-6 w-6" />
                        </div>
                    </div>
                </Card>
                <Card className="border-none shadow-sm bg-white rounded-[20px] p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-400">Last Visit</p>
                            <h3 className="text-lg font-bold text-slate-800 mt-3">
                                {detections.length > 0 
                                    ? new Date(detections[0].detection_date).toLocaleDateString() 
                                    : 'Never'}
                            </h3>
                        </div>
                        <div className="p-3 bg-green-50 rounded-xl text-green-600">
                            <Calendar className="h-6 w-6" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* History Section */}
            <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Analysis History</h2>
                {detections.length === 0 ? (
                    <div className="bg-white rounded-[20px] p-12 text-center border-none shadow-sm">
                        <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Activity className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No records found</h3>
                        <p className="text-gray-500 mt-1 mb-6">Upload a dental X-ray to start tracking.</p>
                        <Button onClick={() => navigate('/detection')}>Start Detection</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
};