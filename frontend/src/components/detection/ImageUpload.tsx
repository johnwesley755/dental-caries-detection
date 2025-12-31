// frontend/src/components/detection/ImageUpload.tsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, FileUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ImageType } from '../../types/detection.types';
import type { Patient } from '../../types/patient.types';

interface ImageUploadProps {
  patients: Patient[];
  onUpload: (file: File, patientId: string, imageType?: ImageType, notes?: string) => Promise<void>;
  isLoading?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ patients, onUpload, isLoading = false }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [imageType, setImageType] = useState<ImageType | undefined>(undefined);
  const [notes, setNotes] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/bmp': ['.bmp'] },
    maxFiles: 1,
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedPatient) return;
    await onUpload(selectedFile, selectedPatient, imageType, notes);
  };

  return (
    <Card className="w-full border-none shadow-sm bg-white rounded-[20px] overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileUp className="h-5 w-5" /> Upload New Scan
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-600 font-semibold">Select Patient *</Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-100">
                  <SelectValue placeholder="Search or select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.full_name} ({p.patient_id})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-600 font-semibold">Scan Type</Label>
              <Select value={imageType} onValueChange={(v) => setImageType(v as ImageType)}>
                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-100">
                  <SelectValue placeholder="e.g. Panoramic, Bitewing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ImageType.INTRAORAL}>Intraoral</SelectItem>
                  <SelectItem value={ImageType.BITEWING}>Bitewing</SelectItem>
                  <SelectItem value={ImageType.PERIAPICAL}>Periapical</SelectItem>
                  <SelectItem value={ImageType.PANORAMIC}>Panoramic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-600 font-semibold">X-Ray Image *</Label>
            {!selectedFile ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-[20px] p-10 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
                  <ImageIcon className="h-8 w-8" />
                </div>
                <p className="text-lg font-medium text-slate-700">Drag & drop or click to upload</p>
                <p className="text-sm text-slate-400 mt-1">Supports JPG, PNG, BMP (Max 10MB)</p>
              </div>
            ) : (
              <div className="relative border border-slate-200 rounded-[20px] p-4 bg-slate-50 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => { setSelectedFile(null); setPreview(null); }}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                {preview && <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-xl border border-white shadow-sm" />}
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-sm truncate">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-green-500 w-full rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-slate-600 font-semibold">Clinical Notes</Label>
            <Textarea
              placeholder="Add any specific areas of concern..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 resize-none p-4"
            />
          </div>

          <Button type="submit" disabled={!selectedFile || !selectedPatient || isLoading} className="w-full h-12 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
            {isLoading ? 'Processing Scan...' : 'Run Analysis'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};