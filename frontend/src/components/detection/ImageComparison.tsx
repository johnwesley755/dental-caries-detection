// frontend/src/components/detection/ImageComparison.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { SlidersHorizontal, Columns2, Maximize2 } from 'lucide-react';

interface ImageComparisonProps {
  originalImageUrl?: string;
  annotatedImageUrl?: string;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({ originalImageUrl, annotatedImageUrl }) => {
  const [viewMode, setViewMode] = useState<'split' | 'slider'>('slider');
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setSliderPosition(Math.max(0, Math.min(100, (x / rect.width) * 100)));
  };

  if (!originalImageUrl && !annotatedImageUrl) return null;

  return (
    <Card className="border-none shadow-sm bg-white rounded-[20px] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50 p-4">
        <CardTitle className="text-lg font-bold text-slate-800">Visual Comparison</CardTitle>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('split')}
            className={`h-8 rounded-lg px-3 text-xs font-medium ${viewMode === 'split' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Columns2 className="h-3.5 w-3.5 mr-2" /> Side-by-Side
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('slider')}
            className={`h-8 rounded-lg px-3 text-xs font-medium ${viewMode === 'slider' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 mr-2" /> Slider Overlay
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 bg-slate-50 min-h-[400px] flex items-center justify-center">
        {viewMode === 'split' ? (
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Original</span>
                <img src={originalImageUrl} className="rounded-xl shadow-sm border border-slate-200 w-full" alt="Original" />
            </div>
            <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Detected</span>
                <img src={annotatedImageUrl} className="rounded-xl shadow-sm border border-slate-200 w-full" alt="Annotated" />
            </div>
          </div>
        ) : (
          <div 
            className="relative w-full max-w-2xl aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-slate-200 cursor-ew-resize group select-none"
            onMouseMove={handleSliderChange}
          >
            {/* Background: Annotated */}
            <img src={annotatedImageUrl} alt="Annotated" className="absolute inset-0 w-full h-full object-contain bg-black" />
            
            {/* Foreground: Original (Clipped) */}
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                <img src={originalImageUrl} alt="Original" className="w-full h-full object-contain bg-black" />
            </div>

            {/* Slider Handle */}
            <div className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize" style={{ left: `${sliderPosition}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <SlidersHorizontal className="h-4 w-4 text-blue-600" />
                </div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none">Original</div>
            <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none">AI Detection</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};