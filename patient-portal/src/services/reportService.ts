import { api } from './api';

export const reportService = {
  /**
   * Download PDF report for a detection
   */
  downloadPDF: async (detectionId: string): Promise<Blob> => {
    const response = await api.get(
      `/reports/detection/${detectionId}/pdf`,
      {
        responseType: 'blob',
      }
    );

    return response.data;
  },

  /**
   * Get shareable URL for a detection
   */
  getShareUrl: (detectionId: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/detection/${detectionId}`;
  },

  /**
   * Trigger browser download of PDF
   */
  triggerDownload: (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
