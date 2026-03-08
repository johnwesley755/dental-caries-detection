import React, { useState } from 'react';
import { Upload, Loader2, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { patientService } from '@/services/patientService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const NewDetection: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [notes, setNotes] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsAnalyzing(true);

        try {
            const result = await patientService.uploadDetection(file, notes);
            toast.success('AI Analysis Complete!');
            navigate(`/detection/${result.id}`);
        } catch (err: any) {
            console.error('Analysis failed:', err);
            toast.error('AI Analysis failed. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 lg:p-8">
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Dental Scan</h1>
                        <p className="text-slate-500">Upload your dental photo for instant AI analysis.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden rounded-3xl">
                    <CardContent className="p-8 lg:p-12">
                        <div className="grid lg:grid-cols-2 gap-12 items-start">

                            {/* Left Side: Upload Area */}
                            <div className="space-y-6">
                                {!preview ? (
                                    <label className="flex flex-col items-center justify-center aspect-square rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group">
                                        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Upload className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <span className="text-lg font-semibold text-slate-900">Choose Dental Image</span>
                                        <span className="text-sm text-slate-500 mt-2 text-center px-6">
                                            Select a clear photo or X-ray (JPG/PNG)
                                        </span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-200 shadow-inner group border-4 border-white shadow-lg">
                                            <img src={preview} alt="Dental Scan Preview" className="h-full w-full object-cover" />
                                            <button
                                                onClick={() => { setFile(null); setPreview(null); }}
                                                className="absolute top-4 right-4 h-10 w-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-900 hover:bg-white transition-colors shadow-lg"
                                            >
                                                <RefreshCw className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Notes (Optional)</label>
                                            <textarea
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                placeholder="Tell us about any specific concerns..."
                                                className="w-full h-24 p-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none text-sm"
                                            />
                                        </div>
                                    </div>
                                )}

                                <Button
                                    onClick={handleUpload}
                                    disabled={!file || isAnalyzing}
                                    className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/20"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                                            AI Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            Start Analysis
                                            <ArrowRight className="h-5 w-5 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Right Side: Pro Info */}
                            <div className="space-y-8 py-4">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                                            <ShieldCheck className="h-5 w-5 text-teal-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">Clinical-Grade AI</h4>
                                            <p className="text-slate-500 text-sm">Advanced computer vision identifies caries, enamel issues, and more.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">Instant Results</h4>
                                            <p className="text-slate-500 text-sm">Get preliminary findings in seconds, followed by dentist verification.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                                    <div className="flex gap-3">
                                        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-amber-900">Health Advice</p>
                                            <p className="text-xs text-amber-800 leading-relaxed">
                                                This screening tool is not a medical diagnosis. Always consult with your verified dentist for clinical decisions.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 w-fit">
                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Core Version 2.4.0</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// Simple Refresh Icon if RefreshCw isn't in scope or needed
const RefreshCw = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
);

export default NewDetection;
