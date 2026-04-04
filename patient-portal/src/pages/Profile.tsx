// patient-portal/src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { User, Mail, Phone, MapPin, Calendar, ShieldCheck, Activity, Info } from 'lucide-react';
import { patientService } from '../services/patientService';
import { useAuth } from '../contexts/AuthContext';
import type { Patient } from '../types/detection.types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

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
        <LoadingSpinner size="md" text="Loading profile..." />
      </div>
    );
  }

  // Helper component for data rows
  const InfoRow = ({ icon: Icon, label, value }: { icon: any, label: string, value?: string | number }) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-300 group ring-1 ring-transparent hover:ring-slate-100">
        <div className="flex-shrink-0 p-2.5 bg-blue-50 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
          <p className="text-sm font-bold text-slate-900 truncate">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/30 pb-12">
      {/* Decorative Header Background */}
      <div className="h-56 bg-gradient-to-r from-blue-950 via-blue-900 to-primary w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 pattern-grid-lg opacity-20" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-300/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4 -mt-24 relative z-10">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Main Profile Header Card */}
          <Card className="border-none shadow-2xl shadow-blue-900/5 overflow-hidden rounded-[2.5rem] bg-white/90 backdrop-blur-xl border border-white/20">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-8 p-10">
                <div className="relative">
                  <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-[2.5rem] bg-white border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden">
                    <User className="h-16 w-16 sm:h-20 sm:w-20 text-slate-200" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 h-8 w-8 border-4 border-white rounded-full shadow-lg" title="Active Status">
                    <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20" />
                  </div>
                </div>

                <div className="flex-1 space-y-4 pb-4 text-center sm:text-left">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">{patient?.full_name}</h1>
                    <p className="text-slate-500 font-bold flex items-center justify-center sm:justify-start gap-2 mt-3 bg-slate-50 px-4 py-2 rounded-2xl w-fit border border-slate-100/50">
                      <Mail className="h-4 w-4 text-primary" />
                      {patient?.email}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-primary text-white shadow-lg shadow-primary/20">
                      Patient
                    </span>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200/50">
                      ID: {patient?.patient_id}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Personal Information */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="shadow-2xl shadow-blue-900/5 rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-xl border border-white/20">
                <CardHeader className="border-b border-slate-100/50 pb-7 pt-9 px-10 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Personal Details</CardTitle>
                      <CardDescription className="text-slate-400 font-bold tracking-tight mt-1">Your verified clinical personal information</CardDescription>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-primary shadow-inner">
                      <User className="h-6 w-6" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-10">
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
              <div className="rounded-[2rem] border border-blue-100 bg-white p-8 flex gap-6 items-start shadow-xl shadow-blue-900/5 ring-1 ring-blue-50">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 shadow-inner">
                  <Info className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-base font-black text-blue-900 tracking-tight">Need to update your details?</h4>
                  <p className="text-sm text-slate-500 font-bold leading-relaxed mt-2 opacity-70">
                    For security reasons, sensitive personal information cannot be changed directly through the portal. Please contact the dental office administration to request changes.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Account & System Info */}
            <div className="space-y-8">
              <Card className="shadow-2xl shadow-blue-900/5 rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-xl border border-white/20 h-full flex flex-col">
                <CardHeader className="border-b border-slate-100/50 pb-7 pt-9 px-10 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Account</CardTitle>
                      <CardDescription className="text-slate-400 font-bold tracking-tight mt-1">Clinical identifiers</CardDescription>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-primary shadow-inner">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8 p-10 flex-1">
                  <div className="space-y-6">
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

                  <div className="pt-10 mt-10 border-t border-slate-100 space-y-6">
                    <div className="bg-slate-50 rounded-3xl p-8 text-center border border-slate-200/50 shadow-inner">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">Account Status</p>
                      <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-[1.25rem] bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
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