// frontend/src/components/charts/DetectionTrendsChart.tsx

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { analyticsService, type DetectionTrend } from '../../services/analyticsService';
import { format } from 'date-fns';

export const DetectionTrendsChart: React.FC = () => {
  const [data, setData] = useState<DetectionTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    loadData();
  }, [days]);

  const loadData = async () => {
    setLoading(true);
    try {
      const trends = await analyticsService.getDetectionTrends(days);
      setData(trends);
    } catch (error) {
      console.error('Failed to load detection trends:', error);
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

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Detection Trends</h3>
          <p className="text-sm text-gray-500">Daily detection volume over time</p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(new Date(date), 'MMM dd')}
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <Tooltip 
            labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
            contentStyle={{ 
              borderRadius: '8px', 
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 5 }}
            activeDot={{ r: 7 }}
            name="Detections"
          />
        </LineChart>
      </ResponsiveContainer>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No detection data available for this period</p>
        </div>
      )}
    </div>
  );
};
