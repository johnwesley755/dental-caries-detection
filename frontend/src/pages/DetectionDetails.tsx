// frontend/src/pages/DetectionDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Download, Share2, Calendar, User, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ImageComparison } from '../components/detection/ImageComparison';
import { SeverityChart } from '../components/detection/SeverityChart';
import { DetectionResult } from '../components/detection/DetectionResult';
import { ShareDialog } from '../components/detection/ShareDialog';
import { detectionService } from '../services/detectionService';
import { patientService } from '../services/patientService';
import { reportService } from '../services/reportService';
import { type Detection, DetectionStatus } from '../types/detection.types';
import type { Patient } from '../types/patient.types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { TopNavBar } from '../components/layout/TopNavBar';

export const DetectionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load detection details');
      toast.error(error.message);
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
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to download report');
      toast.error(error.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatusBadge = (status: DetectionStatus) => {
    switch (status) {
      case DetectionStatus.COMPLETED:
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1">Completed</Badge>;
      case DetectionStatus.REVIEWED:
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-none px-3 py-1">Reviewed</Badge>;
      default:
        return <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none px-3 py-1">Processing</Badge>;
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (!detection) return null;

  return (
    <div className="min-h-screen bg-surface">
      <TopNavBar title="Analysis Report" />
      
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-headline font-black text-blue-900 uppercase">Neural Report</h1>
              {getStatusBadge(detection.status)}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-tight">
              <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {patient?.full_name || 'Patient Unknown'}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(detection.detection_date).toLocaleDateString()}</span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-100 font-mono tracking-tighter text-[10px]">{detection.detection_id}</span>
            </div>
          </div>

          <div className="flex flex-row md:flex-row gap-3">
            <Button variant="outline" className="flex-1 sm:flex-none h-12 bg-white border-slate-100 shadow-sm text-slate-600 hover:text-primary rounded-xl" onClick={() => setShareDialogOpen(true)}>
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
            <Button onClick={handleDownloadPDF} disabled={isDownloading} className="flex-1 sm:flex-none h-12 bg-primary hover:bg-blue-700 text-white shadow-xl shadow-primary/20 rounded-xl">
              {isDownloading ? <LoadingSpinner size="sm" className="mr-2" /> : <Download className="h-4 w-4 mr-2" />}
              PDF Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          {/* LEFT COLUMN: Visuals */}
          <div className="md:col-span-12 lg:col-span-7 space-y-6">
            <ImageComparison
              originalImageUrl={detection.original_image_url}
              annotatedImageUrl={detection.annotated_image_url}
            />

            {/* Notes Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
              <h3 className="text-sm font-headline font-black text-blue-900 mb-6 flex items-center gap-3 uppercase tracking-widest">
                <FileText className="h-5 w-5 text-primary" /> Clinical Assessment
              </h3>
              <div className="bg-slate-50 p-6 rounded-2xl text-slate-600 text-sm font-medium leading-relaxed">
                {detection.notes
                  ? (typeof detection.notes === 'string' ? detection.notes : JSON.stringify(detection.notes))
                  : "No additional clinical findings documented for this diagnostic run."}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Results */}
          <div className="md:col-span-12 lg:col-span-5 space-y-6">
            <DetectionResult detection={detection} />
            <SeverityChart detection={detection} />
          </div>
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