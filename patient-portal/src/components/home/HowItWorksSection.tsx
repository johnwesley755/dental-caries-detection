// patient-portal/src/components/home/HowItWorksSection.tsx
import React from 'react';
import { Upload, Scan, FileText, CheckCircle } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Image',
      description: 'Your dentist uploads your dental X-ray or photo to the secure platform',
      number: '01'
    },
    {
      icon: Scan,
      title: 'AI Analysis',
      description: 'Our advanced AI scans and analyzes the image for signs of caries and decay',
      number: '02'
    },
    {
      icon: FileText,
      title: 'Get Results',
      description: 'Receive detailed results with visual annotations and severity ratings',
      number: '03'
    },
    {
      icon: CheckCircle,
      title: 'Treatment Plan',
      description: 'Your dentist creates a personalized treatment plan based on the findings',
      number: '04'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple, fast, and accurate dental caries detection in four easy steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative"
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-200 to-purple-200" />
                )}

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative z-10">
                  <div className="text-6xl font-bold text-blue-100 mb-4">{step.number}</div>
                  <div className="w-14 h-14 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
