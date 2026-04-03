// frontend/src/components/detection/SeverityChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { Detection } from '../../types/detection.types';
import { Severity } from '../../types/detection.types';
import { Badge } from '../ui/badge';

interface SeverityChartProps {
  detection: Detection;
}

export const SeverityChart: React.FC<SeverityChartProps> = ({ detection }) => {
  const severityCounts = { [Severity.MILD]: 0, [Severity.MODERATE]: 0, [Severity.SEVERE]: 0 };

  detection.caries_findings?.forEach((finding) => {
    if (finding.severity) severityCounts[finding.severity]++;
  });

  const chartData = [
    { name: 'Mild', value: severityCounts[Severity.MILD], color: '#3b82f6' }, // Blue 500
    { name: 'Moderate', value: severityCounts[Severity.MODERATE], color: '#6366f1' }, // Indigo 500
    { name: 'Severe', value: severityCounts[Severity.SEVERE], color: '#ef4444' }, // Red 500
  ].filter((item) => item.value > 0);

  const totalFindings = chartData.reduce((sum, item) => sum + item.value, 0);

  if (totalFindings === 0) {
    return (
      <Card className="border-none shadow-xl shadow-slate-100/50 bg-white rounded-3xl h-full flex flex-col justify-center items-center p-12 text-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl text-emerald-500">✓</span>
        </div>
        <div className="space-y-1">
            <h3 className="text-sm font-headline font-black text-blue-900 uppercase tracking-widest">Normal View</h3>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-tighter">No neural markers detected</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-xl shadow-slate-100/50 bg-white rounded-3xl overflow-hidden">
      <CardHeader className="border-b border-slate-50 p-6 sm:p-8">
        <CardTitle className="text-[10px] font-headline font-black text-blue-900 uppercase tracking-widest">Severity Spectrum</CardTitle>
      </CardHeader>
      <CardContent className="p-6 sm:p-8">
        <div className="h-[220px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Centered Total */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl font-headline font-black text-blue-900 leading-none">{totalFindings}</span>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Markers</span>
          </div>
        </div>

        {/* Custom Legend */}
        <div className="grid grid-cols-3 gap-3 mt-8">
            {chartData.map((item) => (
                <div key={item.name} className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100">
                    <div className="w-2 h-2 rounded-full mb-3" style={{ backgroundColor: item.color }}></div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.name}</span>
                    <Badge variant="outline" className="font-headline font-black text-blue-900 border-none bg-white shadow-sm text-xs">
                        {item.value}
                    </Badge>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};