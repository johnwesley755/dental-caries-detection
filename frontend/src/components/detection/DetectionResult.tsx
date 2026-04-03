// frontend/src/components/detection/DetectionResult.tsx
import React from 'react';
import { Target, AlertTriangle, Clock, Layers, type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Severity } from '../../types/detection.types';
import type { Detection } from '../../types/detection.types';

interface DetectionResultProps {
  detection: Detection;
}

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

// KPI Card Component defined outside to prevent re-creation during render
const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon: Icon, colorClass, bgClass }) => (
  <Card className="border-none shadow-xl shadow-slate-100/50 bg-white rounded-3xl overflow-hidden group hover:shadow-primary/5 transition-all">
    <CardContent className="p-5 flex items-center justify-between">
      <div className="text-left">
        <p className="text-xs font-black text-slate-400 mb-1">{label}</p>
        <p className={`text-2xl font-headline font-black ${colorClass}`}>{value}</p>
      </div>
      <div className={`p-3 rounded-2xl ${bgClass} group-hover:scale-110 transition-transform`}>
        <Icon className={`h-6 w-6 ${colorClass}`} />
      </div>
    </CardContent>
  </Card>
);

export const DetectionResult: React.FC<DetectionResultProps> = ({ detection }) => {
  
  const getSeverityBadge = (severity?: Severity) => {
    switch (severity) {
      case Severity.MILD: return <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none px-2 py-0.5 rounded-lg font-black text-[10px]">Mild</Badge>;
      case Severity.MODERATE: return <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-2 py-0.5 rounded-lg font-black text-[10px]">Moderate</Badge>;
      case Severity.SEVERE: return <Badge className="bg-red-50 text-red-700 hover:bg-red-100 border-none px-2 py-0.5 rounded-lg font-black text-[10px]">Severe</Badge>;
      default: return <Badge variant="outline" className="text-[10px] font-black">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <MetricCard 
          label="Neural Markers" 
          value={detection.total_teeth_detected} 
          icon={Layers} 
          colorClass="text-primary" 
          bgClass="bg-primary/5" 
        />
        <MetricCard 
          label="Caries Index" 
          value={detection.total_caries_detected} 
          icon={AlertTriangle} 
          colorClass="text-red-500" 
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
          label="Inference" 
          value={`${(detection.processing_time_ms / 1000).toFixed(2)}s`} 
          icon={Clock} 
          colorClass="text-blue-700" 
          bgClass="bg-blue-50" 
        />
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-3xl overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-50 flex items-center justify-between bg-white">
          <h3 className="text-xs font-headline font-black text-blue-900">Neural Localization</h3>
          <Badge className="bg-slate-50 text-slate-400 border-none font-black text-[11px]">
            {detection.caries_findings?.length || 0} Entities
          </Badge>
        </div>
        <div className="overflow-x-auto">
          {(!detection.caries_findings || detection.caries_findings.length === 0) ? (
            <div className="p-12 text-center text-slate-400 text-xs font-bold leading-relaxed">No anomalies identified in this batch.</div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="font-black text-[11px] text-slate-400 pl-8">Target</TableHead>
                  <TableHead className="font-black text-[11px] text-slate-400">Severity</TableHead>
                  <TableHead className="font-black text-[11px] text-slate-400">Neural Prob</TableHead>
                  <TableHead className="font-black text-[11px] text-slate-400 pr-8 text-right">Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detection.caries_findings.map((finding, index) => (
                  <TableRow key={finding.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-headline font-black text-blue-900 pl-8 text-sm">Finding {index + 1}</TableCell>
                    <TableCell>{getSeverityBadge(finding.severity)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${finding.confidence_score * 100}%` }}></div>
                        </div>
                        <span className="text-[10px] text-slate-500 font-black">{(finding.confidence_score * 100).toFixed(0)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs font-black tracking-tight pr-8 text-right underline decoration-primary/20 underline-offset-4">{finding.location || 'General'}</TableCell>
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