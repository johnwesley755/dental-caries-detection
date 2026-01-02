// patient-portal/src/pages/HealthTracker.tsx
import React, { useEffect, useState } from 'react';
import { Activity, TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';
import { HealthScoreChart } from '../components/charts/HealthScoreChart';
import { DetectionHistoryChart } from '../components/charts/DetectionHistoryChart';
import { analyticsService } from '../services/analyticsService';
import { toast } from 'sonner';

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
        return 'text-green-600 bg-green-50';
      case 'declining':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Tracker</h1>
        <p className="text-gray-600">Monitor your oral health progress over time</p>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-8">
        {/* Oral Health Score */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Oral Health Score</span>
            {healthScore && (
              <div className={`p-2 rounded-lg ${getTrendColor(healthScore.trend)}`}>
                {getTrendIcon(healthScore.trend)}
              </div>
            )}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className={`text-4xl font-bold ${healthScore ? getScoreColor(healthScore.score) : 'text-gray-900'}`}>
                {healthScore?.score || 0}
              </h3>
              <p className={`text-sm mt-1 ${healthScore ? getTrendColor(healthScore.trend) : 'text-gray-500'}`}>
                {healthScore?.trend || 'No data'}
              </p>
            </div>
          </div>
        </div>

        {/* Health Status */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Health Status</p>
              <h3 className="text-xl font-bold">
                {healthScore?.score >= 80 ? 'Excellent' : 
                 healthScore?.score >= 60 ? 'Good' : 
                 healthScore?.score >= 40 ? 'Fair' : 'Needs Attention'}
              </h3>
            </div>
          </div>
          <p className="text-sm opacity-90">
            {healthScore?.score >= 80 ? 'Keep up the great work!' :
             healthScore?.score >= 60 ? 'You\'re doing well. Keep it up!' :
             healthScore?.score >= 40 ? 'Consider scheduling a checkup soon.' :
             'Please schedule a dental checkup.'}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HealthScoreChart />
        <DetectionHistoryChart />
      </div>

      {/* Health Tips */}
      <div className="mt-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Daily Health Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Brush your teeth twice daily for 2 minutes</li>
              <li>• Floss at least once a day to remove plaque between teeth</li>
              <li>• Schedule regular dental checkups every 6 months</li>
              <li>• Limit sugary foods and drinks to protect your enamel</li>
              <li>• Drink plenty of water throughout the day</li>
              <li>• Replace your toothbrush every 3-4 months</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
