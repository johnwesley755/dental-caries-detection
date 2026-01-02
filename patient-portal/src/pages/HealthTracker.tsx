// patient-portal/src/pages/HealthTracker.tsx
import React from 'react';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { HealthScoreChart } from '../components/charts/HealthScoreChart';
import { DetectionHistoryChart } from '../components/charts/DetectionHistoryChart';

export const HealthTracker: React.FC = () => {
  // Mock health data
  const healthMetrics = [
    {
      label: 'Oral Health Score',
      value: 85,
      change: '+5',
      trend: 'up' as const,
      color: 'blue'
    },
    {
      label: 'Last Checkup',
      value: '15 days ago',
      change: 'On track',
      trend: 'stable' as const,
      color: 'green'
    },
    {
      label: 'Caries Detected',
      value: 2,
      change: '-1',
      trend: 'down' as const,
      color: 'orange'
    }
  ];

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />;
      case 'down':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Tracker</h1>
        <p className="text-gray-600">Monitor your oral health progress over time</p>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
        {healthMetrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">{metric.label}</span>
              <div className={`p-2 rounded-lg ${getTrendColor(metric.trend)}`}>
                {getTrendIcon(metric.trend)}
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">{metric.value}</h3>
                <p className={`text-sm mt-1 ${getTrendColor(metric.trend)}`}>
                  {metric.change}
                </p>
              </div>
            </div>
          </div>
        ))}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Health Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Brush your teeth twice daily for 2 minutes</li>
              <li>• Floss at least once a day</li>
              <li>• Schedule regular dental checkups every 6 months</li>
              <li>• Limit sugary foods and drinks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
