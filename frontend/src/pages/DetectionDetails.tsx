// frontend/src/pages/DetectionDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Download, Printer, Share2, Calendar, User, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
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
    if (id) loadDetectionDetails(id);
  }, [id]);

  const loadDetectionDetails = async (detectionId: string) => {
    setIsLoading(true);
    try {
      const detectionData = await detectionService.getDetection(detectionId);
      setDetection(detectionData);
      const patientData = await patientService.getPatient(detectionData.patient_id);
      setPatient(patientData);
    } catch (error: any) {
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
      toast.error('Failed to download report');
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatusBadge = (status: DetectionStatus) => {
    switch (status) {
      case DetectionStatus.COMPLETED:
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1">Completed</Badge>;
      case DetectionStatus.REVIEWED:
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3 py-1">Reviewed</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none px-3 py-1">Processing</Badge>;
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!detection) return null;

  return (
    <div className="min-h-screen bg-[#F4F7FE] p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-800">Analysis Report</h1>
            {getStatusBadge(detection.status)}
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
            <span className="flex items-center gap-1"><User className="h-4 w-4" /> {patient?.full_name || 'Unknown Patient'}</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(detection.detection_date).toLocaleString()}</span>
            <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-xs font-mono">{detection.detection_id}</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white border-none shadow-sm text-slate-600 hover:text-blue-600" onClick={() => setShareDialogOpen(true)}>
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
          <Button onClick={handleDownloadPDF} disabled={isDownloading} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
            {isDownloading ? <span className="animate-spin mr-2">⏳</span> : <Download className="h-4 w-4 mr-2" />}
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* LEFT COLUMN: Visuals (Images & Comparison) */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <ImageComparison
            originalImageUrl={detection.original_image_url}
            annotatedImageUrl={detection.annotated_image_url}
          />
          
          {/* Notes Card */}
          <div className="bg-white rounded-[20px] p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" /> Clinical Notes
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl text-slate-600 text-sm min-h-[100px]">
              {detection.notes || "No additional notes provided for this analysis."}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Data & Metrics */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <DetectionResult detection={detection} />
          <SeverityChart detection={detection} />
        </div>
      </div>

      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        detectionId={detection.id}
        detection_id={detection.detection_id}
      />
    </div>
  );
};