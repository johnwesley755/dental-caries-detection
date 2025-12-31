// frontend/src/pages/UserManagement.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  UserPlus, 
  Trash2, 
  Mail, 
  Shield, 
  CheckCircle2, 
  Copy, 
  MoreHorizontal, 
  Search 
} from 'lucide-react';
import { adminService, type CreateUserRequest } from '../services/adminService';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

export const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
      case 'ADMIN': return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-none">Admin</Badge>;
      case 'DENTIST': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Dentist</Badge>;
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
      <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center p-4">
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
    <div className="min-h-screen bg-[#F4F7FE] p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            User Management
          </h1>
          <p className="text-slate-500 mt-1">Manage system access and team roles.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl h-11 px-6">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {/* Main Content Card */}
      <Card className="border-none shadow-sm bg-white rounded-[20px] overflow-hidden">
        <CardHeader className="px-6 py-5 border-b border-gray-50 bg-white flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold text-slate-800">Registered Users</CardTitle>
            <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                    placeholder="Search users..." 
                    className="pl-9 h-9 bg-slate-50 border-none rounded-lg focus:ring-1 focus:ring-blue-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="pl-6 font-semibold text-xs uppercase text-slate-400">Name</TableHead>
                    <TableHead className="font-semibold text-xs uppercase text-slate-400">Email</TableHead>
                    <TableHead className="font-semibold text-xs uppercase text-slate-400">Role</TableHead>
                    <TableHead className="font-semibold text-xs uppercase text-slate-400">Status</TableHead>
                    <TableHead className="pr-6 text-right font-semibold text-xs uppercase text-slate-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id} className="border-gray-50 hover:bg-blue-50/30 transition-colors group">
                      <TableCell className="pl-6 font-medium text-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                                {u.full_name.charAt(0)}
                            </div>
                            {u.full_name}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-500">{u.email}</TableCell>
                      <TableCell>{getRoleBadge(u.role)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`border-none ${u.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-2 ${u.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        {u.id !== user?.id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
                            <code className="text-blue-600 font-bold font-mono text-lg">{generatedPassword}</code>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-600" onClick={() => {
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
                            className="mt-1.5 bg-slate-50 border-none h-11 rounded-xl focus:ring-2 focus:ring-blue-100"
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
                            className="mt-1.5 bg-slate-50 border-none h-11 rounded-xl focus:ring-2 focus:ring-blue-100"
                            placeholder="sarah@clinic.com"
                        />
                    </div>

                    <div>
                        <Label className="text-slate-500 font-medium ml-1">Role</Label>
                        <Select
                            value={formData.role}
                            onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                        >
                            <SelectTrigger className="mt-1.5 bg-slate-50 border-none h-11 rounded-xl focus:ring-2 focus:ring-blue-100">
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

                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="send_email"
                            checked={formData.send_email}
                            onChange={(e) => setFormData({ ...formData, send_email: e.target.checked })}
                            className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
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
                  <Button type="submit" className="flex-[2] h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 font-medium">
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