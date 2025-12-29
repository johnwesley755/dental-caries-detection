// frontend/src/components/detection/SeverityChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { Detection } from '../../types/detection.types';
import { Severity } from '../../types/detection.types';

interface SeverityChartProps {
  detection: Detection;
}

export const SeverityChart: React.FC<SeverityChartProps> = ({ detection }) => {
  // Count severity levels
  const severityCounts = {
    [Severity.MILD]: 0,
    [Severity.MODERATE]: 0,
    [Severity.SEVERE]: 0,
  };

  detection.caries_findings?.forEach((finding) => {
    if (finding.severity) {
      severityCounts[finding.severity]++;
    }
  });

  // Prepare data for chart
  const chartData = [
    {
      name: 'Mild',
      value: severityCounts[Severity.MILD],
      color: '#FCD34D', // yellow-300
    },
    {
      name: 'Moderate',
      value: severityCounts[Severity.MODERATE],
      color: '#FB923C', // orange-400
    },
    {
      name: 'Severe',
      value: severityCounts[Severity.SEVERE],
      color: '#EF4444', // red-500
    },
  ].filter((item) => item.value > 0); // Only show non-zero values

  const totalFindings = chartData.reduce((sum, item) => sum + item.value, 0);

  // Custom label for pie chart
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (totalFindings === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Severity Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No caries findings to display
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Severity Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Pie Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value} finding(s)`, 'Count']}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry: any) => {
                  const item = chartData.find((d) => d.name === value);
                  return `${value}: ${item?.value || 0}`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Summary Statistics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div
                className="w-4 h-4 rounded-full mx-auto mb-2"
                style={{ backgroundColor: '#FCD34D' }}
              />
              <p className="text-2xl font-bold text-yellow-600">
                {severityCounts[Severity.MILD]}
              </p>
              <p className="text-sm text-gray-600">Mild</p>
            </div>
            <div className="text-center">
              <div
                className="w-4 h-4 rounded-full mx-auto mb-2"
                style={{ backgroundColor: '#FB923C' }}
              />
              <p className="text-2xl font-bold text-orange-600">
                {severityCounts[Severity.MODERATE]}
              </p>
              <p className="text-sm text-gray-600">Moderate</p>
            </div>
            <div className="text-center">
              <div
                className="w-4 h-4 rounded-full mx-auto mb-2"
                style={{ backgroundColor: '#EF4444' }}
              />
              <p className="text-2xl font-bold text-red-600">
                {severityCounts[Severity.SEVERE]}
              </p>
              <p className="text-sm text-gray-600">Severe</p>
            </div>
          </div>

          {/* Total Count */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600">Total Caries Findings</p>
            <p className="text-3xl font-bold text-gray-900">{totalFindings}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
