import React, { useEffect, useState } from 'react';
import { api } from '../services/api'; // Assuming there is a central api service
import type { User } from '../types/auth.types';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
        } catch (error) {
            console.error('Failed to load pending dentists', error);
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
        } catch (error) {
            toast.error('Verification failed');
        }
    };

    if (isLoading) return <div className="p-8 flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dentist Verifications</h1>
                <p className="text-gray-500 mt-2">Manage and approve professional credentials</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Dentist</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">License info</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Clinic</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pendingDentists.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">
                                        No pending verifications found
                                    </td>
                                </tr>
                            ) : (
                                pendingDentists.map((dentist) => (
                                    <tr key={dentist.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                                    {dentist.full_name[0]}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{dentist.full_name}</div>
                                                    <div className="text-xs text-gray-500">{dentist.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 text-xs font-bold">
                                                {dentist.profile?.license_number || 'N/A'}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">{dentist.profile?.specialization || 'General Dentistry'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{dentist.profile?.clinic_name || 'N/A'}</div>
                                            <div className="text-xs text-gray-500">{dentist.profile?.clinic_address || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleVerify(dentist.id)}
                                                className="px-4 py-2 bg-primary-600 text-white text-xs font-bold rounded-lg hover:bg-primary-700 shadow-sm hover:shadow-md transition-all"
                                            >
                                                Verify Professional
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VerificationDashboard;
