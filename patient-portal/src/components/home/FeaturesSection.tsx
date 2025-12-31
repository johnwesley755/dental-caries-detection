// patient-portal/src/components/home/FeaturesSection.tsx
import React from 'react';
import { Activity, Shield, Clock, Heart, type LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
}

const features: Feature[] = [
  {
    icon: Activity,
    title: 'Easy Access',
    description: 'View your dental scans and results anytime, anywhere',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your health data is encrypted and protected',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    icon: Clock,
    title: 'Track Progress',
    description: 'Monitor your dental health over time',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    icon: Heart,
    title: 'Better Care',
    description: 'Stay informed about your oral health',
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600'
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Use Our Portal?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className={`h-16 w-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
