// patient-portal/src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Activity, Calendar, AlertCircle, TrendingUp, Eye } from 'lucide-react';
import { patientService } from '../services/patientService';
import type { Patient, Detection } from '../types/detection.types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [patientData, detectionsData] = await Promise.all([
        patientService.getMyInfo(),
        patientService.getMyDetections(),
      ]);
      setPatient(patientData);
      setDetections(detectionsData);
    } catch (error: any) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const totalCaries = detections.reduce((sum, d) => sum + d.total_caries_detected, 0);
  const recentDetections = detections.slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {patient?.full_name}!</h1>
          <p className="text-gray-600 mt-1">Here's your dental health overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Scans</p>
                  <p className="text-3xl font-bold mt-2">{detections.length}</p>
                </div>
                <Activity className="h-12 w-12 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Latest Scan</p>
                  <p className="text-lg font-bold mt-2">
                    {detections.length > 0
                      ? new Date(detections[0].detection_date).toLocaleDateString()
                      : 'No scans'}
                  </p>
                </div>
                <Calendar className="h-12 w-12 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Findings</p>
                  <p className="text-3xl font-bold mt-2 text-orange-600">{totalCaries}</p>
                </div>
                <AlertCircle className="h-12 w-12 text-orange-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Health Status</p>
                  <p className="text-lg font-bold mt-2 text-green-600">Good</p>
                </div>
                <TrendingUp className="h-12 w-12 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Scans */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Scans</CardTitle>
              <Button variant="outline" onClick={() => navigate('/detections')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentDetections.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No scans available yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentDetections.map((detection) => (
                  <div
                    key={detection.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/detection/${detection.detection_id}`)}
                  >
                    <div>
                      <p className="font-medium">{detection.detection_id}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(detection.detection_date).toLocaleDateString()} • {detection.total_caries_detected} findings
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
