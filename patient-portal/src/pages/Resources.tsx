// patient-portal/src/pages/Resources.tsx
import React from 'react';
import { BookOpen, Video, FileText, ExternalLink } from 'lucide-react';

export const Resources: React.FC = () => {
  const resources = [
    {
      category: 'Articles',
      icon: FileText,
      items: [
        {
          title: 'Understanding Dental Caries',
          description: 'Learn about the causes, prevention, and treatment of tooth decay',
          link: '#'
        },
        {
          title: 'Proper Brushing Techniques',
          description: 'Step-by-step guide to effective tooth brushing',
          link: '#'
        },
        {
          title: 'Importance of Regular Checkups',
          description: 'Why routine dental visits are crucial for oral health',
          link: '#'
        }
      ]
    },
    {
      category: 'Videos',
      icon: Video,
      items: [
        {
          title: 'How to Floss Correctly',
          description: 'Video tutorial on proper flossing technique',
          link: '#'
        },
        {
          title: 'Dental Care for Children',
          description: 'Tips for maintaining your child\'s oral health',
          link: '#'
        }
      ]
    },
    {
      category: 'Guides',
      icon: BookOpen,
      items: [
        {
          title: 'Post-Treatment Care',
          description: 'What to do after dental procedures',
          link: '#'
        },
        {
          title: 'Nutrition for Healthy Teeth',
          description: 'Foods that promote strong teeth and gums',
          link: '#'
        }
      ]
    }
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resources</h1>
        <p className="text-gray-600">Educational materials to help you maintain optimal oral health</p>
      </div>

      {/* Resources Grid */}
      <div className="space-y-8">
        {resources.map((category, categoryIndex) => {
          const Icon = category.icon;
          return (
            <div key={categoryIndex}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{category.category}</h2>
              </div>

              {/* Category Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((item, itemIndex) => (
                  <a
                    key={itemIndex}
                    href={item.link}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="mt-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">How often should I visit the dentist?</h3>
            <p className="text-gray-600 text-sm">
              It's recommended to visit your dentist every 6 months for routine checkups and cleanings.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">What should I do if I have tooth pain?</h3>
            <p className="text-gray-600 text-sm">
              Contact your dentist immediately. In the meantime, rinse with warm salt water and take over-the-counter pain medication if needed.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">How can I prevent cavities?</h3>
            <p className="text-gray-600 text-sm">
              Brush twice daily, floss regularly, limit sugary foods, and maintain regular dental checkups.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
