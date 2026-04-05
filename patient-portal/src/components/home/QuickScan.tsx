// patient-portal/src/components/home/QuickScan.tsx
import React, { useState } from 'react';
import { Upload, Search, AlertCircle, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { api } from '../../services/api';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const QuickScan: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setIsAnalyzing(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('notes', 'Quick Scan from Home Page');

        try {
            const response = await api.post('/public/detect', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResult(response.data);
            toast.success('AI Analysis Complete!');
        } catch (err: any) {
            console.error('Analysis failed:', err);
            toast.error('AI Analysis failed. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div id="quick-scan" className="py-32 bg-slate-50/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/40 pattern-grid-lg opacity-10" />
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                           <Sparkles className="h-4 w-4 text-primary" />
                           <span className="text-[10px] font-black text-primary tracking-widest uppercase">Patient Innovation Showcase</span>
                        </div>
                        <h2 className="text-4xl lg:text-7xl font-black text-slate-900 tracking-tight leading-none">Smart AI Checkup</h2>
                        <p className="text-xl text-slate-500 font-bold max-w-2xl mx-auto tracking-tight leading-relaxed">
                            Upload a photo of your teeth for an instant, private checkup. Our AI helps you find potential issues early.
                        </p>
                    </div>

                    <Card className="border-none shadow-2xl shadow-blue-900/10 bg-white/80 backdrop-blur-xl rounded-[3rem] overflow-hidden border border-white/40 ring-1 ring-slate-200/50">
                        <CardContent className="p-10 lg:p-16">
                            <div className="grid lg:grid-cols-2 gap-20 items-center">

                                {/* Upload Area */}
                                <div className="space-y-10">
                                    {!preview ? (
                                        <label className="flex flex-col items-center justify-center aspect-square rounded-[2.5rem] bg-slate-50/50 border-4 border-dashed border-slate-200 hover:border-primary hover:bg-blue-50/50 transition-all cursor-pointer group relative overflow-hidden">
                                            <div className="absolute inset-0 bg-white/20 pattern-grid-lg opacity-10" />
                                            <div className="h-24 w-24 rounded-3xl bg-white border border-blue-100 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-2xl shadow-blue-900/5">
                                                <Upload className="h-12 w-12 text-primary" strokeWidth={2.5} />
                                            </div>
                                            <span className="text-2xl font-black text-slate-900 tracking-tight px-4 text-center">Add Your Photo</span>
                                            <span className="text-sm text-slate-500 mt-3 text-center px-12 font-bold leading-relaxed">
                                                Take a clear photo of your teeth or upload an X-ray (JPG/PNG)
                                            </span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    ) : (
                                        <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-slate-100 group border-[8px] border-white shadow-2xl ring-1 ring-slate-200">
                                            <img src={preview} alt="Dental Scan" className="h-full w-full object-cover" />
                                            {!result && !isAnalyzing && (
                                                <button
                                                    onClick={() => { setFile(null); setPreview(null); }}
                                                    className="absolute top-6 right-6 h-14 w-14 bg-white/90 backdrop-blur rounded-[1.25rem] flex items-center justify-center text-slate-900 hover:bg-white transition-all shadow-xl group-hover:scale-105 active:scale-95"
                                                >
                                                    <X className="h-7 w-7 text-red-500" />
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleAnalyze}
                                        disabled={!file || isAnalyzing}
                                        className="w-full h-20 text-xl font-black bg-primary hover:bg-blue-900 text-white rounded-[1.5rem] shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <LoadingSpinner size="sm" />
                                                <span>Running Checkup...</span>
                                            </>
                                        ) : (
                                            <>
                                               <Search className="h-6 w-6" strokeWidth={3} />
                                               <span>Get Instant Results</span>
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Results/Info Area */}
                                <div className="min-h-[440px] flex flex-col justify-center">
                                    <AnimatePresence mode="wait">
                                        {!result ? (
                                            <motion.div
                                                key="placeholder"
                                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                                className="space-y-12"
                                            >
                                                <div className="flex items-start gap-8">
                                                    <div className="h-16 w-16 rounded-[1.25rem] bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
                                                        <ShieldCheck className="h-8 w-8 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-slate-900 tracking-tight text-xl mb-1">Your Privacy First</h4>
                                                        <p className="text-slate-500 font-bold text-base leading-relaxed">Your photos are private and encrypted. We never share your health data with anyone else.</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-8">
                                                    <div className="h-16 w-16 rounded-[1.25rem] bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 shadow-sm">
                                                        <Sparkles className="h-8 w-8 text-emerald-500" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-slate-900 tracking-tight text-xl mb-1">Smart Assistance</h4>
                                                        <p className="text-slate-500 font-bold text-base leading-relaxed">Our AI has been trained on thousands of clinical records to help you stay healthy.</p>
                                                    </div>
                                                </div>
                                                <div className="bg-amber-50/80 border border-amber-100 rounded-[2rem] p-8 shadow-sm">
                                                    <div className="flex gap-5">
                                                        <AlertCircle className="h-7 w-7 text-amber-600 shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs text-amber-900 font-black tracking-tight leading-relaxed uppercase mb-1">Health Note</p>
                                                            <p className="text-sm text-amber-800 font-bold leading-relaxed">
                                                                This checkup is for information only. Please always talk to a real dentist for a formal diagnosis and treatment plan.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="result"
                                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                                className="space-y-10"
                                            >
                                                <div className="bg-emerald-50/80 border border-emerald-100 rounded-[2.5rem] p-12 text-center relative overflow-hidden group">
                                                    <div className="absolute inset-0 bg-white/20 pattern-grid-lg opacity-10" />
                                                    <div className="relative z-10">
                                                        <CheckCircle2 className="h-24 w-24 text-emerald-500 mx-auto mb-6 group-hover:scale-110 transition-transform duration-500" strokeWidth={2.5} />
                                                        <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Checkup Complete</h3>
                                                        <p className="text-emerald-700 font-black text-sm uppercase tracking-widest">AI Findings Ready Below</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-blue-900/5">
                                                        <p className="text-slate-400 text-[10px] font-black mb-2 text-center">Teeth Detected</p>
                                                        <p className="text-4xl font-black text-slate-900 text-center tracking-tighter">{result.total_teeth_detected}</p>
                                                    </div>
                                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-blue-900/5">
                                                        <p className="text-slate-400 text-[10px] font-black mb-2 text-center">AI Findings</p>
                                                        <p className={`text-4xl font-black text-center tracking-tighter ${result.total_caries_detected > 0 ? 'text-primary' : 'text-emerald-500'}`}>
                                                            {result.total_caries_detected}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 pt-4">
                                                    <p className="text-[10px] text-slate-400 font-black text-center px-10 leading-relaxed">
                                                        Authenticate your clinical profile to view detailed geometric markings and initiate professional verification.
                                                    </p>
                                                    <Link to="/register" state={{ detectionId: result.id }}>
                                                        <Button className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] group shadow-2xl shadow-emerald-900/20">
                                                            Secure Results & Contact Specialist
                                                            <ArrowRight className="h-4 w-4 ml-3 group-hover:translate-x-2 transition-transform" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
