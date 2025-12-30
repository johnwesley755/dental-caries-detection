// frontend/src/components/detection/AnnotatedImage.tsx
import React, { useState } from 'react';
import { Download, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import type{ Detection } from '../../types/detection.types';

interface AnnotatedImageProps {
  detection: Detection;
}

export const AnnotatedImage: React.FC<AnnotatedImageProps> = ({ detection }) => {
  const [zoom, setZoom] = useState(1);
  const [showOriginal, setShowOriginal] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleDownload = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getImageUrl = (path: string) => {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  // Prioritize Cloudinary URLs, fallback to local paths
  const originalImageUrl = detection.original_image_url || getImageUrl(detection.original_image_path);
  const annotatedImageUrl = detection.annotated_image_url || 
    (detection.annotated_image_path ? getImageUrl(detection.annotated_image_path) : null);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Image Analysis</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[60px] text-center">
              {(zoom * 100).toFixed(0)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Toggle Buttons */}
          <div className="flex gap-2">
            <Button
              variant={showOriginal ? 'default' : 'outline'}
              onClick={() => setShowOriginal(true)}
              className="flex-1"
            >
              Original Image
            </Button>
            {annotatedImageUrl && (
              <Button
                variant={!showOriginal ? 'default' : 'outline'}
                onClick={() => setShowOriginal(false)}
                className="flex-1"
              >
                Annotated Image
              </Button>
            )}
          </div>

          {/* Image Display */}
          <div className="relative border rounded-lg overflow-hidden bg-gray-50">
            <div className="overflow-auto max-h-[600px]">
              <div
                className="inline-block min-w-full"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left',
                  transition: 'transform 0.2s ease-in-out',
                }}
              >
                {showOriginal ? (
                  <img
                    src={originalImageUrl}
                    alt="Original dental X-ray"
                    className="w-full h-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
                    }}
                  />
                ) : (
                  annotatedImageUrl && (
                    <img
                      src={annotatedImageUrl}
                      alt="Annotated dental X-ray with detections"
                      className="w-full h-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EAnnotated image not available%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  )
                )}
              </div>
            </div>

            {/* Zoom Indicator */}
            {zoom !== 1 && (
              <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                <Maximize2 className="h-3 w-3" />
                {(zoom * 100).toFixed(0)}%
              </div>
            )}
          </div>

          {/* Download Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() =>
                handleDownload(
                  originalImageUrl,
                  `original_${detection.detection_id}.jpg`
                )
              }
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Original
            </Button>
            {annotatedImageUrl && (
              <Button
                variant="outline"
                onClick={() =>
                  handleDownload(
                    annotatedImageUrl,
                    `annotated_${detection.detection_id}.jpg`
                  )
                }
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Annotated
              </Button>
            )}
          </div>

          {/* Image Info */}
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Detection ID:</span> {detection.detection_id}
            </p>
            {detection.caries_findings && detection.caries_findings.length > 0 && (
              <p>
                <span className="font-medium">Detections:</span>{' '}
                {detection.caries_findings.length} caries finding(s) highlighted
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
