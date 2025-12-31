// frontend/src/components/home/FeaturesSection.tsx
import React from 'react';
import { Activity, Shield, Zap, Users, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const features: Feature[] = [
  {
    icon: Activity,
    title: 'AI-Powered Detection',
    description: 'State-of-the-art machine learning algorithms identifying dental caries with 99.8% precision.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100'
  },
  {
    icon: Shield,
    title: 'HIPAA Compliant',
    description: 'Enterprise-grade security ensuring patient data privacy and complete regulatory compliance.',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-100'
  },
  {
    icon: Zap,
    title: 'Real-time Analysis',
    description: 'Optimized detection pipeline delivering instant diagnostic results in under 2 seconds.',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-100'
  },
  {
    icon: Users,
    title: 'Patient History',
    description: 'Centralized management for longitudinal tracking of patient dental health and records.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-100'
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <div className="py-24 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Our AI?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Powered by a database of over 2 million annotated dental images.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className={`h-full border border-gray-100 hover:shadow-xl transition-all duration-300 ${feature.bgColor}/30`}>
                <CardContent className="pt-8 px-6">
                  <div className={`h-14 w-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 border ${feature.borderColor}`}>
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
