// frontend/src/components/dashboard/HistoryCard.tsx
import React from 'react';
import { Calendar, FileText, Activity, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { Detection } from '../../types/detection.types';
import { DetectionStatus } from '../../types/detection.types';

interface HistoryCardProps {
  detection: Detection;
  patientName?: string;
  showPatientInfo?: boolean;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({
  detection,
  patientName,
  showPatientInfo = true,
}) => {
  const navigate = useNavigate();

  const getStatusColor = (status: DetectionStatus) => {
    switch (status) {
      case DetectionStatus.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-300';
      case DetectionStatus.REVIEWED:
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case DetectionStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityColor = (count: number) => {
    if (count === 0) return 'text-green-600';
    if (count <= 2) return 'text-yellow-600';
    if (count <= 5) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-500" />
                <h3 className="font-semibold text-lg">{detection.detection_id}</h3>
              </div>
              {showPatientInfo && patientName && (
                <p className="text-sm text-gray-600">Patient: {patientName}</p>
              )}
            </div>
            <Badge variant="outline" className={getStatusColor(detection.status)}>
              {detection.status.toUpperCase()}
            </Badge>
          </div>

          {/* Date and Time */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{new Date(detection.detection_date).toLocaleString()}</span>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 py-3 border-t border-b">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Activity className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {detection.total_teeth_detected}
              </p>
              <p className="text-xs text-gray-600">Teeth</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Activity className="h-4 w-4 text-red-500" />
              </div>
              <p
                className={`text-2xl font-bold ${getSeverityColor(
                  detection.total_caries_detected
                )}`}
              >
                {detection.total_caries_detected}
              </p>
              <p className="text-xs text-gray-600">Caries</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <FileText className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-600">
                {detection.caries_findings?.length || 0}
              </p>
              <p className="text-xs text-gray-600">Findings</p>
            </div>
          </div>

          {/* Image Type and Processing Time */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Image Type:</span>
              <p className="font-medium">
                {detection.image_type
                  ? detection.image_type.charAt(0).toUpperCase() +
                    detection.image_type.slice(1)
                  : 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Processing:</span>
              <p className="font-medium">
                {(detection.processing_time_ms / 1000).toFixed(2)}s
              </p>
            </div>
          </div>

          {/* Notes Preview */}
          {detection.notes && (
            <div className="text-sm">
              <span className="text-gray-600">Notes:</span>
              <p className="text-gray-700 line-clamp-2 mt-1">{detection.notes}</p>
            </div>
          )}

          {/* View Details Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate(`/detection/${detection.id}`)}
          >
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
