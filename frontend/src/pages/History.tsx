// frontend/src/pages/History.tsx
import React, { useState, useEffect } from 'react';
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

export const History: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [filteredDetections, setFilteredDetections] = useState<Detection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [patientFilter, setPatientFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, patientFilter, detections]);

  const loadData = async () => {
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
    } catch (error: any) {
      toast.error('Failed to load history');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
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
  };

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Detection History</h1>
          <p className="text-gray-600 mt-1">
            Browse and filter all detection records ({detections.length} total)
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Filter className="h-4 w-4" />
            Filters
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by detection ID or patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
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
                <SelectTrigger>
                  <SelectValue placeholder="All Patients" />
                </SelectTrigger>
                <SelectContent>
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

          {/* Active Filters */}
          {(searchTerm || statusFilter !== 'all' || patientFilter !== 'all') && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Showing {filteredDetections.length} of {detections.length} results
              </span>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Detection Cards */}
        {filteredDetections.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No detections found
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || patientFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No detection history available yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
};
