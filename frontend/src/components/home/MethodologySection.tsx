// frontend/src/components/home/MethodologySection.tsx
import React from 'react';
import { Database, Brain, Image, BarChart3 } from 'lucide-react';

export const MethodologySection: React.FC = () => {
  const steps = [
    {
      icon: Database,
      title: 'Data Collection',
      description: 'Curated dataset of dental radiographs with annotated caries regions',
      details: ['X-ray images', 'Expert annotations', 'Data augmentation']
    },
    {
      icon: Brain,
      title: 'Model Training',
      description: 'Deep learning model using Convolutional Neural Networks (CNN)',
      details: ['Transfer learning', 'Custom architecture', 'Hyperparameter tuning']
    },
    {
      icon: Image,
      title: 'Detection & Classification',
      description: 'Instance segmentation for precise caries localization',
      details: ['Bounding boxes', 'Severity levels', 'Confidence scores']
    },
    {
      icon: BarChart3,
      title: 'Validation & Testing',
      description: 'Rigorous evaluation using standard metrics',
      details: ['Accuracy: 98%', 'Precision & Recall', 'F1-Score analysis']
    }
  ];

  return (
    <section id="methodology" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Methodology
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our systematic approach to developing the AI detection system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-10">
                  {index + 1}
                </div>

                <div className="bg-white rounded-2xl p-6 pt-8 shadow-sm border border-gray-100 hover:shadow-md transition-all h-full">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{step.description}</p>
                  <ul className="space-y-1">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="text-xs text-gray-500 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
