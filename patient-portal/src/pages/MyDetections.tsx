// patient-portal/src/pages/MyDetections.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Calendar, Eye, Plus, Upload, X, Search, Activity, Sparkles } from 'lucide-react';
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
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'reviewed':
        return 'bg-blue-50 text-primary border-blue-100';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50">
        <LoadingSpinner size="md" text="Syncing scans..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 p-4 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
             <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary shadow-inner">
                   <Search className="h-5 w-5" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Diagnostic Vault</h1>
             </div>
             <p className="text-slate-500 font-bold tracking-tight">Manage and track your historical AI dental scans</p>
          </div>
          <Button
            onClick={() => setShowUploadModal(true)}
            className="bg-primary hover:bg-blue-900 text-white px-8 h-12 rounded-2xl shadow-xl shadow-primary/20 font-black text-[10px] transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" strokeWidth={3} />
            Quick Upload
          </Button>
        </div>

        {detections.length === 0 ? (
          <Card className="border-none shadow-2xl shadow-blue-900/5 rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-xl">
            <CardContent className="py-24 text-center space-y-6">
              <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                <Calendar className="h-10 w-10 text-primary opacity-30" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">No scans found</h3>
                <p className="text-slate-400 font-bold max-w-sm mx-auto">Your clinical diagnostic records will appear here after your first AI analysis visit.</p>
              </div>
              <Button
                onClick={() => setShowUploadModal(true)}
                variant="outline"
                className="mt-4 border-2 border-slate-100 hover:bg-slate-50 rounded-[1.25rem] px-8 h-12 font-black text-[10px] text-slate-500"
              >
                Upload First Scan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {detections.map((detection) => (
              <Card key={detection.id} className="border-none shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 rounded-[2rem] overflow-hidden group bg-white/90 backdrop-blur-xl border border-white/20">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400">Clinical Record</p>
                      <h3 className="font-black text-slate-900 tracking-tight text-lg">#{detection.detection_id.substring(0, 8)}</h3>
                    </div>
                    <Badge variant="outline" className={`px-3 py-1 rounded-xl text-[10px] font-black border-2 ${getStatusColor(detection.status)}`}>
                      {detection.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner group-hover:bg-white transition-colors duration-300">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 tracking-tight">Teeth Analyzed</p>
                      <p className="text-2xl font-black text-slate-900 leading-none">{detection.total_teeth_detected}</p>
                    </div>
                    <div className="space-y-1 pl-4 border-l border-slate-200">
                      <p className="text-[10px] font-black text-slate-400 tracking-tight">AI Findings</p>
                      <p className={`text-2xl font-black leading-none ${detection.total_caries_detected > 0 ? 'text-primary' : 'text-emerald-500'}`}>
                        {detection.total_caries_detected}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-black text-slate-400 bg-slate-50/50 px-4 py-2 rounded-xl">
                    <div className="flex items-center gap-2">
                       <Calendar className="h-3 w-3" />
                       {new Date(detection.detection_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2">
                       <Activity className="h-3 w-3" />
                       Analysis v2.4
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 bg-white hover:bg-primary hover:text-white text-primary border-2 border-blue-50 hover:border-primary rounded-xl font-black text-[10px] transition-all shadow-sm hover:shadow-xl hover:shadow-primary/20"
                    onClick={() => navigate(`/detection/${detection.detection_id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" strokeWidth={3} />
                    View Analysis
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Upload Modal Overlay */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
            <Card className="w-full max-w-xl border-none shadow-[0_40px_100px_-20px_rgba(30,58,138,0.25)] rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-300 bg-white">
              <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-primary text-white">
                <div className="space-y-1">
                   <h2 className="text-2xl font-black tracking-tight leading-none">Clinical Upload</h2>
                   <p className="text-[10px] font-bold text-blue-100">Verified Diagnostic Interface</p>
                </div>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-2xl transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <CardContent className="p-10 space-y-8">
                {!selectedFile ? (
                  <label className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:border-primary hover:bg-blue-50/50 transition-all group relative overflow-hidden bg-slate-50/50">
                    <div className="absolute inset-0 bg-white/20 pattern-grid-lg opacity-10" />
                    <div className="h-20 w-20 rounded-[2rem] bg-white border border-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-xl shadow-blue-900/5">
                      <Upload className="h-10 w-10 text-primary" />
                    </div>
                    <span className="text-lg font-black text-slate-900 tracking-tight">Select Scan Image</span>
                    <span className="text-xs text-slate-400 mt-2 text-center px-10 font-bold leading-relaxed">
                      Clinical standard photography or radiographic imagery (JPG/PNG • max 10MB)
                    </span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                ) : (
                  <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="relative rounded-[2rem] overflow-hidden bg-slate-100 aspect-video flex items-center justify-center border-4 border-white shadow-2xl">
                      {previewUrl && <img src={previewUrl} alt="Preview" className="max-h-full object-cover w-full" />}
                      <button
                        onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                        className="absolute top-4 right-4 h-10 w-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 hover:bg-white transition-all shadow-xl"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 ml-1">
                         <Sparkles className="h-4 w-4 text-primary" />
                         <label className="text-[10px] font-black text-slate-400">Clinical Context (Optional)</label>
                      </div>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Detail specific concerns e.g. pain level, location..."
                        className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all resize-none text-sm font-bold min-h-[120px] shadow-inner"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 h-14 rounded-2xl border-2 border-slate-100 text-slate-400 font-black text-[10px] hover:bg-slate-50 transition-all"
                    onClick={() => setShowUploadModal(false)}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 h-14 bg-primary hover:bg-blue-900 text-white rounded-2xl shadow-2xl shadow-primary/20 font-black text-[10px] transition-all hover:scale-105 active:scale-95"
                    disabled={!selectedFile || isUploading}
                    onClick={handleUpload}
                  >
                    {isUploading ? (
                      <div className="flex items-center gap-3">
                        <LoadingSpinner size="sm" />
                        <span>Analyzing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Activity className="h-4 w-4" strokeWidth={3} />
                        <span>Initiate AI Audit</span>
                      </div>
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
