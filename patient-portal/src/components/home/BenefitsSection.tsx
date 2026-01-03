// patient-portal/src/components/home/BenefitsSection.tsx
import React from 'react';
import { Shield, Clock, TrendingUp, Heart } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: Shield,
      title: 'Early Detection',
      description: 'Catch dental issues before they become serious problems with AI-powered analysis',
      color: 'blue'
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Quick and accurate results mean less time in the dental chair',
      color: 'green'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your oral health over time with detailed history and insights',
      color: 'purple'
    },
    {
      icon: Heart,
      title: 'Better Care',
      description: 'Receive personalized treatment recommendations based on your unique needs',
      color: 'pink'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      pink: 'bg-pink-100 text-pink-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the future of dental care with AI-powered detection and personalized insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="text-center group"
              >
                <div className={`w-16 h-16 rounded-2xl ${getColorClasses(benefit.color)} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
