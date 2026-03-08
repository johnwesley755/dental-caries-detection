// patient-portal/src/components/home/QuickScan.tsx
import React, { useState } from 'react';
import { Upload, Loader2, Search, AlertCircle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { api } from '../../services/api';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

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
        <div id="quick-scan" className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Try Our AI Quick-Scan</h2>
                        <p className="text-lg text-slate-600">
                            Get an instant preliminary analysis. No account required for your first scan.
                        </p>
                    </div>

                    <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-3xl overflow-hidden">
                        <CardContent className="p-8 lg:p-12">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">

                                {/* Upload Area */}
                                <div className="space-y-6">
                                    {!preview ? (
                                        <label className="flex flex-col items-center justify-center aspect-square rounded-2xl bg-white border-2 border-dashed border-teal-200 hover:border-teal-500 hover:bg-teal-50 transition-all cursor-pointer group">
                                            <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <Upload className="h-8 w-8 text-teal-600" />
                                            </div>
                                            <span className="text-lg font-semibold text-slate-900">Upload Dental Image</span>
                                            <span className="text-sm text-slate-500 mt-2 text-center px-6">
                                                Select a clear photo of your teeth or a dental X-ray (JPG/PNG)
                                            </span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    ) : (
                                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-200 shadow-inner group">
                                            <img src={preview} alt="Dental Scan" className="h-full w-full object-cover" />
                                            {!result && !isAnalyzing && (
                                                <button
                                                    onClick={() => { setFile(null); setPreview(null); }}
                                                    className="absolute top-4 right-4 h-10 w-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-900 hover:bg-white transition-colors shadow-lg"
                                                >
                                                    <Search className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleAnalyze}
                                        disabled={!file || isAnalyzing}
                                        className="w-full h-14 text-lg font-bold bg-teal-600 hover:bg-teal-700 rounded-xl shadow-lg shadow-teal-600/20"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                                                AI is Analyzing...
                                            </>
                                        ) : (
                                            'Start AI Diagnostic'
                                        )}
                                    </Button>
                                </div>

                                {/* Results/Info Area */}
                                <div className="min-h-[400px] flex flex-col justify-center">
                                    <AnimatePresence mode="wait">
                                        {!result ? (
                                            <motion.div
                                                key="placeholder"
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="space-y-8"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                                                        <ShieldCheck className="h-5 w-5 text-teal-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">Privacy First</h4>
                                                        <p className="text-slate-600 text-sm">Your images are processed securely and deleted if not saved.</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                                                        <CheckCircle2 className="h-5 w-5 text-teal-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">92% Accuracy</h4>
                                                        <p className="text-slate-600 text-sm">Trained on 100k+ clinical dental examinations for precision.</p>
                                                    </div>
                                                </div>
                                                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                                                    <div className="flex gap-3">
                                                        <AlertCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                                        <p className="text-sm text-emerald-800 leading-relaxed">
                                                            <strong>Medical Disclaimer:</strong> This AI screening is for information only. Always seek a professional opinion from a licensed dentist.
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="result"
                                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                                className="space-y-6"
                                            >
                                                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                                                    <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                                                    <h3 className="text-2xl font-bold text-green-900">Analysis Complete</h3>
                                                    <p className="text-green-700 mt-2">Preliminary findings are ready.</p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-white p-4 rounded-2xl border shadow-sm">
                                                        <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1 text-center">Teeth Detected</p>
                                                        <p className="text-3xl font-bold text-slate-900 text-center">{result.total_teeth_detected}</p>
                                                    </div>
                                                    <div className="bg-white p-4 rounded-2xl border shadow-sm">
                                                        <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1 text-center">Caries Found</p>
                                                        <p className="text-3xl font-bold text-red-600 text-center">{result.total_caries_detected}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <p className="text-sm text-slate-600 text-center px-4">
                                                        To view detailed markings and receive professional verification, create your free patient account.
                                                    </p>
                                                    <Link to="/register" state={{ detectionId: result.id }}>
                                                        <Button className="w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-lg font-bold group">
                                                            Save Results & Talk to Dentist
                                                            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
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
