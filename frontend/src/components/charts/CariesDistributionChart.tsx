// frontend/src/components/charts/CariesDistributionChart.tsx

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { analyticsService, type CariesDistribution } from '../../services/analyticsService';

const COLORS = {
  mild: '#10b981',
  moderate: '#f59e0b',
  severe: '#ef4444',
};

const SEVERITY_LABELS = {
  mild: 'Mild (1-2 caries)',
  moderate: 'Moderate (3-5 caries)',
  severe: 'Severe (6+ caries)',
};

export const CariesDistributionChart: React.FC = () => {
  const [data, setData] = useState<CariesDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const distribution = await analyticsService.getCariesDistribution();
      setData(distribution);
    } catch (error) {
      console.error('Failed to load caries distribution:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ fontSize: '14px', fontWeight: 'bold' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Caries Distribution</h3>
        <p className="text-sm text-gray-500">Breakdown by severity level</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={110}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.severity as keyof typeof COLORS] || '#6b7280'} 
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number, name: string, props: any) => [
              value,
              SEVERITY_LABELS[props.payload.severity as keyof typeof SEVERITY_LABELS] || props.payload.severity
            ]}
            contentStyle={{ 
              borderRadius: '8px', 
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            formatter={(value, entry: any) => SEVERITY_LABELS[entry.payload.severity as keyof typeof SEVERITY_LABELS] || value}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-6 text-center">
        <p className="text-3xl font-bold text-gray-900">{total}</p>
        <p className="text-sm text-gray-500">Total Detections</p>
      </div>
      
      {/* Legend with counts */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {data.map((item) => (
          <div key={item.severity} className="text-center">
            <div 
              className="w-4 h-4 rounded-full mx-auto mb-1" 
              style={{ backgroundColor: COLORS[item.severity as keyof typeof COLORS] }}
            ></div>
            <p className="text-xs text-gray-600 capitalize">{item.severity}</p>
            <p className="text-lg font-bold text-gray-900">{item.count}</p>
          </div>
        ))}
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No caries data available</p>
        </div>
      )}
    </div>
  );
};
