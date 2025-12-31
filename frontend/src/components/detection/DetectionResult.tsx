// frontend/src/components/detection/DetectionResult.tsx
import React from 'react';
import { Target, AlertTriangle, Clock, Layers } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Severity, CariesType } from '../../types/detection.types';
import type { Detection } from '../../types/detection.types';

interface DetectionResultProps {
  detection: Detection;
}

export const DetectionResult: React.FC<DetectionResultProps> = ({ detection }) => {
  
  const getSeverityBadge = (severity?: Severity) => {
    switch (severity) {
      case Severity.MILD: return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none">Mild</Badge>;
      case Severity.MODERATE: return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-none">Moderate</Badge>;
      case Severity.SEVERE: return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-none">Severe</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // KPI Card Component
  const MetricCard = ({ label, value, icon: Icon, colorClass, bgClass }: any) => (
    <Card className="border-none shadow-sm bg-white rounded-[20px] overflow-hidden">
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
          <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${bgClass}`}>
          <Icon className={`h-6 w-6 ${colorClass}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard 
          label="Teeth Detected" 
          value={detection.total_teeth_detected} 
          icon={Layers} 
          colorClass="text-blue-600" 
          bgClass="bg-blue-50" 
        />
        <MetricCard 
          label="Caries Found" 
          value={detection.total_caries_detected} 
          icon={AlertTriangle} 
          colorClass="text-red-600" 
          bgClass="bg-red-50" 
        />
        <MetricCard 
          label="Confidence" 
          value={`${(detection.confidence_threshold * 100).toFixed(0)}%`} 
          icon={Target} 
          colorClass="text-emerald-600" 
          bgClass="bg-emerald-50" 
        />
        <MetricCard 
          label="Process Time" 
          value={`${(detection.processing_time_ms / 1000).toFixed(2)}s`} 
          icon={Clock} 
          colorClass="text-purple-600" 
          bgClass="bg-purple-50" 
        />
      </div>

      {/* Findings Table */}
      <Card className="border-none shadow-sm bg-white rounded-[20px] overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h3 className="font-bold text-slate-800">Detailed Findings</h3>
        </div>
        <div className="overflow-x-auto">
          {(!detection.caries_findings || detection.caries_findings.length === 0) ? (
            <div className="p-8 text-center text-slate-500">No caries detected.</div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="font-semibold text-xs uppercase text-slate-400 pl-6">Tooth</TableHead>
                  <TableHead className="font-semibold text-xs uppercase text-slate-400">Severity</TableHead>
                  <TableHead className="font-semibold text-xs uppercase text-slate-400">Certainty</TableHead>
                  <TableHead className="font-semibold text-xs uppercase text-slate-400 pr-6">Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detection.caries_findings.map((finding) => (
                  <TableRow key={finding.id} className="border-gray-50 hover:bg-blue-50/30">
                    <TableCell className="font-bold text-slate-700 pl-6">#{finding.tooth_number || '?'}</TableCell>
                    <TableCell>{getSeverityBadge(finding.severity)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${finding.confidence_score * 100}%` }}></div>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{(finding.confidence_score * 100).toFixed(0)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm pr-6">{finding.location || 'General'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
};