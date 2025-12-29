// patient-portal/src/pages/MyDetections.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Calendar, Eye, AlertCircle } from 'lucide-react';
import { patientService } from '../services/patientService';
import type { Detection } from '../types/detection.types';

export const MyDetections: React.FC = () => {
  const navigate = useNavigate();
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDetections();
  }, []);

  const loadDetections = async () => {
    setIsLoading(true);
    try {
      const data = await patientService.getMyDetections();
      setDetections(data);
    } catch (error: any) {
      toast.error('Failed to load detections');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Dental Scans</h1>
          <p className="text-gray-600 mt-1">View all your dental examination records</p>
        </div>

        {detections.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No scans yet</h3>
              <p className="text-gray-600">Your dental scans will appear here after your next visit</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detections.map((detection) => (
              <Card key={detection.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-lg">{detection.detection_id}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(detection.detection_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(detection.status)}>
                        {detection.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-b">
                      <div>
                        <p className="text-sm text-gray-600">Teeth Detected</p>
                        <p className="text-2xl font-bold">{detection.total_teeth_detected}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Findings</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {detection.total_caries_detected}
                        </p>
                      </div>
                    </div>

                    {detection.notes && (
                      <div className="flex items-start gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                        <p className="text-gray-700 line-clamp-2">{detection.notes}</p>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      onClick={() => navigate(`/detection/${detection.detection_id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
