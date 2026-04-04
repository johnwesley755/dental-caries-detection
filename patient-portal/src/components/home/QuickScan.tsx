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
                           <span className="text-[10px] font-black text-primary uppercase tracking-widest">Public Diagnostic Beta</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight uppercase leading-none">Try Our AI Quick-Scan</h2>
                        <p className="text-lg text-slate-500 font-bold max-w-2xl mx-auto tracking-tight">
                            Execute an instant preliminary clinical analysis in seconds. Zero account registration required for your first audit.
                        </p>
                    </div>

                    <Card className="border-none shadow-2xl shadow-blue-900/5 bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white/20">
                        <CardContent className="p-10 lg:p-14">
                            <div className="grid lg:grid-cols-2 gap-16 items-center">

                                {/* Upload Area */}
                                <div className="space-y-8">
                                    {!preview ? (
                                        <label className="flex flex-col items-center justify-center aspect-square rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 hover:border-primary hover:bg-blue-50/50 transition-all cursor-pointer group relative overflow-hidden">
                                            <div className="absolute inset-0 bg-white/20 pattern-grid-lg opacity-10" />
                                            <div className="h-20 w-20 rounded-[1.5rem] bg-white border border-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-xl shadow-blue-900/5">
                                                <Upload className="h-10 w-10 text-primary" />
                                            </div>
                                            <span className="text-lg font-black text-slate-900 tracking-tight uppercase px-4 text-center">Upload Diagnostic Image</span>
                                            <span className="text-xs text-slate-400 mt-2 text-center px-8 font-bold uppercase tracking-wider leading-relaxed">
                                                Clinical standard photography or radiographic imagery (JPG/PNG • max 10MB)
                                            </span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    ) : (
                                        <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-100 group border-4 border-white shadow-2xl">
                                            <img src={preview} alt="Dental Scan" className="h-full w-full object-cover" />
                                            {!result && !isAnalyzing && (
                                                <button
                                                    onClick={() => { setFile(null); setPreview(null); }}
                                                    className="absolute top-4 right-4 h-12 w-12 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center text-slate-900 hover:bg-white transition-all shadow-xl group-hover:scale-105 active:scale-95"
                                                >
                                                    <X className="h-6 w-6 text-red-500" />
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleAnalyze}
                                        disabled={!file || isAnalyzing}
                                        className="w-full h-16 text-lg font-black bg-primary hover:bg-blue-900 text-white rounded-2xl shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-[10px]"
                                    >
                                        {isAnalyzing ? (
                                            <div className="flex items-center gap-3">
                                                <LoadingSpinner size="sm" />
                                                <span>AI Audit in Progress...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                               <Search className="h-5 w-5" strokeWidth={3} />
                                               <span>Execute AI Diagnostic</span>
                                            </div>
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
                                                className="space-y-10"
                                            >
                                                <div className="flex items-start gap-6">
                                                    <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                                                        <ShieldCheck className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-slate-900 uppercase tracking-tight text-lg">Encrypted Privacy</h4>
                                                        <p className="text-slate-500 font-bold text-sm leading-relaxed">Your clinical data is processed across secure channels and immediately expunged post-analysis unless authenticated.</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-6">
                                                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                                                        <Sparkles className="h-6 w-6 text-emerald-500" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-slate-900 uppercase tracking-tight text-lg">92% Core Accuracy</h4>
                                                        <p className="text-slate-500 font-bold text-sm leading-relaxed">Model validated across 100k+ clinical dental datasets for maximum diagnostic precision.</p>
                                                    </div>
                                                </div>
                                                <div className="bg-amber-50 border border-amber-100 rounded-[1.5rem] p-6 shadow-sm ring-1 ring-amber-900/5">
                                                    <div className="flex gap-4">
                                                        <AlertCircle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                                                        <p className="text-[10px] text-amber-900 font-black uppercase tracking-tight leading-relaxed">
                                                            Medical Disclaimer: Public AI screening is for diagnostic information only. Always consult with board-certified clinical professionals for formal diagnosis.
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="result"
                                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                                className="space-y-8"
                                            >
                                                <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-10 text-center relative overflow-hidden group">
                                                    <div className="absolute inset-0 bg-white/20 pattern-grid-lg opacity-10" />
                                                    <CheckCircle2 className="h-20 w-20 text-emerald-500 mx-auto mb-6 group-hover:scale-110 transition-transform duration-500" />
                                                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none mb-2">Audit Complete</h3>
                                                    <p className="text-emerald-700 font-black uppercase tracking-widest text-[10px]">Clinical markers successfully identified</p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-blue-900/5">
                                                        <p className="text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] mb-2 text-center">Teeth Detected</p>
                                                        <p className="text-4xl font-black text-slate-900 text-center tracking-tighter">{result.total_teeth_detected}</p>
                                                    </div>
                                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-blue-900/5">
                                                        <p className="text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] mb-2 text-center">AI Findings</p>
                                                        <p className={`text-4xl font-black text-center tracking-tighter ${result.total_caries_detected > 0 ? 'text-primary' : 'text-emerald-500'}`}>
                                                            {result.total_caries_detected}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 pt-4">
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest text-center px-10 leading-relaxed">
                                                        Authenticate your clinical profile to view detailed geometric markings and initiate professional verification.
                                                    </p>
                                                    <Link to="/register" state={{ detectionId: result.id }}>
                                                        <Button className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-[0.2em] group shadow-2xl shadow-emerald-900/20">
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
