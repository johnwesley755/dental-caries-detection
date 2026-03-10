// patient-portal/src/pages/MyDetections.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Calendar, Eye, AlertCircle, Plus, Upload, X, Loader2 } from 'lucide-react';
import { patientService } from '../services/patientService';
import type { Detection } from '../types/detection.types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const MyDetections: React.FC = () => {
  const navigate = useNavigate();
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      await patientService.uploadDetection(selectedFile, notes);
      toast.success('Detection started successfully');
      setShowUploadModal(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setNotes('');
      loadDetections();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'reviewed':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-emerald-100 text-emerald-800';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Dental Scans</h1>
            <p className="text-gray-600 mt-1">View all your dental examination records</p>
          </div>
          <Button
            onClick={() => setShowUploadModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Scan
          </Button>
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
                        <p className="text-2xl font-bold text-teal-600">
                          {detection.total_caries_detected}
                        </p>
                      </div>
                    </div>

                    {detection.notes && (
                      <div className="flex items-start gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-teal-600 mt-0.5" />
                        <p className="text-gray-700 line-clamp-2">
                          {typeof detection.notes === 'string' ? detection.notes : JSON.stringify(detection.notes)}
                        </p>
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

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <Card className="w-full max-w-lg">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-bold">Upload New Scan</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowUploadModal(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <CardContent className="p-6 space-y-6">
                {!selectedFile ? (
                  <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click or drag to upload dental image</span>
                    <span className="text-xs text-gray-400 mt-1">JPG, PNG up to 10MB</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video flex items-center justify-center">
                      {previewUrl && <img src={previewUrl} alt="Preview" className="max-h-full" />}
                      <button
                        onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Notes (Optional)</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Pain in upper right molar..."
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowUploadModal(false)}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-teal-600 hover:bg-teal-700"
                    disabled={!selectedFile || isUploading}
                    onClick={handleUpload}
                  >
                    {isUploading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Uploading...
                      </>
                    ) : (
                      'Start Analysis'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
