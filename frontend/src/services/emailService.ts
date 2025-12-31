// frontend/src/services/emailService.ts
import emailjs from '@emailjs/browser';

// EmailJS Configuration
// Get these from: https://dashboard.emailjs.com/
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

export interface SendCredentialsParams {
  to_email: string;
  to_name: string;
  user_email: string;
  user_password: string;
  user_role: string;
  portal_url: string;
}

class EmailService {
  /**
   * Initialize EmailJS with public key
   */
  init() {
    if (EMAILJS_PUBLIC_KEY) {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  }

  /**
   * Send user credentials via EmailJS
   */
  async sendUserCredentials(params: SendCredentialsParams): Promise<boolean> {
    try {
      // Validate configuration
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        console.error('EmailJS not configured. Please set environment variables.');
        return false;
      }

      console.log('Sending email via EmailJS to:', params.to_email);

      // Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: params.to_email,
          to_name: params.to_name,
          user_email: params.user_email,
          user_password: params.user_password,
          user_role: params.user_role,
          portal_url: params.portal_url,
          portal_name: params.user_role === 'PATIENT' ? 'Patient Portal' : 'Dental Care Portal',
        },
        EMAILJS_PUBLIC_KEY
      );

      if (response.status === 200) {
        console.log('✅ Email sent successfully via EmailJS');
        return true;
      } else {
        console.error('❌ EmailJS error:', response);
        return false;
      }
    } catch (error) {
      console.error('❌ Failed to send email via EmailJS:', error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Initialize on import
emailService.init();
