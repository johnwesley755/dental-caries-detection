// frontend/src/components/detection/SeverityChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { Detection } from '../../types/detection.types';
import { Severity } from '../../types/detection.types';

interface SeverityChartProps {
  detection: Detection;
}

export const SeverityChart: React.FC<SeverityChartProps> = ({ detection }) => {
  const severityCounts = { [Severity.MILD]: 0, [Severity.MODERATE]: 0, [Severity.SEVERE]: 0 };

  detection.caries_findings?.forEach((finding) => {
    if (finding.severity) severityCounts[finding.severity]++;
  });

  const chartData = [
    { name: 'Mild', value: severityCounts[Severity.MILD], color: '#FCD34D' }, // Yellow
    { name: 'Moderate', value: severityCounts[Severity.MODERATE], color: '#FB923C' }, // Orange
    { name: 'Severe', value: severityCounts[Severity.SEVERE], color: '#EF4444' }, // Red
  ].filter((item) => item.value > 0);

  const totalFindings = chartData.reduce((sum, item) => sum + item.value, 0);

  if (totalFindings === 0) {
    return (
      <Card className="border-none shadow-sm bg-white rounded-[20px] h-full flex flex-col justify-center items-center p-8">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
            <span className="text-2xl text-slate-300">✓</span>
        </div>
        <p className="text-slate-400 font-medium">No severity data available</p>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm bg-white rounded-[20px] overflow-hidden">
      <CardHeader className="border-b border-gray-50 pb-4">
        <CardTitle className="text-lg font-bold text-slate-800">Severity Distribution</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[200px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} cornerRadius={4} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Centered Total */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-slate-800">{totalFindings}</span>
            <span className="text-xs text-slate-400 font-medium uppercase">Issues</span>
          </div>
        </div>

        {/* Custom Legend */}
        <div className="grid grid-cols-3 gap-2 mt-4">
            {chartData.map((item) => (
                <div key={item.name} className="flex flex-col items-center p-2 rounded-xl bg-slate-50">
                    <div className="w-2 h-2 rounded-full mb-1" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs text-slate-500">{item.name}</span>
                    <span className="font-bold text-slate-800">{item.value}</span>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};