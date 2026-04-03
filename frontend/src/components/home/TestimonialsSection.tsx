// frontend/src/components/home/TestimonialsSection.tsx
import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Clinical Director',
      image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=003d9b&color=fff&size=128',
      content: 'The neural detection accuracy is unprecedented. It has significantly reduced diagnostic oversight in our multi-specialty clinic.',
      rating: 5
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Maxillofacial Surgeon',
      image: 'https://ui-avatars.com/api/?name=Michael+Chen&background=003d9b&color=fff&size=128',
      content: 'DentalAI integration was seamless. The precision of localized caries identification helps us provide evidence-based treatment plans.',
      rating: 5
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Principal Dentist',
      image: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=003d9b&color=fff&size=128',
      content: 'Visual neural markers build immediate trust with patients. It’s an essential part of our modern clinical workstation.',
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-surface/50 border-y border-slate-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="text-center mb-20 space-y-3">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] font-black text-primary uppercase tracking-[0.3em]"
          >
            Clinical Feedback
          </motion.p>
          <h2 className="text-3xl md:text-5xl font-headline font-black text-blue-900 uppercase">Expert Endorsements</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-50 relative group"
            >
              <Quote className="absolute top-8 right-10 h-10 w-10 text-primary/5 group-hover:text-primary/10 transition-colors" />
              
              <div className="flex items-center mb-6 gap-0.5">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                ))}
              </div>

              <p className="text-slate-600 mb-8 font-bold italic text-base leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4 border-t border-slate-50 pt-8 mt-auto">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-2xl shadow-md border border-slate-100"
                />
                <div className="text-left">
                  <div className="font-headline font-black text-blue-900 uppercase text-xs tracking-tight">{testimonial.name}</div>
                  <div className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
