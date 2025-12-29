// frontend/src/pages/Home.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, Shield, Zap, Users, CheckCircle2, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const features = [
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

  const steps = [
    { number: '01', title: 'Upload Scans', desc: 'Securely upload X-ray or intraoral images.' },
    { number: '02', title: 'AI Processing', desc: 'Our neural network analyzes density patterns.' },
    { number: '03', title: 'Diagnosis', desc: 'Receive annotated reports with treatment suggestions.' },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[700px] h-[700px] rounded-full bg-blue-50/50 blur-3xl" />
        <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-purple-50/50 blur-3xl" />
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Hero Content */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="lg:w-1/2 text-center lg:text-left z-10"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              New v2.0 Model Released
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight">
              Precision Dental <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Diagnostics with AI
              </span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Enhance your clinical workflow with our advanced computer vision system. 
              Detect early-stage caries with higher accuracy than traditional visual inspection.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" onClick={() => navigate('/login')} className="h-12 px-8 text-base shadow-xl shadow-blue-200/50 transition-all hover:scale-105 bg-blue-600 hover:bg-blue-700">
                Start Diagnosis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/register')}
                className="h-12 px-8 text-base border-2 hover:bg-gray-50 transition-all"
              >
                <PlayCircle className="mr-2 h-5 w-5 text-gray-500" />
                View Demo
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" /> 99.8% Accuracy
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" /> FDA Cleared
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent z-10 mix-blend-overlay" />
              <img 
                src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=2000" 
                alt="Dental AI Analysis Interface" 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Floating Card Element */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-8 -left-8 bg-white p-4 rounded-xl shadow-xl border border-gray-100 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">Status</p>
                  <p className="text-sm font-bold text-gray-900">Analysis Complete</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
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

      {/* How It Works (Timeline Style) */}
      <div className="py-24 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">Workflow Simplified</h2>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 -z-10" />
          
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative bg-white p-6 rounded-2xl border border-gray-100 text-center hover:border-blue-200 transition-colors group"
            >
              <div className="w-24 h-24 bg-white border-4 border-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 group-hover:scale-110 group-hover:border-blue-100 transition-all shadow-lg shadow-blue-50">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-blue-600 rounded-3xl p-12 md:p-24 text-center text-white overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-blue-600 to-blue-600" />
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to Transform Your Practice?</h2>
            <p className="text-xl mb-10 text-blue-100">
              Join over 5,000 dental professionals using our AI-powered caries detection to improve patient outcomes today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/register')}
                className="text-lg px-10 h-14 bg-white text-blue-600 hover:bg-blue-50 font-semibold"
              >
                Create Free Account
              </Button>
            </div>
            <p className="mt-6 text-sm text-blue-200 opacity-80">No credit card required for 14-day trial.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};