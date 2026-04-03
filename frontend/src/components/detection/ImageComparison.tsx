// frontend/src/components/detection/ImageComparison.tsx
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { SlidersHorizontal, Columns2 } from 'lucide-react';

interface ImageComparisonProps {
  originalImageUrl?: string;
  annotatedImageUrl?: string;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({ originalImageUrl, annotatedImageUrl }) => {
  const [viewMode, setViewMode] = useState<'split' | 'slider'>('slider');
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    setSliderPosition(Math.max(0, Math.min(100, (x / rect.width) * 100)));
  }, []);

  const onMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) handleMove(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  if (!originalImageUrl && !annotatedImageUrl) return null;

  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] overflow-hidden transition-all">
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-50 p-6 sm:p-8 gap-4">
        <CardTitle className="text-sm font-headline font-black text-blue-900 uppercase tracking-widest">Visual Comparison</CardTitle>
        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 w-full sm:w-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('split')}
            className={`flex-1 sm:flex-none h-10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'split' ? 'bg-white shadow-md text-primary' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Columns2 className="h-3.5 w-3.5 mr-2" /> Split
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('slider')}
            className={`flex-1 sm:flex-none h-10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'slider' ? 'bg-white shadow-md text-primary' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 mr-2" /> Slider
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-8 bg-slate-50/30 min-h-[300px] flex items-center justify-center">
        {viewMode === 'split' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Native Radio</span>
                <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-black aspect-video flex items-center justify-center">
                   <img src={originalImageUrl} className="w-full h-full object-contain opacity-80" alt="Original" />
                </div>
            </div>
            <div className="space-y-3">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Neural Overlay</span>
                <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-black aspect-video flex items-center justify-center">
                  <img src={annotatedImageUrl} className="w-full h-full object-contain" alt="Annotated" />
                </div>
            </div>
          </div>
        ) : (
          <div 
            ref={containerRef}
            className="relative w-full max-w-3xl aspect-video rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 cursor-ew-resize group select-none bg-black"
            onMouseMove={onMouseMove}
            onTouchMove={onTouchMove}
            onMouseDown={(e) => handleMove(e.clientX)}
          >
            {/* Background: Annotated */}
            <img src={annotatedImageUrl} alt="Annotated" className="absolute inset-0 w-full h-full object-contain" />
            
            {/* Foreground: Original (Clipped) */}
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                <img src={originalImageUrl} alt="Original" className="w-full h-full object-contain opacity-80 grayscale" />
            </div>

            {/* Slider Handle */}
            <div className="absolute top-0 bottom-0 w-[2px] bg-white/50 backdrop-blur-md cursor-ew-resize group-active:bg-primary transition-colors" style={{ left: `${sliderPosition}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center ring-4 ring-black/5">
                    <SlidersHorizontal className="h-5 w-5 text-primary" />
                </div>
            </div>

            {/* Labels */}
            <div className="absolute top-6 left-6 bg-black/60 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">Native</div>
            <div className="absolute top-6 right-6 bg-primary/80 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">Neural</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};