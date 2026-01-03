// frontend/src/components/home/StatisticsSection.tsx
import React from 'react';
import { Users, Activity, TrendingUp, Award } from 'lucide-react';

export const StatisticsSection: React.FC = () => {
  const stats = [
    {
      icon: Users,
      value: '10,000+',
      label: 'Patients Served',
      color: 'blue'
    },
    {
      icon: Activity,
      value: '50,000+',
      label: 'Detections Completed',
      color: 'green'
    },
    {
      icon: TrendingUp,
      value: '98%',
      label: 'Accuracy Rate',
      color: 'purple'
    },
    {
      icon: Award,
      value: '500+',
      label: 'Dental Professionals',
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Dental Professionals Worldwide
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform is helping dentists provide better care and early detection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className={`w-14 h-14 rounded-xl ${getColorClasses(stat.color)} flex items-center justify-center mb-4`}>
                  <Icon className="h-7 w-7" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
