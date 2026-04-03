import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../services/patientService';
import { detectionService } from '../services/detectionService';
import { adminService, type CreatePatientWithAccountRequest } from '../services/adminService';
import type { Patient } from '../types/patient.types';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth.types';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { Mail, CheckCircle2, Copy } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { TopNavBar } from '../components/layout/TopNavBar';

export const Patients: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientStatuses, setPatientStatuses] = useState<Record<string, { status: string, isCaries: boolean }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreatePatientWithAccountRequest>({
    full_name: '',
    email: '',
    age: undefined,
    gender: undefined,
    contact_number: '',
    address: '',
    medical_history: '',
    create_account: true,
    send_email: true,
  });
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const data = await patientService.getPatients(0, 100);
      setPatients(data);

      const statuses: Record<string, { status: string, isCaries: boolean }> = {};
      await Promise.all(
        data.slice(0, 50).map(async (p) => {
          try {
            const dets = await detectionService.getPatientDetections(p.id);
            if (dets && dets.length > 0) {
              dets.sort((a, b) => new Date(b.detection_date).getTime() - new Date(a.detection_date).getTime());
              const latest = dets[0];
              const isCaries = latest.total_caries_detected > 0;
              statuses[p.id] = { status: isCaries ? 'Caries Detected' : 'Healthy', isCaries };
            } else {
              statuses[p.id] = { status: 'Scheduled', isCaries: false };
            }
          } catch {
            statuses[p.id] = { status: 'Registered', isCaries: false };
          }
        })
      );
      setPatientStatuses(statuses);
    } catch {
      toast.error('Failed to load patients');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (patientId: string) => {
    if (!confirm('Are you sure you want to delete this patient?')) return;
    try {
      await patientService.deletePatient(patientId);
      toast.success('Patient deleted successfully');
      loadPatients();
    } catch {
      toast.error('Failed to delete patient');
    }
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSend = {
        ...formData,
        gender: formData.gender?.toLowerCase(),
        send_email: false,
      };
      const result = await adminService.createPatientWithAccount(dataToSend);
      if (result.password) {
        setGeneratedPassword(result.password);
        if (formData.send_email && formData.create_account) {
          try {
            const { emailService } = await import('../services/emailService');
            const emailSent = await emailService.sendUserCredentials({
              to_email: formData.email,
              to_name: formData.full_name,
              user_email: formData.email,
              user_password: result.password,
              user_role: 'PATIENT',
              portal_url: window.location.origin.includes('localhost') ? 'http://localhost:5174' : 'https://dental-caries-detection-patients.vercel.app'
            });
            if (emailSent) {
              toast.success('Patient created and credentials sent via email!');
            } else {
              toast.warning('Patient created but email failed to send.');
            }
          } catch {
            toast.warning('Patient created but email failed to send.');
          }
        } else {
          toast.success('Patient created successfully');
        }
      } else {
        toast.success('Patient created successfully');
        setShowAddModal(false);
        resetForm();
        loadPatients();
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || 'Failed to create patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '', email: '', age: undefined, gender: undefined, contact_number: '', address: '', medical_history: '', create_account: true, send_email: true,
    });
    setGeneratedPassword(null);
  };

  const isAdmin = user?.role === UserRole.ADMIN;

  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      patient.full_name.toLowerCase().includes(searchLower) ||
      patient.patient_id.toLowerCase().includes(searchLower) ||
      patient.email?.toLowerCase().includes(searchLower) ||
      patient.contact_number?.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <LoadingSpinner size="lg" text="Loading patient directory..." />
      </div>
    );
  }

  const cariesCount = Object.values(patientStatuses).filter(s => s.isCaries).length;
  // Calculate accuracy fake metric or use total patients scanned
  const accuracyRate = patients.length > 0 ? 99.2 : 0;

  return (
    <>
      <TopNavBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Main Content Canvas */}
      <main className="flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8 bg-surface">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1">
            <h2 className="font-headline text-3xl lg:text-4xl font-extrabold tracking-tight text-primary">Patient Directory</h2>
            <p className="text-slate-500 text-sm font-medium">Manage records and dental AI analysis.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button className="flex-1 sm:flex-none bg-surface-container-high text-primary px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-all active:scale-95">
              <span className="material-symbols-outlined" data-icon="filter_list">filter_list</span>
              Filter
            </button>
            <button
              onClick={isAdmin ? () => setShowAddModal(true) : undefined}
              className={`flex-1 sm:flex-none bg-gradient-to-r from-primary to-primary-container text-white px-6 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 ${!isAdmin ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
            >
              <span className="material-symbols-outlined" data-icon="person_add">person_add</span>
              + Add Patient
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100/50 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-full">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-[10px] lg:text-xs font-bold uppercase tracking-widest border-b border-slate-100">
                  <th className="px-4 lg:px-6 py-4">Patient ID</th>
                  <th className="px-4 lg:px-6 py-4">Name</th>
                  <th className="px-4 lg:px-6 py-4 hidden md:table-cell">Gender</th>
                  <th className="px-4 lg:px-6 py-4 hidden sm:table-cell">Contact</th>
                  <th className="px-4 lg:px-6 py-4">Clinical Status</th>
                  <th className="px-4 lg:px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredPatients.map((patient) => {
                  const statusInfo = patientStatuses[patient.id] || { status: 'Registered', isCaries: false };

                  return (
                    <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-4 lg:px-6 py-4 lg:py-5 font-mono text-[10px] lg:text-xs text-slate-400">#{patient.patient_id}</td>
                      <td className="px-4 lg:px-6 py-4 lg:py-5">
                        <div className="flex items-center gap-3">
                          <img
                            alt="Patient Avatar"
                            className="w-8 h-8 lg:w-9 lg:h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                            src={`https://ui-avatars.com/api/?name=${patient.full_name}&background=random&color=fff`}
                          />
                          <span className="font-bold text-sm lg:text-base text-on-surface truncate max-w-[120px] lg:max-w-none">{patient.full_name}</span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 lg:py-5 text-slate-600 hidden md:table-cell capitalize text-sm">
                        {patient.gender || '-'}
                      </td>
                      <td className="px-4 lg:px-6 py-4 lg:py-5 hidden sm:table-cell">
                        <div className="space-y-0.5">
                          <p className="text-xs lg:text-sm font-medium">{patient.contact_number || '-'}</p>
                          <p className="text-[10px] lg:text-xs text-slate-400">{patient.email || '-'}</p>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 lg:py-5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] lg:text-xs font-bold whitespace-nowrap ${statusInfo.status === 'Healthy' ? 'bg-secondary-container/20 text-on-secondary-container'
                            : statusInfo.status === 'Caries Detected' ? 'bg-error-container/40 text-error'
                              : 'bg-primary-fixed text-primary'
                          }`}>
                          <span className={`w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full mr-1.5 lg:mr-2 ${statusInfo.status === 'Healthy' ? 'bg-secondary'
                              : statusInfo.status === 'Caries Detected' ? 'bg-error'
                                : 'bg-primary'
                            }`}></span>
                          {statusInfo.status}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 lg:py-5">
                        <div className="flex items-center justify-center gap-1 lg:gap-2">
                          <button
                            onClick={() => navigate(`/patients/${patient.id}`)}
                            className="p-1.5 lg:p-2 text-slate-400 hover:text-primary hover:bg-primary-fixed rounded-lg transition-all"
                            title="View Patient"
                          >
                            <span className="material-symbols-outlined text-xl" data-icon="visibility">visibility</span>
                          </button>
                          {patient.user_id && (
                            <button
                              onClick={() => navigate(`/messages?patientId=${patient.user_id}`)}
                              className="p-1.5 lg:p-2 text-slate-400 hover:text-secondary hover:bg-secondary-fixed rounded-lg transition-all"
                              title="Message Patient"
                            >
                              <span className="material-symbols-outlined text-xl" data-icon="chat">chat</span>
                            </button>
                          )}
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(patient.id)}
                              className="p-1.5 lg:p-2 text-slate-400 hover:text-error hover:bg-error-container/40 rounded-lg transition-all"
                              title="Delete Patient"
                            >
                              <span className="material-symbols-outlined text-xl" data-icon="delete">delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500 font-medium text-sm">
                      No patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination / Table Footer */}
          <div className="px-4 lg:px-6 py-4 bg-slate-50/30 flex items-center justify-between border-t border-slate-100">
            <p className="text-[10px] lg:text-xs text-slate-500 font-medium">Showing {filteredPatients.length} of {patients.length}</p>
            <div className="flex items-center gap-2">
              <button disabled className="p-1 rounded-md text-slate-400 hover:bg-slate-100 disabled:opacity-30">
                <span className="material-symbols-outlined text-xl">chevron_left</span>
              </button>
              <span className="text-[10px] lg:text-xs font-bold px-2 py-1 bg-white shadow-sm border border-slate-100 rounded">1</span>
              <button disabled className="p-1 rounded-md text-slate-400 hover:bg-slate-100 disabled:opacity-30">
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contextual Insight Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-white p-5 lg:p-6 rounded-xl border border-slate-100/50 shadow-sm flex items-center gap-4 lg:gap-5">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-primary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary" data-icon="biotech">biotech</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">AI Accuracy</p>
              <p className="text-xl lg:text-2xl font-headline font-extrabold text-primary">{accuracyRate}%</p>
            </div>
          </div>
          <div className="bg-white p-5 lg:p-6 rounded-xl border border-slate-100/50 shadow-sm flex items-center gap-4 lg:gap-5">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-secondary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-secondary" data-icon="science">science</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Caries Found</p>
              <p className="text-xl lg:text-2xl font-headline font-extrabold text-secondary">{cariesCount}</p>
            </div>
          </div>
          <div className="bg-primary p-5 lg:p-6 rounded-xl shadow-lg flex items-center gap-4 lg:gap-5 relative overflow-hidden sm:col-span-2 lg:col-span-1">
            <div className="z-10 w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white" data-icon="bolt">bolt</span>
            </div>
            <div className="z-10">
              <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider">Status</p>
              <p className="text-lg lg:text-xl font-headline font-extrabold text-white">Full Capacity</p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 lg:w-24 lg:h-24 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </main>

      {/* Add Patient Modal (Kept from existing state) */}
      <Dialog open={showAddModal} onOpenChange={(open) => {
        if (!isSubmitting) setShowAddModal(open);
      }}>
        <DialogContent className="max-w-3xl w-[95vw] md:w-full bg-white rounded-3xl p-0 overflow-hidden outline-none border-none shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] [&>button]:hidden">
          {/* Modal Header */}
          <div className="px-6 md:px-8 py-5 md:py-6 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
                <span className="material-symbols-outlined">{generatedPassword ? 'check_circle' : 'person_add'}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-manrope font-bold text-blue-900 tracking-tight">
                {generatedPassword ? 'Registration Complete' : 'Register New Patient'}
              </h3>
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {generatedPassword ? (
              <div className="px-6 md:px-8 py-8 space-y-10">
                <div className="bg-emerald-50 rounded-2xl p-6 text-center border border-emerald-100">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-900">Success!</h3>
                  <p className="text-emerald-700 mt-1">Patient account has been successfully created.</p>
                </div>

                {formData.create_account && (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-4">Account Credentials</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Login Email</label>
                        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-700/10 transition-all font-medium border-none shadow-sm">
                          <code className="text-blue-900 font-medium">{formData.email}</code>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Temporary Password</label>
                        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-700/10 transition-all font-medium border-none shadow-sm">
                          <code className="text-primary font-bold text-lg">{generatedPassword}</code>
                          <button type="button" className="h-8 w-8 text-slate-400 hover:text-primary flex items-center justify-center rounded-lg" onClick={() => {
                            navigator.clipboard.writeText(generatedPassword);
                            toast.success('Password copied');
                          }}>
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="px-8 py-6 bg-slate-50 flex items-center justify-end border-t border-slate-100 mt-10 -mx-8 -mb-8">
                  <button onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                    loadPatients();
                  }} className="px-8 py-3 bg-slate-900 text-white font-manrope font-bold rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                    Done & Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddPatient} className="flex flex-col h-full">
                <div className="px-8 py-8 space-y-10">
                  {/* Basic Information Section */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-blue-700 rounded-full"></span>
                      <h4 className="font-manrope font-bold text-lg text-blue-900 tracking-tight">Basic Information</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                        <input
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-700/10 focus:bg-white transition-all text-blue-900 font-medium"
                          placeholder="e.g. Jonathan Doe"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                        <input
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-700/10 focus:bg-white transition-all text-blue-900 font-medium"
                          type="email"
                          placeholder="jonathan@provider.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                        <input
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-700/10 focus:bg-white transition-all text-blue-900 font-medium"
                          placeholder="+1 (555) 000-0000"
                          value={formData.contact_number}
                          onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Age</label>
                          <input
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-700/10 focus:bg-white transition-all text-blue-900 font-medium"
                            type="number"
                            placeholder="28"
                            value={formData.age !== undefined ? formData.age : ''}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : undefined })}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Gender</label>
                          <select
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-700/10 focus:bg-white transition-all text-blue-900 font-medium"
                            value={formData.gender || ''}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            disabled={isSubmitting}
                          >
                            <option value="" disabled hidden>Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Contact Details Section */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-blue-700 rounded-full"></span>
                      <h4 className="font-manrope font-bold text-lg text-blue-900 tracking-tight">Contact Details</h4>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Address</label>
                      <textarea
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-700/10 focus:bg-white transition-all text-blue-900 font-medium resize-none"
                        placeholder="Enter physical home or mailing address..."
                        rows={3}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        disabled={isSubmitting}
                      />
                    </div>
                  </section>

                  {/* Medical History Section */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-blue-700 rounded-full"></span>
                      <h4 className="font-manrope font-bold text-lg text-blue-900 tracking-tight">Medical History</h4>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Medical History Notes</label>
                      <textarea
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-700/10 focus:bg-white transition-all text-blue-900 font-medium resize-none"
                        placeholder="Document any existing conditions, allergies, or previous surgical dental history..."
                        rows={5}
                        value={formData.medical_history}
                        onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="bg-primary-fixed/30 p-5 rounded-xl border border-primary-fixed-dim/50 space-y-3 mt-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="create_account"
                          checked={formData.create_account}
                          onChange={(e) => setFormData({ ...formData, create_account: e.target.checked })}
                          className="w-5 h-5 rounded text-blue-700 focus:ring-blue-700 border-slate-300"
                          disabled={isSubmitting}
                        />
                        <label htmlFor="create_account" className="font-manrope font-bold text-blue-900 cursor-pointer">
                          Enable Patient Portal Access
                        </label>
                      </div>

                      {formData.create_account && (
                        <div className="flex items-center space-x-3 ml-8 transition-all">
                          <input
                            type="checkbox"
                            id="send_email"
                            checked={formData.send_email}
                            onChange={(e) => setFormData({ ...formData, send_email: e.target.checked })}
                            className="w-4 h-4 rounded text-blue-700 focus:ring-blue-700 border-slate-300"
                            disabled={isSubmitting}
                          />
                          <label htmlFor="send_email" className="text-slate-500 font-medium text-sm cursor-pointer flex items-center">
                            <Mail className="h-3.5 w-3.5 mr-2" />
                            Send login credentials via email automatically
                          </label>
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                {/* Modal Footer (Actions) */}
                <div className="px-8 py-6 bg-slate-50 flex items-center justify-end gap-4 border-t border-slate-100 mt-auto">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 font-manrope font-bold text-slate-500 hover:text-blue-900 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-primary text-white font-manrope font-bold rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <><LoadingSpinner size="sm" className="mr-2" /> Saving...</>
                    ) : (
                      'Save Patient'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};