// frontend/src/pages/UserManagement.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Trash2,
  Mail,
  Shield,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import { adminService, type CreateUserRequest } from '../services/adminService';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<CreateUserRequest>({
    email: '',
    full_name: '',
    role: UserRole.DENTIST,
    send_email: true,
  });
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.listUsers();
      setUsers(data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await adminService.createUser(formData);

      if (result.password) {
        setGeneratedPassword(result.password);
      } else {
        toast.success(`User created and email sent to ${formData.email}`);
        setShowCreateModal(false);
        resetForm();
        loadUsers();
      }
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } };
      const detail = error.response?.data?.detail;
      toast.error(typeof detail === 'string' ? detail : 'Failed to create user');
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user ${email}?`)) return;
    try {
      await adminService.deleteUser(userId);
      toast.success('User deleted successfully');
      loadUsers();
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error.response?.data?.detail || 'Failed to delete user');
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      full_name: '',
      role: UserRole.DENTIST,
      send_email: true,
    });
    setGeneratedPassword(null);
  };

  const getRoleBadge = (role: string) => {
    switch (role.toUpperCase()) {
      case 'ADMIN': return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-none">Admin</Badge>;
      case 'DENTIST': return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none">Dentist</Badge>;
      case 'ASSISTANT': return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">Assistant</Badge>;
      default: return <Badge variant="outline" className="text-gray-500">User</Badge>;
    }
  };

  const filteredUsers = users.filter(u =>
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (user?.role !== UserRole.ADMIN) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-none shadow-lg bg-white rounded-[20px]">
          <CardContent className="py-12 text-center">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800">Access Denied</h2>
            <p className="text-slate-500 mt-2">Administrator privileges are required to view this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 lg:mb-10">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-headline font-black text-blue-900 flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl lg:text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
            User Base
          </h1>
          <p className="text-slate-500 text-sm font-medium">Manage clinical staff access and administrative roles.</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)} 
          className="bg-primary hover:bg-blue-800 text-white shadow-lg shadow-primary/20 rounded-xl h-12 px-6 font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-xl">person_add</span>
          Add Team Member
        </Button>
      </div>

      {/* Stats Quick View (Mobile Optimized) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Staff</p>
            <p className="text-2xl font-black text-blue-900 mt-1">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Now</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{users.filter(u => u.is_active).length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admins</p>
            <p className="text-2xl font-black text-orange-500 mt-1">{users.filter(u => u.role === 'ADMIN').length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</p>
            <p className="text-2xl font-black text-slate-400 mt-1">{users.filter(u => !u.is_active).length}</p>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden border border-slate-100/50">
        <CardHeader className="px-6 py-6 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <CardTitle className="text-sm font-black text-blue-900 uppercase tracking-wider flex items-center gap-2 w-full sm:w-auto">
            <span className="material-symbols-outlined text-primary text-xl">format_list_bulleted</span>
            Clinical Directory
          </CardTitle>
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
            <Input
              placeholder="Filter by name or email..."
              className="pl-11 h-11 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/10 text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-20 flex justify-center">
                <LoadingSpinner size="lg" text="Syncing user directory..." />
            </div>
          ) : (
            <>
              {/* Desktop View Table */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader className="bg-slate-50 border-y border-slate-100">
                    <TableRow className="border-none hover:bg-transparent">
                      <TableHead className="pl-6 font-black text-[10px] uppercase tracking-widest text-slate-400 py-4">Clinical Staff</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 py-4">Auth Channel</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 py-4">Assign Role</TableHead>
                      <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 py-4">Vault Status</TableHead>
                      <TableHead className="pr-6 text-right font-black text-[10px] uppercase tracking-widest text-slate-400 py-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((u) => (
                      <TableRow key={u.id} className="border-b border-slate-50 hover:bg-primary/5 transition-colors group">
                        <TableCell className="pl-6 py-4">
                          <div className="flex items-center gap-3">
                            <img 
                                src={`https://ui-avatars.com/api/?name=${u.full_name}&background=003d9b&color=fff&size=80`} 
                                className="h-9 w-9 rounded-xl shadow-sm border border-slate-100" 
                                alt={u.full_name}
                            />
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-700">{u.full_name}</span>
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">ID: {u.id.slice(0, 8)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-500 font-medium">{u.email}</TableCell>
                        <TableCell>{getRoleBadge(u.role)}</TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.is_active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                            {u.is_active ? 'Active' : 'Halted'}
                          </div>
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          {u.id !== user?.id && (
                            <button
                              onClick={() => handleDeleteUser(u.id, u.email)}
                              className="h-9 w-9 inline-flex items-center justify-center text-slate-400 hover:text-error hover:bg-error/10 rounded-xl transition-all active:scale-90 shadow-sm bg-white border border-slate-100"
                              title="Revoke Access"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile View Cards */}
              <div className="lg:hidden divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <div key={u.id} className="p-5 space-y-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img 
                                src={`https://ui-avatars.com/api/?name=${u.full_name}&background=003d9b&color=fff&size=80`} 
                                className="h-10 w-10 rounded-xl border border-slate-100" 
                                alt={u.full_name}
                            />
                            <div>
                                <h4 className="font-bold text-slate-800">{u.full_name}</h4>
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest">{u.role}</p>
                            </div>
                        </div>
                        {u.id !== user?.id && (
                            <button
                                onClick={() => handleDeleteUser(u.id, u.email)}
                                className="h-9 w-9 inline-flex items-center justify-center text-error bg-error/10 rounded-xl active:scale-95"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <span className="material-symbols-outlined text-sm">mail</span>
                            {u.email}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.is_active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                {u.is_active ? 'Active' : 'Inactive'}
                            </div>
                            {getRoleBadge(u.role)}
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Create User Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md bg-white rounded-[24px] p-0 border-none shadow-2xl overflow-hidden">
          <DialogHeader className="px-8 pt-8 pb-4 bg-white">
            <DialogTitle className="text-2xl font-bold text-slate-800">
              {generatedPassword ? 'User Created' : 'New Team Member'}
            </DialogTitle>
          </DialogHeader>

          <div className="px-8 pb-8">
            {generatedPassword ? (
              <div className="space-y-6">
                <div className="bg-emerald-50 rounded-2xl p-6 text-center border border-emerald-100">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-900">Success!</h3>
                  <p className="text-emerald-700 mt-1 text-sm">Account created successfully.</p>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Login Credentials</h4>
                  <div>
                    <label className="text-xs text-slate-400">Email</label>
                    <div className="font-medium text-slate-700">{formData.email}</div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Temporary Password</label>
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 mt-1">
                      <code className="text-orange-600 font-bold font-mono text-lg">{generatedPassword}</code>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-orange-600" onClick={() => {
                        navigator.clipboard.writeText(generatedPassword);
                        toast.success('Password copied');
                      }}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Button onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                  loadUsers();
                }} className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium">
                  Done & Close
                </Button>
              </div>
            ) : (
              <form onSubmit={handleCreateUser} className="space-y-5">
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-500 font-medium ml-1">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                      className="mt-1.5 bg-slate-50 border-none h-11 rounded-xl focus:ring-2 focus:ring-orange-100"
                      placeholder="e.g. Dr. Sarah Smith"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-500 font-medium ml-1">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="mt-1.5 bg-slate-50 border-none h-11 rounded-xl focus:ring-2 focus:ring-orange-100"
                      placeholder="sarah@clinic.com"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-500 font-medium ml-1">Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger className="mt-1.5 bg-slate-50 border-none h-11 rounded-xl focus:ring-2 focus:ring-orange-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserRole.DENTIST}>Dentist</SelectItem>
                        <SelectItem value={UserRole.ASSISTANT}>Assistant</SelectItem>
                        <SelectItem value={UserRole.ADMIN}>Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="send_email"
                      checked={formData.send_email}
                      onChange={(e) => setFormData({ ...formData, send_email: e.target.checked })}
                      className="w-5 h-5 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    <Label htmlFor="send_email" className="cursor-pointer text-slate-700 font-medium flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-slate-500" />
                      Email credentials to user
                    </Label>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)} className="flex-1 h-12 rounded-xl text-slate-500 hover:bg-slate-50">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-[2] h-12 rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-200 font-medium">
                    Create Account
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