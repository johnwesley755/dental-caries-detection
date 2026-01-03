// frontend/src/components/home/ObjectivesSection.tsx
import React from 'react';
import { Target, Zap, Shield, TrendingUp } from 'lucide-react';

export const ObjectivesSection: React.FC = () => {
  const objectives = [
    {
      icon: Target,
      title: 'Automated Detection',
      description: 'Develop an AI model capable of automatically detecting dental caries from radiographic images with high accuracy',
      color: 'blue'
    },
    {
      icon: Zap,
      title: 'Real-time Analysis',
      description: 'Provide instant analysis and results to reduce diagnosis time and improve clinical workflow efficiency',
      color: 'green'
    },
    {
      icon: Shield,
      title: 'Severity Classification',
      description: 'Classify detected caries by severity levels to assist in treatment planning and prioritization',
      color: 'purple'
    },
    {
      icon: TrendingUp,
      title: 'Patient Management',
      description: 'Create a comprehensive system for tracking patient history, detections, and treatment progress',
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Project Objectives
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Key goals and aims of this research project
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {objectives.map((objective, index) => {
            const Icon = objective.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className={`w-14 h-14 rounded-xl ${getColorClasses(objective.color)} flex items-center justify-center mb-4`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{objective.title}</h3>
                <p className="text-gray-600 leading-relaxed">{objective.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
