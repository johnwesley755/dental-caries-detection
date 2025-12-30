// frontend/src/components/detection/ShareDialog.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Download, Mail, Share2, Copy, Check } from 'lucide-react';
import { reportService } from '../../services/reportService';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detectionId: string;
  detection_id: string; // Display ID
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  open,
  onOpenChange,
  detectionId,
  detection_id,
}) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [ccEmail, setCcEmail] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const blob = await reportService.downloadPDF(detectionId);
      reportService.triggerDownload(blob, `Detection_Report_${detection_id}.pdf`);
      toast.success('Report downloaded successfully!');
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(error.response?.data?.detail || 'Failed to download report');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!recipientEmail) {
      toast.error('Please enter a recipient email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSendingEmail(true);
    try {
      await reportService.emailReport(detectionId, recipientEmail, ccEmail || undefined);
      toast.success(`Report sent to ${recipientEmail}`);
      setRecipientEmail('');
      setCcEmail('');
    } catch (error: any) {
      console.error('Email error:', error);
      toast.error(error.response?.data?.detail || 'Failed to send email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = reportService.getShareUrl(detectionId);
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleWhatsAppShare = () => {
    const shareUrl = reportService.getShareUrl(detectionId);
    const message = `View my dental detection report: ${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailShare = () => {
    const shareUrl = reportService.getShareUrl(detectionId);
    const subject = `Dental Detection Report - ${detection_id}`;
    const body = `Check out my dental detection report:\n\n${shareUrl}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Detection Report</DialogTitle>
          <DialogDescription>
            Download or share the detection report for {detection_id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Download PDF */}
          <div>
            <Button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="w-full"
              size="lg"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF Report
                </>
              )}
            </Button>
          </div>

          {/* Email Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-600" />
              <Label className="text-sm font-semibold">Email to Patient</Label>
            </div>
            
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="patient@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                disabled={isSendingEmail}
              />
              <Input
                type="email"
                placeholder="CC (optional)"
                value={ccEmail}
                onChange={(e) => setCcEmail(e.target.value)}
                disabled={isSendingEmail}
              />
              <Button
                onClick={handleSendEmail}
                disabled={isSendingEmail || !recipientEmail}
                variant="outline"
                className="w-full"
              >
                {isSendingEmail ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Share via Social Media */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-gray-600" />
              <Label className="text-sm font-semibold">Share via</Label>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={handleWhatsAppShare}
                variant="outline"
                className="flex-col h-auto py-3"
              >
                <svg className="h-6 w-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span className="text-xs">WhatsApp</span>
              </Button>

              <Button
                onClick={handleEmailShare}
                variant="outline"
                className="flex-col h-auto py-3"
              >
                <Mail className="h-6 w-6 mb-1" />
                <span className="text-xs">Email</span>
              </Button>

              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="flex-col h-auto py-3"
              >
                {linkCopied ? (
                  <Check className="h-6 w-6 mb-1 text-green-600" />
                ) : (
                  <Copy className="h-6 w-6 mb-1" />
                )}
                <span className="text-xs">{linkCopied ? 'Copied!' : 'Copy Link'}</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
