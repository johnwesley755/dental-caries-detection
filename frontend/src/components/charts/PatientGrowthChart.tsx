// frontend/src/components/charts/PatientGrowthChart.tsx

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsService, type PatientGrowth } from '../../services/analyticsService';
import { format } from 'date-fns';
import { TrendingUp } from 'lucide-react';

export const PatientGrowthChart: React.FC = () => {
  const [data, setData] = useState<PatientGrowth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const growth = await analyticsService.getPatientGrowth(90);
      setData(growth);
    } catch (error) {
      console.error('Failed to load patient growth:', error);
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

  const totalNewPatients = data.reduce((sum, item) => sum + item.count, 0);
  const avgPerDay = data.length > 0 ? (totalNewPatients / data.length).toFixed(1) : '0';

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Patient Growth</h3>
          <p className="text-sm text-gray-500">New patient registrations (Last 90 days)</p>
        </div>
        <div className="flex items-center gap-2 text-green-600">
          <TrendingUp className="h-5 w-5" />
          <span className="text-sm font-medium">Growing</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium mb-1">Total New Patients</p>
          <p className="text-3xl font-bold text-blue-900">{totalNewPatients}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-purple-600 font-medium mb-1">Average Per Day</p>
          <p className="text-3xl font-bold text-purple-900">{avgPerDay}</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
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
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPatients)"
            name="New Patients"
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No patient growth data available</p>
        </div>
      )}
    </div>
  );
};
