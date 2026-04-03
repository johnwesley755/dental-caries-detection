// frontend/src/pages/History.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Search, Filter, Calendar } from 'lucide-react';
import { HistoryCard } from '../components/dashboard/HistoryCard';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { patientService } from '../services/patientService';
import { detectionService } from '../services/detectionService';
import type { Patient } from '../types/patient.types';
import type { Detection } from '../types/detection.types';
import { DetectionStatus } from '../types/detection.types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const History: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [filteredDetections, setFilteredDetections] = useState<Detection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [patientFilter, setPatientFilter] = useState<string>('all');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const patientsData = await patientService.getPatients();
      setPatients(patientsData);

      // Load detections for all patients
      const allDetections = await Promise.all(
        patientsData.map((patient) =>
          detectionService.getPatientDetections(patient.id).catch(() => [])
        )
      );

      const flatDetections = allDetections.flat();
      setDetections(flatDetections);
      setFilteredDetections(flatDetections);
    } catch (error: unknown) {
      toast.error('Failed to load history');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...detections];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((detection) => {
        const patient = patients.find((p) => p.id === detection.patient_id);
        return (
          detection.detection_id.toLowerCase().includes(searchLower) ||
          patient?.full_name.toLowerCase().includes(searchLower) ||
          patient?.patient_id.toLowerCase().includes(searchLower)
        );
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((d) => d.status === statusFilter);
    }

    // Patient filter
    if (patientFilter !== 'all') {
      filtered = filtered.filter((d) => d.patient_id === patientFilter);
    }

    // Sort by date (newest first)
    filtered.sort(
      (a, b) =>
        new Date(b.detection_date).getTime() - new Date(a.detection_date).getTime()
    );

    setFilteredDetections(filtered);
  }, [detections, searchTerm, statusFilter, patientFilter, patients]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient?.full_name || 'Unknown Patient';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPatientFilter('all');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <LoadingSpinner size="lg" text="Loading history..." />
      </div>
    );
  }

  return (
    <main className="p-4 sm:p-6 lg:p-10 min-h-screen bg-surface">
      <div className="space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-manrope tracking-tight text-on-surface mb-1">Detection History</h2>
            <p className="text-slate-500 text-sm font-medium">Browse and filter all clinical records ({detections.length} total)</p>
          </div>
          {(searchTerm || statusFilter !== 'all' || patientFilter !== 'all') && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary hover:text-primary-container font-bold self-start sm:self-auto">
              Clear All Filters
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white p-5 lg:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Filter className="h-3 w-3" />
            Advanced Filtering
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="sm:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="ID or patient name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-50 border-slate-200 rounded-xl focus:ring-primary/10 transition-all text-sm h-11"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-11 bg-slate-50 border-slate-200 rounded-xl text-sm">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={DetectionStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={DetectionStatus.COMPLETED}>Completed</SelectItem>
                  <SelectItem value={DetectionStatus.REVIEWED}>Reviewed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Patient Filter */}
            <div>
              <Select value={patientFilter} onValueChange={setPatientFilter}>
                <SelectTrigger className="h-11 bg-slate-50 border-slate-200 rounded-xl text-sm">
                  <SelectValue placeholder="All Patients" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Patients</SelectItem>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Detection Cards */}
        {filteredDetections.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-bold font-manrope text-slate-800 mb-2">
              No detections found
            </h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto">
              {searchTerm || statusFilter !== 'all' || patientFilter !== 'all'
                ? 'Try adjusting your filters to find what you are looking for.'
                : 'No detection history available yet in the clinical data set.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredDetections.map((detection) => (
              <HistoryCard
                key={detection.id}
                detection={detection}
                patientName={getPatientName(detection.patient_id)}
                showPatientInfo={true}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
