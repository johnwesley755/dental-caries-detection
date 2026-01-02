// patient-portal/src/components/charts/DetectionHistoryChart.tsx

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { analyticsService, type DetectionHistory } from '../../services/analyticsService';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const DetectionHistoryChart: React.FC = () => {
  const [data, setData] = useState<DetectionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const history = await analyticsService.getMyDetectionHistory();
      setData(history);
    } catch (error) {
      console.error('Failed to load detection history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-[450px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getBarColor = (count: number) => {
    if (count === 0) return '#10b981'; // green
    if (count <= 2) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  const totalCaries = data.reduce((sum, item) => sum + item.caries_count, 0);
  const avgCaries = data.length > 0 ? (totalCaries / data.length).toFixed(1) : '0';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">Detection History</h3>
        <p className="text-sm text-slate-500">Caries detected per visit</p>
      </div>
      
      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-sm text-orange-600 font-medium mb-1">Total Caries</p>
          <p className="text-3xl font-bold text-orange-900">{totalCaries}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-purple-600 font-medium mb-1">Average Per Visit</p>
          <p className="text-3xl font-bold text-purple-900">{avgCaries}</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(new Date(date), 'MMM dd')}
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
          />
          <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
          <Tooltip 
            labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
            contentStyle={{ 
              borderRadius: '12px', 
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
          />
          <Bar 
            dataKey="caries_count" 
            name="Caries Detected" 
            radius={[8, 8, 0, 0]}
            onClick={(data) => navigate(`/detection/${data.detection_id}`)}
            style={{ cursor: 'pointer' }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.caries_count)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="w-4 h-4 bg-green-500 rounded mx-auto mb-1"></div>
          <p className="text-xs text-slate-600 font-medium">Healthy</p>
          <p className="text-xs text-slate-500">0 caries</p>
        </div>
        <div className="text-center">
          <div className="w-4 h-4 bg-orange-500 rounded mx-auto mb-1"></div>
          <p className="text-xs text-slate-600 font-medium">Mild</p>
          <p className="text-xs text-slate-500">1-2 caries</p>
        </div>
        <div className="text-center">
          <div className="w-4 h-4 bg-red-500 rounded mx-auto mb-1"></div>
          <p className="text-xs text-slate-600 font-medium">Severe</p>
          <p className="text-xs text-slate-500">3+ caries</p>
        </div>
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <p>No detection history available yet</p>
          <p className="text-xs mt-2">Visit your dentist for a checkup to start tracking</p>
        </div>
      )}
    </div>
  );
};
