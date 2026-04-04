// patient-portal/src/components/charts/HealthScoreChart.tsx

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { analyticsService, type HealthHistory } from '../../services/analyticsService';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Minus, Activity, Sparkles } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

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
      <div className="h-[300px] flex items-center justify-center">
        <LoadingSpinner size="sm" text="Syncing metrics..." />
      </div>
    );
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-5 w-5 text-emerald-500" />;
      case 'declining':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <Minus className="h-5 w-5 text-slate-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'improving':
        return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'declining':
        return 'text-red-500 bg-red-50 border-red-100';
      default:
        return 'text-slate-400 bg-slate-50 border-slate-100';
    }
  };

  const getScoreColor = () => {
    if (currentScore >= 80) return 'text-emerald-500';
    if (currentScore >= 60) return 'text-primary';
    return 'text-red-500';
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl shadow-blue-900/5 border border-white/50 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Activity className="h-4 w-4 text-primary" />
             <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Health Trajectory</h3>
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Clinical Wellness Longitudinal Audit</p>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <div className="flex items-baseline gap-1">
            <span className={`text-4xl font-black tracking-tighter ${getScoreColor()}`}>{currentScore}</span>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Index</span>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{trend}</span>
          </div>
        </div>
      </div>
      
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => format(new Date(date), 'MMM dd')}
              stroke="#cbd5e1"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' }}
            />
            <YAxis 
              domain={[0, 100]} 
              stroke="#cbd5e1" 
              axisLine={false}
              tickLine={false}
              style={{ fontSize: '10px', fontWeight: '800' }} 
            />
            <Tooltip 
              cursor={{ stroke: '#1e3a8a', strokeWidth: 1, strokeDasharray: '4 4' }}
              labelFormatter={(date) => format(new Date(date), 'MMMM dd, yyyy')}
              contentStyle={{ 
                borderRadius: '1.25rem', 
                border: 'none',
                boxShadow: '0 25px 50px -12px rgba(30, 58, 138, 0.25)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                padding: '12px 16px'
              }}
              itemStyle={{ 
                fontSize: '10px', 
                fontWeight: '900', 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em',
                color: '#1e3a8a'
              }}
              labelStyle={{
                fontSize: '9px',
                fontWeight: '700',
                color: '#94a3b8',
                marginBottom: '4px',
                textTransform: 'uppercase'
              }}
            />
            <ReferenceLine y={70} stroke="#cbd5e1" strokeDasharray="3 3" label={{ value: 'OPTIMAL', fill: '#94a3b8', fontSize: 8, fontWeight: 900, position: 'right' }} />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#1e3a8a" 
              strokeWidth={4}
              dot={{ fill: '#1e3a8a', r: 4, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#1e3a8a' }}
              name="Index"
              animationDuration={2000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-all duration-500">
        <div className="flex items-start gap-3">
          <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
            <strong className="text-primary font-black">Clinical Protocol:</strong> Maintain a trajectory above index 70 for optimal diagnostic stability. Variations detected in the past 30 days are being analyzed by the AI engine.
          </p>
        </div>
      </div>
      
      {data.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] z-20">
          <Activity className="h-12 w-12 text-slate-200 mb-4 animate-pulse" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Insufficient Clinical Data</p>
        </div>
      )}
    </div>
  );
};
