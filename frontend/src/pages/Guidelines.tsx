import React from 'react';
import { TopNavBar } from '../components/layout/TopNavBar';
import { 
  FileText, 
  Image as ImageIcon, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  Zap,
  ChevronRight
} from 'lucide-react';

export const Guidelines: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const sections = [
    {
      title: "Image Quality Standards",
      icon: <ImageIcon className="w-5 h-5 text-primary" />,
      content: "For optimal AI detection, dental X-rays must meet specific resolution and contrast requirements.",
      items: [
        "Resolution: Minimum 1024x1024 pixels for clear edge detection.",
        "Format: DICOM is preferred, but high-quality PNG/JPG is accepted.",
        "Contrast: Ensure clear distinction between enamel and dentin layers.",
        "Lighting: Avoid overexposed regions which can mask subtle radiolucency."
      ]
    },
    {
      title: "Patient Positioning",
      icon: <FileText className="w-5 h-5 text-secondary" />,
      content: "Correct positioning is critical for accurate tooth segmentation and caries localization.",
      items: [
        "Bitewing: Ensure parallel alignment with the occlusal plane.",
        "Periapical: The entire tooth structure from crown to apex should be visible.",
        "Overlapping: Minimize interproximal overlap to improve AI detection between teeth.",
        "No Motion: Ensure the patient remains still to avoid motion artifacts."
      ]
    },
    {
      title: "AI Detection interpretation",
      icon: <Zap className="w-5 h-5 text-tertiary" />,
      content: "Our AI model uses deep learning to identify suspicious regions based on density variations.",
      items: [
        "Bounding Boxes: Red boxes indicate high-probability caries (90%+).",
        "Confidence Score: AI provides a score; scores above 0.75 are usually actionable.",
        "Location Masking: The AI segments individual teeth to localize findings precisely.",
        "False Positives: Staining or anatomical variations may sometimes trigger AI flags."
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface relative">
      <TopNavBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-10 flex flex-col gap-8 lg:gap-12 overflow-x-hidden">
        {/* Header Hero */}
        <div className="max-w-4xl mx-auto w-full space-y-4 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-3 py-1 rounded-full text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Clinical Protocol
          </div>
          <h1 className="text-3xl lg:text-5xl font-black font-headline text-blue-900 tracking-tight leading-tight">
            AI Implementation & <br className="hidden lg:block" /> Detection Guidelines
          </h1>
          <p className="text-slate-500 text-base lg:text-lg max-w-2xl font-medium leading-relaxed">
            Standardizing the diagnostic workflow to ensure maximum accuracy and patient safety through consistent AI-assisted analysis.
          </p>
        </div>

        {/* Content Sections */}
        <div className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-20">
          
          {/* Main Guidelines */}
          <div className="lg:col-span-8 space-y-10 lg:space-y-12">
            {sections.map((section, idx) => (
              <section key={idx} className="space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shadow-sm">
                    {section.icon}
                  </div>
                  <h2 className="text-xl lg:text-2xl font-bold text-blue-900 font-headline">{section.title}</h2>
                </div>
                
                <p className="text-slate-600 font-medium leading-relaxed">{section.content}</p>
                
                <div className="grid grid-cols-1 gap-3">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-slate-50 shadow-sm group hover:border-primary/20 transition-all">
                      <div className="mt-1">
                        <CheckCircle2 className="w-4 h-4 text-tertiary" />
                      </div>
                      <span className="text-sm lg:text-base font-medium text-slate-700 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Safety Disclaimer */}
            <div className="bg-error/5 border border-error/20 p-6 lg:p-8 rounded-3xl space-y-4">
              <div className="flex items-center gap-3 text-error">
                <AlertCircle className="w-6 h-6" />
                <h3 className="font-headline font-black text-lg">Clinical Disclaimer</h3>
              </div>
              <p className="text-error/80 text-sm lg:text-base font-bold leading-relaxed">
                The Artificial Intelligence system is designed to act as a supportive diagnostic tool (Clinical Decision Support). It is NOT intended to replace professional dental diagnosis. ALL findings and AI flags must be validated by a licensed dental professional before any treatment is initiated.
              </p>
            </div>
          </div>

          {/* Sidebar Quick Links */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-10">
              <h3 className="text-sm lg:text-base font-bold text-blue-900 mb-6 flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                Quick Summary
              </h3>
              
              <div className="space-y-4">
                {[
                  "Bitewing/Periapical images only.",
                  "Resolution: 1024px minimum.",
                  "DICOM/PNG formats.",
                  "Clinical validation required."
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                    {text}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50">
                <button className="w-full flex items-center justify-between text-primary font-black text-xs hover:opacity-70 transition-opacity">
                  Download Full PDF
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
