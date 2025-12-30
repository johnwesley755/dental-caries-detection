// frontend/src/pages/DetectionDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Download, Printer, FileText, Share2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ImageComparison } from '../components/detection/ImageComparison';
import { SeverityChart } from '../components/detection/SeverityChart';
import { DetectionResult } from '../components/detection/DetectionResult';
import { ShareDialog } from '../components/detection/ShareDialog';
import { detectionService } from '../services/detectionService';
import { patientService } from '../services/patientService';
import { reportService } from '../services/reportService';
import type { Detection } from '../types/detection.types';
import type { Patient } from '../types/patient.types';
import { DetectionStatus } from '../types/detection.types';

export const DetectionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detection, setDetection] = useState<Detection | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      loadDetectionDetails(id);
    }
  }, [id]);

  const loadDetectionDetails = async (detectionId: string) => {
    setIsLoading(true);
    try {
      const detectionData = await detectionService.getDetection(detectionId);
      setDetection(detectionData);

      // Load patient data
      const patientData = await patientService.getPatient(detectionData.patient_id);
      setPatient(patientData);
    } catch (error: any) {
      console.error('Failed to load detection details:', error);
      toast.error('Failed to load detection details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!detection) return;
    
    setIsDownloading(true);
    try {
      const blob = await reportService.downloadPDF(detection.id);
      reportService.triggerDownload(blob, `Detection_Report_${detection.detection_id}.pdf`);
      toast.success('Report downloaded successfully!');
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(error.response?.data?.detail || 'Failed to download report');
    } finally {
      setIsDownloading(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!detection) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Detection not found</h3>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{detection.detection_id}</h1>
                <Badge variant="outline" className={getStatusColor(detection.status)}>
                  {detection.status.toUpperCase()}
                </Badge>
              </div>
              {patient && (
                <p className="text-gray-600 mt-1">
                  Patient: {patient.full_name} • {new Date(detection.detection_date).toLocaleString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={isDownloading}>
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShareDialogOpen(true)}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Image Comparison */}
        <ImageComparison
          originalImageUrl={detection.original_image_url}
          annotatedImageUrl={detection.annotated_image_url}
        />

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Teeth Detected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{detection.total_teeth_detected}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Caries Detected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{detection.total_caries_detected}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Findings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{detection.caries_findings?.length || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Processing Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">
                {(detection.processing_time_ms / 1000).toFixed(2)}s
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detection Results and Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DetectionResult detection={detection} />
          </div>
          <div>
            <SeverityChart detection={detection} />
          </div>
        </div>

        {/* Notes */}
        {detection.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{detection.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => navigate('/history')}>
            View All Detections
          </Button>
          {patient && (
            <Button variant="outline" onClick={() => navigate(`/patients/${patient.id}`)}>
              View Patient Profile
            </Button>
          )}
          <Button onClick={() => navigate('/detection')}>New Detection</Button>
        </div>

        {/* Share Dialog */}
        {detection && (
          <ShareDialog
            open={shareDialogOpen}
            onOpenChange={setShareDialogOpen}
            detectionId={detection.id}
            detection_id={detection.detection_id}
          />
        )}
      </div>
    </div>
  );
};
