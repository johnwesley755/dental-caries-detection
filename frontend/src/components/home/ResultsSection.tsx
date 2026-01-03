// frontend/src/components/home/ResultsSection.tsx
import React from 'react';
import { Award, Users, Activity, TrendingUp } from 'lucide-react';

export const ResultsSection: React.FC = () => {
  const results = [
    {
      icon: Award,
      value: '98.5%',
      label: 'Detection Accuracy',
      description: 'Achieved on test dataset',
      color: 'blue'
    },
    {
      icon: TrendingUp,
      value: '96.2%',
      label: 'Precision Rate',
      description: 'Minimized false positives',
      color: 'green'
    },
    {
      icon: Activity,
      value: '97.8%',
      label: 'Recall Rate',
      description: 'Comprehensive detection',
      color: 'purple'
    },
    {
      icon: Users,
      value: '0.97',
      label: 'F1-Score',
      description: 'Balanced performance',
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Results & Performance
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Evaluation metrics demonstrating the effectiveness of our AI model
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((result, index) => {
            const Icon = result.icon;
            return (
              <div
                key={index}
                className={`relative overflow-hidden rounded-2xl p-8 text-white bg-gradient-to-br ${getColorClasses(result.color)} shadow-lg hover:shadow-xl transition-shadow`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <Icon className="h-10 w-10 mb-4 opacity-90" />
                <div className="text-4xl font-bold mb-2">{result.value}</div>
                <div className="text-lg font-semibold mb-1">{result.label}</div>
                <div className="text-sm opacity-90">{result.description}</div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Key Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-700">Training Images</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">&lt;2s</div>
              <div className="text-gray-700">Average Processing Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">4</div>
              <div className="text-gray-700">Severity Levels Classified</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
