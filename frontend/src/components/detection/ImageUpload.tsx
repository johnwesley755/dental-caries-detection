// frontend/src/components/detection/ImageUpload.tsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ImageType } from '../../types/detection.types';
import type { Patient } from '../../types/patient.types';

interface ImageUploadProps {
  patients: Patient[];
  onUpload: (file: File, patientId: string, imageType?: ImageType, notes?: string) => Promise<void>;
  isLoading?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  patients,
  onUpload,
  isLoading = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [imageType, setImageType] = useState<ImageType | undefined>(undefined);
  const [notes, setNotes] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/bmp': ['.bmp'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedPatient) return;

    await onUpload(selectedFile, selectedPatient, imageType, notes);
  };

  const canSubmit = selectedFile && selectedPatient && !isLoading;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Dental Image
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selection */}
          <div className="space-y-2">
            <Label htmlFor="patient">Select Patient *</Label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger id="patient">
                <SelectValue placeholder="Choose a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.full_name} ({patient.patient_id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image Upload Area */}
          <div className="space-y-2">
            <Label>Dental Image *</Label>
            {!selectedFile ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-primary'
                }`}
              >
                <input {...getInputProps()} />
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                {isDragActive ? (
                  <p className="text-sm text-primary">Drop the image here...</p>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Drag & drop an image here, or click to select
                    </p>
                    <p className="text-xs text-gray-500">
                      Supported formats: JPG, PNG, BMP
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative border rounded-lg p-4">
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex items-start gap-4">
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Image Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="imageType">Image Type (Optional)</Label>
            <Select
              value={imageType}
              onValueChange={(value) => setImageType(value as ImageType)}
            >
              <SelectTrigger id="imageType">
                <SelectValue placeholder="Select image type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ImageType.INTRAORAL}>Intraoral</SelectItem>
                <SelectItem value={ImageType.BITEWING}>Bitewing</SelectItem>
                <SelectItem value={ImageType.PERIAPICAL}>Periapical</SelectItem>
                <SelectItem value={ImageType.PANORAMIC}>Panoramic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes or observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Analyze Image
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
