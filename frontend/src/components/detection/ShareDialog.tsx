// frontend/src/components/detection/ShareDialog.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Download, Mail, Copy, Check, Link as LinkIcon, X } from 'lucide-react';
import { reportService } from '../../services/reportService';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detectionId: string;
  detection_id: string;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({ 
  open, 
  onOpenChange, 
  detectionId, 
  detection_id 
}) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.href; // Or use reportService.getShareUrl(detectionId) if implemented

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleSendEmail = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }
    
    // Simple email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Invalid email format');
      return;
    }

    setIsSending(true);
    try {
      await reportService.emailReport(detectionId, email);
      toast.success(`Report sent to ${email}`);
      setEmail('');
    } catch (e: any) {
      console.error(e);
      toast.error('Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const blob = await reportService.downloadPDF(detectionId);
      reportService.triggerDownload(blob, `Detection_Report_${detection_id}.pdf`);
      toast.success('Report downloaded successfully');
    } catch (error: any) {
      toast.error('Failed to download PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-[20px] p-0 border-none shadow-2xl gap-0 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 pb-2 relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-xl font-bold text-slate-800">Share Report</DialogTitle>
            <p className="text-sm text-slate-500">
              Share analysis <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-600">{detection_id}</span> with colleagues or patients.
            </p>
          </DialogHeader>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Report Link Section */}
          <div className="space-y-2.5">
            <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Report Link</Label>
            <div className="flex gap-2">
              <div className="relative flex-1 group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors">
                  <LinkIcon className="h-4 w-4" />
                </div>
                <Input 
                  readOnly 
                  value={shareUrl}
                  className="pl-10 h-11 bg-slate-50 border-slate-200 text-slate-600 font-medium text-sm focus-visible:ring-blue-500 rounded-xl"
                />
              </div>
              <Button 
                onClick={handleCopyLink} 
                variant="outline"
                size="icon"
                className={`h-11 w-11 shrink-0 rounded-xl border-slate-200 transition-all ${
                  copied 
                    ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Email Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-800" />
              <Label className="text-sm font-semibold text-slate-800">Send via Email</Label>
            </div>
            <div className="flex gap-2">
               <Input 
                  placeholder="doctor@clinic.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-blue-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendEmail()}
               />
               <Button 
                  onClick={handleSendEmail} 
                  disabled={isSending || !email} 
                  className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-md shadow-blue-100 transition-all"
               >
                  {isSending ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Send'
                  )}
               </Button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2">
            <Button 
              variant="outline" 
              onClick={handleDownloadPDF} 
              disabled={isDownloading}
              className="w-full h-12 border-slate-200 text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all"
            >
              {isDownloading ? (
                <>
                  <div className="h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-2" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Save PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};