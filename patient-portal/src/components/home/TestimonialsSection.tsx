// patient-portal/src/components/home/TestimonialsSection.tsx
import React from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Jennifer Martinez',
      role: 'Patient',
      image: 'https://ui-avatars.com/api/?name=Jennifer+Martinez&background=3B82F6&color=fff&size=128',
      content: 'The early detection helped me avoid a major dental procedure. I\'m so grateful for this technology and my dentist\'s care.',
      rating: 5
    },
    {
      name: 'David Thompson',
      role: 'Patient',
      image: 'https://ui-avatars.com/api/?name=David+Thompson&background=10B981&color=fff&size=128',
      content: 'Being able to see the analysis and track my progress gives me peace of mind. The platform is easy to use and very informative.',
      rating: 5
    },
    {
      name: 'Lisa Anderson',
      role: 'Patient',
      image: 'https://ui-avatars.com/api/?name=Lisa+Anderson&background=8B5CF6&color=fff&size=128',
      content: 'My kids love seeing their dental checkup results. It makes them more engaged in taking care of their teeth!',
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Patients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real experiences from people who trust our platform for their dental health
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
