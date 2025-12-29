// patient-portal/src/pages/DetectionView.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ArrowLeft, Calendar, Clock, AlertCircle } from 'lucide-react';
import { patientService } from '../services/patientService';
import type { Detection } from '../types/detection.types';

export const DetectionView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detection, setDetection] = useState<Detection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadDetection(id);
    }
  }, [id]);

  const loadDetection = async (detectionId: string) => {
    setIsLoading(true);
    try {
      const data = await patientService.getDetection(detectionId);
      setDetection(data);
    } catch (error: any) {
      toast.error('Failed to load detection details');
      navigate('/detections');
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

  if (!detection) {
    return null;
  }

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'severe':
        return 'bg-red-100 text-red-800';
      case 'moderate':
        return 'bg-orange-100 text-orange-800';
      case 'mild':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/detections')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Scans
        </Button>

        <div>
          <h1 className="text-3xl font-bold">{detection.detection_id}</h1>
          <div className="flex items-center gap-4 mt-2 text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(detection.detection_date).toLocaleDateString()}
            </div>
            {detection.processing_time_ms && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {(detection.processing_time_ms / 1000).toFixed(2)}s
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Teeth Detected</p>
              <p className="text-3xl font-bold mt-2">{detection.total_teeth_detected}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Findings</p>
              <p className="text-3xl font-bold mt-2 text-orange-600">{detection.total_caries_detected}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Status</p>
              <Badge className="mt-2">{detection.status}</Badge>
            </CardContent>
          </Card>
        </div>

        {detection.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Dentist Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{detection.notes}</p>
            </CardContent>
          </Card>
        )}

        {detection.caries_findings && detection.caries_findings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Findings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {detection.caries_findings.map((finding, index) => (
                  <div key={finding.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">Finding #{index + 1}</p>
                        {finding.tooth_number && (
                          <p className="text-sm text-gray-600">Tooth #{finding.tooth_number}</p>
                        )}
                      </div>
                      {finding.severity && (
                        <Badge className={getSeverityColor(finding.severity)}>
                          {finding.severity}
                        </Badge>
                      )}
                    </div>
                    {finding.location && (
                      <p className="text-sm text-gray-700 mb-2">Location: {finding.location}</p>
                    )}
                    {finding.treatment_recommendation && (
                      <p className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
                        <strong>Recommendation:</strong> {finding.treatment_recommendation}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Confidence: {(finding.confidence_score * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
