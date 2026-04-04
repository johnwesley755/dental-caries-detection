// patient-portal/src/pages/HealthTracker.tsx
import React, { useEffect, useState } from 'react';
import { Activity, TrendingUp, TrendingDown, Minus, Sparkles, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';
import { HealthScoreChart } from '../components/charts/HealthScoreChart';
import { DetectionHistoryChart } from '../components/charts/DetectionHistoryChart';
import { analyticsService } from '../services/analyticsService';
import { toast } from 'sonner';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const HealthTracker: React.FC = () => {
  const [healthScore, setHealthScore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getMyHealthScore();
      setHealthScore(data);
    } catch (error) {
      console.error('Failed to load health data:', error);
      toast.error('Failed to load health data');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'declining':
        return 'text-red-600 bg-red-50 border-red-100';
      default:
        return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-primary';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50">
        <LoadingSpinner size="md" text="Analyzing health metrics..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 p-4 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
             <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary shadow-inner">
                   <Activity className="h-5 w-5" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Health Analytics</h1>
             </div>
             <p className="text-slate-500 font-bold tracking-tight">Real-time longitudinal tracking of your oral wellness</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Engine Active</span>
          </div>
        </div>

        {/* Health Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Oral Health Score Card */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 p-8 border border-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <Heart className="h-24 w-24 text-primary" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Score</p>
                {healthScore && (
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${getTrendColor(healthScore.trend)}`}>
                    {getTrendIcon(healthScore.trend)}
                    {healthScore.trend}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h3 className={`text-6xl font-black tracking-tighter ${healthScore ? getScoreColor(healthScore.score) : 'text-slate-900'}`}>
                  {healthScore?.score || 0}
                </h3>
                <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
                  System Audit Complete <Sparkles className="h-3 w-3 text-primary" />
                </p>
              </div>
            </div>
          </div>

          {/* Status Insight Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-primary to-blue-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-primary/20 relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute inset-0 bg-white/10 pattern-grid-lg opacity-10" />
            <div className="relative z-10 flex items-start justify-between">
               <div className="space-y-4">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/20">
                        <ShieldCheck className="h-7 w-7 text-white" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">Health Insight</p>
                        <h3 className="text-2xl font-black tracking-tight uppercase">
                          {healthScore?.score >= 80 ? 'Excellent' : 
                           healthScore?.score >= 60 ? 'Stabile' : 
                           healthScore?.score >= 40 ? 'Observation' : 'High Priority'}
                        </h3>
                     </div>
                  </div>
                  <p className="text-blue-100 font-bold max-w-md leading-relaxed text-sm">
                    {healthScore?.score >= 80 ? 'Your oral microbiome and enamel thickness are within optimal clinical ranges. Continue current hygiene protocol.' :
                     healthScore?.score >= 60 ? 'Baseline established. Minor variations detected but no significant pathology noted. Maintain biannual appointments.' :
                     healthScore?.score >= 40 ? 'Moderate risk profile identified. We recommend increasing flossing frequency and scheduling a professional cleaning.' :
                     'Our AI indicates significant diagnostic markers requiring immediate clinical review. Please book an urgent consultation.'}
                  </p>
               </div>
               <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:bg-white group-hover:text-primary transition-all">
                  <ArrowUpRight className="h-6 w-6" />
               </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 p-8 border border-white/50">
              <div className="mb-6 flex items-center justify-between">
                 <div>
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Oral Health Trend</h4>
                    <p className="text-xs text-slate-400 font-bold">12-month longitudinal audit</p>
                 </div>
                 <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                    <Activity className="h-4 w-4" />
                 </div>
              </div>
              <HealthScoreChart />
           </div>
           <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 p-8 border border-white/50">
              <div className="mb-6 flex items-center justify-between">
                 <div>
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Diagnostic History</h4>
                    <p className="text-xs text-slate-400 font-bold">Total caries detected vs reviewed</p>
                 </div>
                 <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <Sparkles className="h-4 w-4" />
                 </div>
              </div>
              <DetectionHistoryChart />
           </div>
        </div>

        {/* Clinical Recommendations */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-blue-900/5 border border-white relative overflow-hidden">
          <div className="absolute bottom-0 right-0 p-10 opacity-5">
             <Activity className="h-32 w-32 text-primary" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row gap-10">
            <div className="md:w-1/3 space-y-4">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Clinical Protocol</h3>
              <p className="text-sm font-bold text-slate-400 leading-relaxed">
                Personalized health guidelines generated by our Clinical AI based on your historical scan data and current trend profile.
              </p>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {[
                "Dual-phase brushing (2min morning & night)",
                "Interdental cleaning using nylon floss",
                "Regular biannual prophylaxis visits",
                "Controlled dietary sugar intake (<25g/day)",
                "Systemic hydration maintenance (2.5L daily)",
                "Toothbrush head replacement (tri-monthly)"
              ].map((tip, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-default">
                  <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] font-black text-primary transition-all group-hover:bg-primary group-hover:text-white shadow-inner">
                    0{i+1}
                  </div>
                  <span className="text-sm font-bold text-slate-600 tracking-tight group-hover:text-slate-900 transition-colors">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
