import React, { useEffect, useState } from 'react';
import { api } from '../services/api'; 
import type { User } from '../types/auth.types';
import { toast } from 'sonner';
import { ShieldCheck, Mail, Building2, MapPin, Award } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { TopNavBar } from '../components/layout/TopNavBar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

const VerificationDashboard: React.FC = () => {
    const [pendingDentists, setPendingDentists] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPendingDentists();
    }, []);

    const loadPendingDentists = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/admin/pending-dentists');
            setPendingDentists(response.data);
        } catch (err: unknown) {
            console.error('Failed to load pending dentists', err);
            toast.error('Failed to load verification requests');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (userId: string) => {
        try {
            await api.post(`/admin/verify-dentist/${userId}`);
            toast.success('Dentist verified successfully');
            setPendingDentists(prev => prev.filter(d => d.id !== userId));
        } catch (err: unknown) {
            console.error('Verification failed', err);
            toast.error('Verification failed');
        }
    };

    if (isLoading) return <div className="min-h-screen bg-surface flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

    return (
        <div className="min-h-screen bg-surface">
            <TopNavBar title="Credential Verification" />
            
            <div className="p-4 sm:p-8 max-w-7xl mx-auto">
                <div className="mb-8 space-y-2 text-left">
                    <h1 className="text-2xl sm:text-3xl font-headline font-black text-blue-900 uppercase tracking-tight">Access Control</h1>
                    <p className="text-slate-500 font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] opacity-60">Authorize licensed clinical practitioners for neural diagnostics</p>
                </div>

                {pendingDentists.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-16 shadow-2xl shadow-slate-200/50 border border-slate-50 text-center flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center">
                            <ShieldCheck className="h-10 w-10 text-emerald-500" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-headline font-black text-blue-900 uppercase tracking-widest">Protocol Verified</h3>
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-tight">No pending clinical credentials in the secure queue.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {pendingDentists.map((dentist) => (
                            <div key={dentist.id} className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-50 hover:border-primary/20 transition-all group flex flex-col gap-6">
                                <div className="flex items-center gap-5">
                                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-headline font-black shadow-inner border border-primary/5">
                                        {dentist.full_name[0]}
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <h3 className="font-headline font-black text-blue-900 uppercase text-sm truncate">{dentist.full_name}</h3>
                                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 opacity-60">
                                            <Mail className="h-3 w-3" />
                                            <span className="truncate">{dentist.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 flex items-start gap-4 transition-colors group-hover:bg-white group-hover:shadow-lg group-hover:shadow-slate-100">
                                        <Award className="h-5 w-5 text-primary mt-1" />
                                        <div className="text-left font-bold text-slate-500 flex-1">
                                            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">State License</p>
                                            <p className="text-sm text-blue-900 mb-2">{dentist.profile?.license_number || 'N/A'}</p>
                                            <Badge className="bg-primary text-white border-none text-[9px] uppercase font-black px-2.5 py-1 rounded-lg tracking-widest">
                                                {dentist.profile?.specialization || 'Clinical'}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 flex items-start gap-4 transition-colors group-hover:bg-white group-hover:shadow-lg group-hover:shadow-slate-100">
                                        <Building2 className="h-5 w-5 text-primary mt-1" />
                                        <div className="text-left font-bold text-slate-500 flex-1">
                                            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Clinical Entity</p>
                                            <p className="text-sm text-blue-900 mb-2">{dentist.profile?.clinic_name || 'Personal Practice'}</p>
                                            <div className="flex items-center gap-1.5 text-[10px] opacity-60">
                                                <MapPin className="h-3.5 w-3.5 text-primary" />
                                                <span className="truncate">{dentist.profile?.clinic_address || 'Address Restricted'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => handleVerify(dentist.id)}
                                    className="w-full h-16 bg-primary hover:bg-blue-700 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 mt-auto transition-all active:scale-95 hover:-translate-y-1"
                                >
                                    Authorize Access
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerificationDashboard;
