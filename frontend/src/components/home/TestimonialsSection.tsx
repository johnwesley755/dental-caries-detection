// frontend/src/components/home/TestimonialsSection.tsx
import React from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'General Dentist',
      image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=3B82F6&color=fff&size=128',
      content: 'This AI detection system has revolutionized my practice. Early detection rates have improved significantly, and my patients appreciate the advanced technology.',
      rating: 5
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Orthodontist',
      image: 'https://ui-avatars.com/api/?name=Michael+Chen&background=10B981&color=fff&size=128',
      content: 'The accuracy and speed of caries detection is impressive. It helps me provide better treatment plans and educate patients more effectively.',
      rating: 5
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Pediatric Dentist',
      image: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=8B5CF6&color=fff&size=128',
      content: 'Parents love seeing the visual analysis. It makes explaining dental issues much easier and builds trust in our recommendations.',
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Dentists Are Saying
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from dental professionals who are using our platform daily
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-blue-100" />
              
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
