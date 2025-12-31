// frontend/src/components/detection/AnnotatedImage.tsx
import React, { useState } from 'react';
import { Download, ZoomIn, ZoomOut, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import type { Detection } from '../../types/detection.types';

interface AnnotatedImageProps {
  detection: Detection;
}

export const AnnotatedImage: React.FC<AnnotatedImageProps> = ({ detection }) => {
  const [zoom, setZoom] = useState(1);
  const [showOriginal, setShowOriginal] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const getImageUrl = (path: string) => `${API_BASE_URL}/${path.startsWith('/') ? path.slice(1) : path}`;
  const displayUrl = showOriginal 
    ? (detection.original_image_url || getImageUrl(detection.original_image_path))
    : (detection.annotated_image_url || (detection.annotated_image_path ? getImageUrl(detection.annotated_image_path) : null));

  const handleDownload = () => {
    if (!displayUrl) return;
    const link = document.createElement('a');
    link.href = displayUrl;
    link.download = `detection_${detection.id}_${showOriginal ? 'original' : 'annotated'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full border-none shadow-sm bg-white rounded-[20px] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50 p-4">
        <CardTitle className="text-lg font-bold text-slate-800">Visual Analysis</CardTitle>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md bg-white shadow-sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}><ZoomOut className="h-4 w-4" /></Button>
           <div className="flex items-center justify-center px-2 text-xs font-mono w-12">{(zoom * 100).toFixed(0)}%</div>
           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md bg-white shadow-sm" onClick={() => setZoom(Math.min(3, zoom + 0.25))}><ZoomIn className="h-4 w-4" /></Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative bg-slate-900 overflow-hidden flex items-center justify-center min-h-[400px]">
         <div className="overflow-auto w-full h-full flex items-center justify-center p-4">
            <div style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s ease' }}>
                {displayUrl ? (
                    <img src={displayUrl} alt="Analysis" className="max-w-full rounded-lg shadow-2xl" />
                ) : (
                    <div className="text-white opacity-50">Image unavailable</div>
                )}
            </div>
         </div>
         
         {/* Floating Toolbar */}
         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/10">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowOriginal(!showOriginal)}
                className="text-white hover:bg-white/20 rounded-full px-4 h-9"
            >
                {showOriginal ? <><EyeOff className="h-4 w-4 mr-2" /> Show Annotated</> : <><Eye className="h-4 w-4 mr-2" /> Show Original</>}
            </Button>
            <div className="w-px bg-white/20 h-5 my-auto"></div>
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDownload}
                className="text-white hover:bg-white/20 rounded-full px-4 h-9"
            >
                <Download className="h-4 w-4 mr-2" /> Save Image
            </Button>
         </div>
      </CardContent>
    </Card>
  );
};