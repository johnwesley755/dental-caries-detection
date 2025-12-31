// frontend/src/components/dashboard/PatientList.tsx
import React, { useState } from 'react';
import { Search, Edit, Trash2, Eye, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import type { Patient } from '../../types/patient.types';
import { Gender } from '../../types/patient.types';

interface PatientListProps {
  patients: Patient[];
  onEdit?: (patient: Patient) => void;
  onDelete?: (patientId: string) => void;
  onAddNew?: () => void;
  isLoading?: boolean;
}

export const PatientList: React.FC<PatientListProps> = ({
  patients,
  onEdit,
  onDelete,
  onAddNew,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Patient>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.full_name.toLowerCase().includes(searchLower) ||
      patient.patient_id.toLowerCase().includes(searchLower)
    );
  });

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    return 0;
  });

  const handleSort = (field: keyof Patient) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getGenderBadge = (gender?: Gender) => {
    switch (gender) {
      case Gender.MALE: return <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-none">M</Badge>;
      case Gender.FEMALE: return <Badge variant="secondary" className="bg-pink-50 text-pink-700 hover:bg-pink-50 border-none">F</Badge>;
      default: return <span className="text-gray-400 text-xs">-</span>;
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-400">Loading directory...</div>;

  return (
    <Card className="border-none shadow-sm bg-white rounded-[20px] overflow-hidden">
      <CardHeader className="px-6 py-5 border-b border-gray-50 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold text-slate-800">Patient Directory</CardTitle>
          <p className="text-sm text-slate-400 mt-1">Manage registered patients</p>
        </div>
        {onAddNew && (
          <Button onClick={onAddNew} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200">
            <UserPlus className="mr-2 h-4 w-4" /> Add New
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 bg-gray-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-none shadow-sm rounded-xl"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-50 hover:bg-transparent">
                <TableHead onClick={() => handleSort('patient_id')} className="cursor-pointer text-xs uppercase tracking-wider font-semibold text-gray-400 pl-6">ID</TableHead>
                <TableHead onClick={() => handleSort('full_name')} className="cursor-pointer text-xs uppercase tracking-wider font-semibold text-gray-400">Name</TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-semibold text-gray-400">Gender</TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-semibold text-gray-400">Contact</TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wider font-semibold text-gray-400 pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPatients.map((patient) => (
                <TableRow key={patient.id} className="border-gray-50 hover:bg-blue-50/30 transition-colors group">
                  <TableCell className="font-medium text-slate-600 pl-6">{patient.patient_id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">{patient.full_name}</span>
                      <span className="text-xs text-slate-400">{patient.age} years old</span>
                    </div>
                  </TableCell>
                  <TableCell>{getGenderBadge(patient.gender)}</TableCell>
                  <TableCell className="text-sm text-slate-500">{patient.contact_number || '-'}</TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" onClick={() => navigate(`/patients/${patient.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {onEdit && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg" onClick={() => onEdit(patient)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" onClick={() => onDelete(patient.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};