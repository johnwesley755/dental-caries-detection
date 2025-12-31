// frontend/src/components/dashboard/HistoryCard.tsx
import React from 'react';
import { Calendar, ArrowRight, FileImage } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import type { Detection } from '../../types/detection.types';
import { DetectionStatus } from '../../types/detection.types';

interface HistoryCardProps {
  detection: Detection;
  patientName?: string;
  showPatientInfo?: boolean;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({
  detection,
  patientName,
  showPatientInfo = true,
}) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: DetectionStatus) => {
    switch (status) {
      case DetectionStatus.COMPLETED:
        return <Badge className="bg-emerald-100 text-emerald-700 border-none shadow-none font-medium hover:bg-emerald-100">Done</Badge>;
      case DetectionStatus.REVIEWED:
        return <Badge className="bg-blue-100 text-blue-700 border-none shadow-none font-medium hover:bg-blue-100">Reviewed</Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-none shadow-none">Pending</Badge>;
    }
  };

  return (
    <Card 
      className="group border-none shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer bg-white rounded-[20px] overflow-hidden ring-1 ring-slate-100"
      onClick={() => navigate(`/detection/${detection.id}`)}
    >
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <FileImage className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{detection.detection_id.substring(0, 8)}</h4>
                {showPatientInfo && (
                  <p className="text-xs text-slate-400">{patientName || 'Unknown Patient'}</p>
                )}
              </div>
            </div>
            {getStatusBadge(detection.status)}
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
             <div className="bg-gray-50 rounded-xl p-2 text-center">
                <span className="block text-xl font-bold text-slate-800">{detection.total_teeth_detected}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Teeth</span>
             </div>
             <div className={`rounded-xl p-2 text-center ${detection.total_caries_detected > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                <span className={`block text-xl font-bold ${detection.total_caries_detected > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {detection.total_caries_detected}
                </span>
                <span className={`text-[10px] uppercase tracking-wider font-semibold ${detection.total_caries_detected > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    Caries
                </span>
             </div>
          </div>
        </div>

        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <Calendar className="h-3 w-3" />
            <span>{new Date(detection.detection_date).toLocaleDateString()}</span>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
        </div>
      </CardContent>
    </Card>
  );
};