// patient-portal/src/components/charts/HealthScoreChart.tsx

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { analyticsService, type HealthHistory } from '../../services/analyticsService';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const HealthScoreChart: React.FC = () => {
  const [data, setData] = useState<HealthHistory[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [trend, setTrend] = useState<'improving' | 'declining' | 'stable'>('stable');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [scoreData, history] = await Promise.all([
        analyticsService.getMyHealthScore(),
        analyticsService.getMyHealthHistory(180),
      ]);
      
      setCurrentScore(scoreData.score);
      setTrend(scoreData.trend);
      setData(history);
    } catch (error) {
      console.error('Failed to load health score:', error);
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

  const getTrendIcon = () => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'declining':
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      default:
        return <Minus className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'improving':
        return 'text-green-600';
      case 'declining':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getScoreColor = () => {
    if (currentScore >= 80) return 'text-green-600';
    if (currentScore >= 60) return 'text-blue-600';
    if (currentScore >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Oral Health Score</h3>
          <p className="text-sm text-slate-500">Your health trend over time</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className={`text-4xl font-bold ${getScoreColor()}`}>{currentScore}</span>
            <span className="text-sm text-slate-500">/100</span>
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="capitalize">{trend}</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(new Date(date), 'MMM dd')}
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
          />
          <YAxis domain={[0, 100]} stroke="#94a3b8" style={{ fontSize: '12px' }} />
          <Tooltip 
            labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
            contentStyle={{ 
              borderRadius: '12px', 
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <ReferenceLine y={70} stroke="#f59e0b" strokeDasharray="3 3" label="Target" />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 5 }}
            activeDot={{ r: 7 }}
            name="Health Score"
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>💡 Tip:</strong> Maintain a score above 70 for optimal oral health. Regular checkups help improve your score!
        </p>
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <p>No health score history available yet</p>
          <p className="text-xs mt-2">Your score will be calculated after your first detection</p>
        </div>
      )}
    </div>
  );
};
