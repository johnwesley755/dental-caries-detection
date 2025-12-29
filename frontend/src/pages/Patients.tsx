// Patients Page - With Add Patient Modal
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
import { Mail } from 'lucide-react';

export const Patients: React.FC = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
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
    try {
      // Ensure gender is lowercase
      const dataToSend = {
        ...formData,
        gender: formData.gender?.toLowerCase(),
      };
      
      console.log('Sending patient data:', dataToSend);
      const result = await adminService.createPatientWithAccount(dataToSend);
      
      if (result.password) {
        setGeneratedPassword(result.password);
      } else {
        toast.success(`Patient created${formData.create_account ? ' and email sent' : ''}`);
        setShowAddModal(false);
        resetForm();
        loadPatients();
      }
    } catch (error: any) {
      console.error('Error creating patient:', error);
      toast.error(error.response?.data?.detail || 'Failed to create patient');
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

  // Only admin can add/delete patients
  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <div className="container mx-auto px-4 py-8">
      <PatientList
        patients={patients}
        isLoading={isLoading}
        onDelete={isAdmin ? handleDelete : undefined}
        onAddNew={isAdmin ? () => setShowAddModal(true) : undefined}
      />

      {/* Add Patient Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
          </DialogHeader>
          
          {generatedPassword ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="font-medium text-green-900 mb-2">✅ Patient Created Successfully!</p>
                <p className="text-sm text-green-700 mb-4">
                  Patient record created. {formData.create_account && 'Portal account credentials:'}
                </p>
                {formData.create_account && (
                  <div className="bg-white p-3 rounded border">
                    <p className="text-sm"><strong>Email:</strong> {formData.email}</p>
                    <p className="text-sm"><strong>Password:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{generatedPassword}</code></p>
                    <p className="text-xs text-gray-600 mt-2">Share these credentials with the patient</p>
                  </div>
                )}
              </div>
              <Button onClick={() => {
                setShowAddModal(false);
                resetForm();
                loadPatients();
              }} className="w-full">
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contact_number">Contact Number</Label>
                  <Input
                    id="contact_number"
                    value={formData.contact_number}
                    onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : undefined })}
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="medical_history">Medical History</Label>
                  <textarea
                    id="medical_history"
                    value={formData.medical_history}
                    onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
                    className="w-full min-h-[80px] px-3 py-2 border rounded-md"
                    placeholder="Any relevant medical history..."
                  />
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="create_account"
                    checked={formData.create_account}
                    onChange={(e) => setFormData({ ...formData, create_account: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="create_account" className="cursor-pointer">
                    Create patient portal account
                  </Label>
                </div>

                {formData.create_account && (
                  <div className="flex items-center space-x-2 ml-6">
                    <input
                      type="checkbox"
                      id="send_email"
                      checked={formData.send_email}
                      onChange={(e) => setFormData({ ...formData, send_email: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="send_email" className="cursor-pointer">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Send credentials via email
                    </Label>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">Create Patient</Button>
                <Button type="button" variant="outline" onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
