// frontend/src/pages/Patients.tsx
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PatientList } from '../components/dashboard/PatientList';
import { patientService } from '../services/patientService';
import { adminService, type CreatePatientWithAccountRequest } from '../services/adminService';
import type { Patient } from '../types/patient.types';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Mail, CheckCircle2, Copy, Loader2 } from 'lucide-react'; // Added Loader2

export const Patients: React.FC = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // NEW: State to track form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
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
      const data = await patientService.getPatients();
      setPatients(data);
    } catch (error: any) {
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
    } catch (error: any) {
      toast.error('Failed to delete patient');
    }
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Start Loading
    setIsSubmitting(true);
    
    try {
      const dataToSend = {
        ...formData,
        // Ensure gender is safe (optional chaining)
        gender: formData.gender?.toLowerCase(),
      };

      const result = await adminService.createPatientWithAccount(dataToSend);
      
      if (result.password) {
        setGeneratedPassword(result.password);
        toast.success('Patient created successfully');
      } else {
        toast.success(`Patient created${formData.create_account ? ' and email sent' : ''}`);
        setShowAddModal(false);
        resetForm();
        loadPatients();
      }
    } catch (error: any) {
      console.error("Creation Error:", error);
      toast.error(error.response?.data?.detail || 'Failed to create patient');
    } finally {
      // 2. Stop Loading (regardless of success or failure)
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
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
    setGeneratedPassword(null);
  };

  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <div className="min-h-screen bg-[#F4F7FE] p-8">
      {/* Reusing the styled PatientList component */}
      <PatientList
        patients={patients}
        isLoading={isLoading}
        onDelete={isAdmin ? handleDelete : undefined}
        onAddNew={isAdmin ? () => setShowAddModal(true) : undefined}
      />

      {/* Modernized Add Patient Modal */}
      <Dialog open={showAddModal} onOpenChange={(open) => {
        // Prevent closing modal while submitting
        if (!isSubmitting) setShowAddModal(open);
      }}>
        <DialogContent className="max-w-2xl bg-white rounded-[24px] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="px-8 pt-8 pb-4 bg-white">
            <DialogTitle className="text-2xl font-bold text-slate-800">
              {generatedPassword ? 'Registration Complete' : 'Register New Patient'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="px-8 pb-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {generatedPassword ? (
              <div className="space-y-6">
                <div className="bg-emerald-50 rounded-2xl p-6 text-center border border-emerald-100">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-emerald-900">Success!</h3>
                    <p className="text-emerald-700 mt-1">Patient account has been successfully created.</p>
                </div>

                {formData.create_account && (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Account Credentials</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-400">Login Email</label>
                            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                                <code className="text-slate-700 font-medium">{formData.email}</code>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400">Temporary Password</label>
                            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                                <code className="text-blue-600 font-bold text-lg">{generatedPassword}</code>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-600" onClick={() => {
                                    navigator.clipboard.writeText(generatedPassword);
                                    toast.success('Password copied');
                                }}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-4 text-center">
                        Please share these credentials with the patient securely.
                    </p>
                  </div>
                )}
                
                <Button onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                  loadPatients();
                }} className="w-full bg-slate-900 text-white hover:bg-slate-800 h-12 rounded-xl">
                  Done & Close
                </Button>
              </div>
            ) : (
              <form onSubmit={handleAddPatient} className="space-y-6">
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <Label className="text-slate-500 font-medium ml-1">Full Name</Label>
                    <Input
                      className="mt-1.5 bg-slate-50 border-none h-11 rounded-xl focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="e.g. John Doe"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                      disabled={isSubmitting} // Disable input during submission
                    />
                  </div>

                  <div>
                    <Label className="text-slate-500 font-medium ml-1">Email Address</Label>
                    <Input
                      className="mt-1.5 bg-slate-50 border-none h-11 rounded-xl focus:ring-2 focus:ring-blue-100"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label className="text-slate-500 font-medium ml-1">Phone Number</Label>
                    <Input
                      className="mt-1.5 bg-slate-50 border-none h-11 rounded-xl focus:ring-2 focus:ring-blue-100"
                      placeholder="+1 (555) 000-0000"
                      value={formData.contact_number}
                      onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label className="text-slate-500 font-medium ml-1">Age</Label>
                    <Input
                      className="mt-1.5 bg-slate-50 border-none h-11 rounded-xl focus:ring-2 focus:ring-blue-100"
                      type="number"
                      placeholder="Years"
                      // Safely handle age input
                      value={formData.age !== undefined ? formData.age : ''}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : undefined })}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label className="text-slate-500 font-medium ml-1">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="mt-1.5 bg-slate-50 border-none h-11 rounded-xl focus:ring-2 focus:ring-blue-100">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <Label className="text-slate-500 font-medium ml-1">Address</Label>
                    <Input
                      className="mt-1.5 bg-slate-50 border-none h-11 rounded-xl focus:ring-2 focus:ring-blue-100"
                      placeholder="Full residential address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label className="text-slate-500 font-medium ml-1">Medical History Notes</Label>
                    <textarea
                      value={formData.medical_history}
                      onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
                      className="mt-1.5 w-full min-h-[100px] px-4 py-3 bg-slate-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none text-sm"
                      placeholder="Enter relevant medical conditions, allergies, or past treatments..."
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Account Options Card */}
                <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="create_account"
                      checked={formData.create_account}
                      onChange={(e) => setFormData({ ...formData, create_account: e.target.checked })}
                      className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="create_account" className="font-semibold text-slate-700 cursor-pointer">
                      Enable Patient Portal Access
                    </Label>
                  </div>

                  {formData.create_account && (
                    <div className="flex items-center space-x-3 ml-8 transition-all animate-in fade-in slide-in-from-top-1">
                      <input
                        type="checkbox"
                        id="send_email"
                        checked={formData.send_email}
                        onChange={(e) => setFormData({ ...formData, send_email: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                        disabled={isSubmitting}
                      />
                      <Label htmlFor="send_email" className="text-slate-600 text-sm cursor-pointer flex items-center">
                        <Mail className="h-3.5 w-3.5 mr-2" />
                        Send login credentials via email automatically
                      </Label>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setShowAddModal(false)} 
                    className="flex-1 h-12 rounded-xl text-slate-500 hover:bg-slate-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  
                  {/* UPDATE: Button now handles Loading State */}
                  <Button 
                    type="submit" 
                    className="flex-[2] h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Patient Record'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};