// patient-portal/src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { User, Mail, Phone, MapPin, Calendar, ShieldCheck, Activity, Info } from 'lucide-react';
import { patientService } from '../services/patientService';
import { useAuth } from '../contexts/AuthContext';
import type { Patient } from '../types/detection.types';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const data = await patientService.getMyInfo();
      setPatient(data);
    } catch (error: any) {
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-sm"></div>
          <p className="text-sm font-medium text-gray-500 animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Helper component for data rows
  const InfoRow = ({ icon: Icon, label, value }: { icon: any, label: string, value?: string | number }) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 group">
        <div className="flex-shrink-0 p-2.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="text-sm font-semibold text-slate-900 truncate mt-0.5">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* Decorative Header Background */}
      <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-600 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 pattern-grid-lg opacity-20" />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Main Profile Header Card */}
          <Card className="border-none shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 p-6 sm:p-8">
                <div className="relative">
                  <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                    <User className="h-12 w-12 sm:h-16 sm:w-16 text-slate-300" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 h-6 w-6 border-4 border-white rounded-full" title="Active Status"></div>
                </div>
                
                <div className="flex-1 space-y-2 pb-2">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{patient?.full_name}</h1>
                    <p className="text-slate-500 flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4" />
                      {patient?.email}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Patient
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      ID: {patient?.patient_id}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Personal Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-md border-slate-100">
                <CardHeader className="border-b border-slate-100/50 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900">Personal Details</CardTitle>
                      <CardDescription>Your verified personal information</CardDescription>
                    </div>
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                  <InfoRow icon={User} label="Full Name" value={patient?.full_name} />
                  <InfoRow icon={Calendar} label="Age" value={patient?.age ? `${patient.age} years old` : undefined} />
                  <InfoRow icon={Phone} label="Phone Number" value={patient?.contact_number} />
                  <InfoRow icon={Mail} label="Email Address" value={patient?.email} />
                  <div className="sm:col-span-2">
                    <InfoRow icon={MapPin} label="Home Address" value={patient?.address} />
                  </div>
                </CardContent>
              </Card>

              {/* Notice Section */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 flex gap-4 items-start">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-900">Need to update your details?</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    For security reasons, sensitive personal information cannot be changed directly through the portal. Please contact the dental office administration to request changes.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Account & System Info */}
            <div className="space-y-6">
              <Card className="shadow-md border-slate-100 h-full">
                <CardHeader className="border-b border-slate-100/50 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900">Account Info</CardTitle>
                      <CardDescription>System identifiers</CardDescription>
                    </div>
                    <ShieldCheck className="h-5 w-5 text-slate-400" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pt-6">
                  <div className="space-y-4">
                    <InfoRow icon={ShieldCheck} label="System ID" value={patient?.patient_id} />
                    <InfoRow icon={Mail} label="Login Email" value={user?.email || patient?.email} />
                    <InfoRow 
                      icon={Activity} 
                      label="Member Since" 
                      value={patient?.created_at ? new Date(patient.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : undefined} 
                    />
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <p className="text-xs text-slate-500 font-medium">Account Status</p>
                      <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Verified & Active
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};