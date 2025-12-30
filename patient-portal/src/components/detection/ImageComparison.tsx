// patient-portal/src/components/detection/ImageComparison.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Maximize2, Minimize2, SlidersHorizontal, Columns2 } from 'lucide-react';

interface ImageComparisonProps {
  originalImageUrl?: string;
  annotatedImageUrl?: string;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({
  originalImageUrl,
  annotatedImageUrl,
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'slider'>('split');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  if (!originalImageUrl && !annotatedImageUrl) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">No images available for this detection</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Image Comparison</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'split' ? 'slider' : 'split')}
            >
              {viewMode === 'split' ? (
                <>
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Slider View
                </>
              ) : (
                <>
                  <Columns2 className="h-4 w-4 mr-2" />
                  Split View
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'split' ? (
          /* Split View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Original Image</h3>
              <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
                {originalImageUrl ? (
                  <img
                    src={originalImageUrl}
                    alt="Original dental X-ray"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No original image
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">AI Detection</h3>
              <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
                {annotatedImageUrl ? (
                  <img
                    src={annotatedImageUrl}
                    alt="AI-annotated dental X-ray"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No annotated image
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Slider View */
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold text-gray-700">
              <span>Original</span>
              <span>AI Detection</span>
            </div>
            <div
              className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video cursor-ew-resize"
              onMouseMove={handleSliderChange}
            >
              {/* Annotated Image (Background) */}
              {annotatedImageUrl && (
                <img
                  src={annotatedImageUrl}
                  alt="AI-annotated dental X-ray"
                  className="absolute inset-0 w-full h-full object-contain"
                />
              )}
              
              {/* Original Image (Foreground with clip) */}
              {originalImageUrl && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <img
                    src={originalImageUrl}
                    alt="Original dental X-ray"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              
              {/* Slider Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <SlidersHorizontal className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
