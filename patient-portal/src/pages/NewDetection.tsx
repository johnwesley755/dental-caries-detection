import React, { useState } from 'react';
import { Upload, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { patientService } from '@/services/patientService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

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
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-primary shadow-inner">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">AI Dental Scan</h1>
                        <p className="text-slate-500 font-medium">Upload your dental photo for instant AI analysis.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <Card className="border-none shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden rounded-[2.5rem]">
                    <CardContent className="p-8 lg:p-12">
                        <div className="grid lg:grid-cols-2 gap-12 items-start">

                            {/* Left Side: Upload Area */}
                            <div className="space-y-6">
                                {!preview ? (
                                    <label className="flex flex-col items-center justify-center aspect-square rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 hover:border-primary hover:bg-blue-50/50 transition-all cursor-pointer group">
                                        <div className="h-16 w-16 rounded-3xl bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                                            <Upload className="h-8 w-8 text-primary" />
                                        </div>
                                        <span className="text-lg font-black text-slate-900 tracking-tight">Choose Dental Image</span>
                                        <span className="text-sm text-slate-500 mt-2 text-center px-6 font-medium">
                                            Select a clear photo or X-ray (JPG/PNG)
                                        </span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-200 group border-4 border-white shadow-2xl">
                                            <img src={preview} alt="Dental Scan Preview" className="h-full w-full object-cover" />
                                            <button
                                                onClick={() => { setFile(null); setPreview(null); }}
                                                className="absolute top-4 right-4 h-10 w-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-900 hover:bg-white transition-colors shadow-lg"
                                            >
                                                <RefreshCw className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notes (Optional)</label>
                                            <textarea
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                placeholder="Tell us about any specific concerns..."
                                                className="w-full h-24 p-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all resize-none text-sm font-medium"
                                            />
                                        </div>
                                    </div>
                                )}

                                <Button
                                    onClick={handleUpload}
                                    disabled={!file || isAnalyzing}
                                    className="w-full h-14 text-lg font-black bg-primary hover:bg-blue-900 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <LoadingSpinner size="sm" />
                                            <span className="ml-2 uppercase tracking-widest text-xs">AI Analyzing...</span>
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
                                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 shadow-inner">
                                            <ShieldCheck className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 tracking-tight">Clinical-Grade AI</h4>
                                            <p className="text-slate-500 text-sm font-medium">Advanced computer vision identifies caries, enamel issues, and more.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 shadow-inner">
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 tracking-tight">Instant Results</h4>
                                            <p className="text-slate-500 text-sm font-medium">Get preliminary findings in seconds, followed by dentist verification.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-100 rounded-[1.5rem] p-6 shadow-sm ring-1 ring-blue-900/5">
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
                                            <AlertCircle className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-blue-900 tracking-tight">Health Advice</p>
                                            <p className="text-xs text-blue-900/70 font-bold leading-relaxed">
                                                This screening tool is not a medical diagnosis. Always consult with your verified dentist for clinical decisions.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 w-fit border border-slate-200/50">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">AI Core Version 2.4.0</span>
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
