// frontend/src/components/detection/DetectionResult.tsx
import React from 'react';
import { FileText, Clock, Target, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Severity, CariesType } from '../../types/detection.types';
import type { Detection } from '../../types/detection.types';

interface DetectionResultProps {
  detection: Detection;
}

export const DetectionResult: React.FC<DetectionResultProps> = ({ detection }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'reviewed':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity?: Severity) => {
    switch (severity) {
      case Severity.MILD:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case Severity.MODERATE:
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case Severity.SEVERE:
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCariesTypeLabel = (type?: CariesType) => {
    if (!type) return 'N/A';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <Badge className={`mt-1 ${getStatusColor(detection.status)}`}>
                  {detection.status.toUpperCase()}
                </Badge>
              </div>
              <CheckCircle2 className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Teeth Detected</p>
                <p className="text-2xl font-bold mt-1">{detection.total_teeth_detected}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Caries Found</p>
                <p className="text-2xl font-bold mt-1 text-red-600">
                  {detection.total_caries_detected}
                </p>
              </div>
              <Target className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing Time</p>
                <p className="text-2xl font-bold mt-1">
                  {(detection.processing_time_ms / 1000).toFixed(2)}s
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detection Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detection Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Detection ID:</span>
              <span className="ml-2">{detection.detection_id}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Detection Date:</span>
              <span className="ml-2">
                {new Date(detection.detection_date).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Image Type:</span>
              <span className="ml-2">
                {detection.image_type
                  ? detection.image_type.charAt(0).toUpperCase() +
                    detection.image_type.slice(1)
                  : 'N/A'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Confidence Threshold:</span>
              <span className="ml-2">{(detection.confidence_threshold * 100).toFixed(1)}%</span>
            </div>
          </div>
          {detection.notes && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-600 text-sm mb-1">Notes:</p>
              <p className="text-sm text-gray-700">{detection.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Caries Findings Table */}
      {detection.caries_findings && detection.caries_findings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Caries Findings ({detection.caries_findings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tooth #</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Recommendation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detection.caries_findings.map((finding) => (
                    <TableRow key={finding.id}>
                      <TableCell className="font-medium">
                        {finding.tooth_number || 'N/A'}
                      </TableCell>
                      <TableCell>{getCariesTypeLabel(finding.caries_type)}</TableCell>
                      <TableCell>
                        {finding.severity && (
                          <Badge
                            variant="outline"
                            className={getSeverityColor(finding.severity)}
                          >
                            {finding.severity.toUpperCase()}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${finding.confidence_score * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm">
                            {(finding.confidence_score * 100).toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{finding.location || 'N/A'}</TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-gray-600 truncate">
                          {finding.treatment_recommendation || 'No recommendation'}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
