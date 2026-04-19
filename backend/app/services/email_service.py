# Email Service for User Management (Brevo v3 API)
from typing import Optional, List
import requests
from ..core.config import settings
import secrets
import string

class EmailService:
    """Service for sending emails to users using Brevo v3 Transactional Email API"""
    
    @staticmethod
    def generate_password(length: int = 12) -> str:
        """Generate a secure random password"""
        alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
        password = ''.join(secrets.choice(alphabet) for _ in range(length))
        return password
    
    @staticmethod
    def send_email(
        to_email: str, 
        subject: str, 
        html_content: str, 
        attachments: Optional[List[dict]] = None,
        sender_name: Optional[str] = None
    ) -> bool:
        """Send an email via Brevo v3 Transactional API"""
        try:
            # Validate Brevo API key
            if not settings.BREVO_API_KEY:
                print("ERROR: BREVO_API_KEY not configured!")
                return False
            
            print(f"Attempting to send email via Brevo to: {to_email}")
            
            # Prepare Brevo API payload
            payload = {
                "sender": {
                    "name": sender_name or settings.BREVO_SENDER_NAME or settings.HOSPITAL_NAME,
                    "email": settings.BREVO_SENDER_EMAIL or settings.HOSPITAL_EMAIL
                },
                "to": [{"email": to_email}],
                "subject": subject,
                "htmlContent": html_content
            }
            
            if attachments:
                payload["attachments"] = attachments
            
            # Send email via Brevo HTTP API
            response = requests.post(
                "https://api.brevo.com/v3/smtp/email",
                headers={
                    "api-key": settings.BREVO_API_KEY,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                json=payload,
                timeout=30
            )
            
            if response.status_code in [200, 201, 202]:
                print(f"✅ Email sent successfully to: {to_email}")
                return True
            else:
                print(f"❌ Brevo API Error: {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Network error sending email via Brevo: {type(e).__name__}: {e}")
            return False
        except Exception as e:
            print(f"❌ Failed to send email via Brevo: {type(e).__name__}: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    @staticmethod
    def send_user_credentials(
        email: str,
        password: str,
        full_name: str,
        role: str,
        portal_url: str
    ) -> bool:
        """Send credentials to a new user"""
        
        # Determine portal URL based on role
        base_url = portal_url.rstrip('/')
        if 'hf.space' in base_url:
             pass
        elif ':' in base_url.split('//')[-1]:
            base_url = '://'.join(base_url.split('://')[0:1]) + '://' + base_url.split('://')[1].split(':')[0]
        
        role_str = str(role.value) if hasattr(role, 'value') else str(role).upper()
        
        if role_str == "PATIENT":
            login_url = f"{base_url}:5174" if 'localhost' in base_url else base_url
            portal_name = "Patient Portal"
        else:
            login_url = f"{base_url}:5173" if 'localhost' in base_url else base_url
            portal_name = "Dental Care Portal"
        
        subject = f"Welcome to {portal_name} - Your Account Credentials"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; }}
                .container {{ max-width: 600px; margin: 40px auto; padding: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }}
                .header {{ background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 40px 20px; text-align: center; }}
                .content {{ background: white; padding: 40px; }}
                .credential-box {{ background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin: 25px 0; }}
                .button {{ display: inline-block; padding: 16px 36px; background: #2563eb; color: white; text-decoration: none; border-radius: 10px; font-weight: 700; margin: 20px 0; }}
                .footer {{ background: #f1f5f9; padding: 25px; text-align: center; color: #64748b; font-size: 13px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin:0; font-size: 28px;">Welcome to {portal_name}</h1>
                </div>
                <div class="content">
                    <p>Hello <strong>{full_name}</strong>,</p>
                    <p>Your account has been created successfully. You can secure access to the system using the following credentials:</p>
                    
                    <div class="credential-box">
                        <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <span style="color:#2563eb;">{email}</span></p>
                        <p style="margin: 0;"><strong>Password:</strong> <code style="font-size: 1.1em;">{password}</code></p>
                    </div>
                    
                    <p style="text-align: center;">
                        <a href="{login_url}" class="button" style="color: white;">Login to Dashboard</a>
                    </p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 DentoAI Diagnostics. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return EmailService.send_email(email, subject, html_content)
    
    @staticmethod
    def send_detection_report(
        to_email: str,
        patient_name: str,
        detection_id: str,
        detection_date: str,
        summary_stats: dict,
        pdf_bytes: bytes,
        cc_email: Optional[str] = None,
        clinic_name: Optional[str] = None
    ) -> bool:
        """Send detection report via Brevo with PDF attachment"""
        try:
            import base64
            html_body = EmailService._create_report_email_html(patient_name, detection_id, detection_date, summary_stats, clinic_name)
            pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')
            attachments = [{"content": pdf_base64, "name": f"Dental_Report_{detection_id}.pdf"}]
            return EmailService.send_email(
                to_email, 
                f"Diagnostic Report - {detection_id}", 
                html_body, 
                attachments,
                sender_name=clinic_name
            )
        except Exception as e:
            print(f"❌ Failed to prepare detection report: {str(e)}")
            return False
    
    @staticmethod
    def _create_report_email_html(patient_name: str, detection_id: str, detection_date: str, summary_stats: dict, clinic_name: Optional[str] = None) -> str:
        clinic_display = clinic_name or settings.HOSPITAL_NAME
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; }}
                .container {{ max-width: 600px; margin: 40px auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }}
                .header {{ background: #0f172a; color: white; padding: 30px; text-align: center; }}
                .content {{ padding: 40px; }}
                .summary {{ background: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 4px; }}
                .footer {{ background: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2 style="margin:0;">Diagnostic Report</h2>
                    <p style="margin:5px 0 0 0; opacity:0.8;">{clinic_display}</p>
                </div>
                <div class="content">
                    <p>Dear {patient_name},</p>
                    <p>Your dental screening report from <strong>{detection_date}</strong> is now available.</p>
                    <div class="summary">
                        <p style="margin:5px 0;"><strong>Teeth Analyzed:</strong> {summary_stats.get('teeth_detected', 'N/A')}</p>
                        <p style="margin:5px 0;"><strong>Findings:</strong> <span style="color:#ef4444;">{summary_stats.get('caries_found', 'N/A')}</span></p>
                    </div>
                    <p>A detailed PDF containing the full findings and AI analysis is attached.</p>
                </div>
                <div class="footer">
                    <p>Sent by {clinic_display}</p>
                </div>
            </div>
        </body>
        </html>
        """
        return html

    @staticmethod
    def send_verification_email(
        email: str,
        full_name: str,
        otp: str,
        role: str
    ) -> bool:
        """Send branded 6-digit OTP verification email via Brevo"""
        subject = "Account Activation: Your Verification Code"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; }}
                .container {{ max-width: 600px; margin: 40px auto; padding: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 25px rgba(0,0,0,0.08); background: white; }}
                .header {{ background: #2563eb; color: white; padding: 45px 20px; text-align: center; }}
                .content {{ padding: 45px; text-align: center; }}
                .otp-box {{ 
                    display: inline-block; 
                    background: #f1f5f9; 
                    border: 1px solid #e2e8f0; 
                    border-radius: 12px; 
                    padding: 20px 40px; 
                    margin: 30px 0; 
                    font-size: 36px; 
                    font-weight: 800; 
                    color: #2563eb; 
                    letter-spacing: 12px; 
                    font-family: 'Courier New', Courier, monospace;
                }}
                .feature-text {{ color: #64748b; font-size: 14px; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 25px; }}
                .footer {{ background: #f8fafc; padding: 30px; text-align: center; color: #94a3b8; font-size: 13px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin:0; font-size: 26px;">Confirm Your Email</h1>
                    <p style="margin-top:10px; opacity: 0.9;">DentoAI Diagnostics Security</p>
                </div>
                <div class="content">
                    <p style="text-align: left; font-size: 18px; color: #334155;">Hello <strong>{full_name}</strong>,</p>
                    <p style="text-align: left;">Thank you for joining DentoAI. To complete your activation and secure your clinical dashboard, please enter the 6-digit verification code below:</p>
                    
                    <div class="otp-box">{otp}</div>
                    
                    <p style="font-size: 15px; color: #475569;">This verification code will expire in <strong>10 minutes</strong>.</p>
                    
                    <div class="feature-text">
                        <p>DentoAI ensures your secure medical history is accessible only by you and your verified clinical team.</p>
                    </div>
                </div>
                <div class="footer">
                    <p>&copy; 2024 DentoAI Diagnostics. Secure Clinical Systems.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        print(f"DEBUG: Brevo OTP for {email}: {otp}")
        return EmailService.send_email(email, subject, html_content)

    @staticmethod
    def send_password_reset_email(email: str, full_name: str, token: str, role: str) -> bool:
        """Send password reset link via Brevo"""
        from ..core.config import settings
        base_url = settings.PATIENT_PORTAL_URL if role == "PATIENT" else settings.FRONTEND_URL
        reset_url = f"{base_url.rstrip('/')}/reset-password?token={token}"
        subject = "Security Alert: Password Reset Requested"
        
        html_content = f"""
        <!DOCTYPE html>
        <html><body>
            <div style="font-family: sans-serif; padding: 40px; background: #fef2f2; border-radius: 12px; text-align: center;">
                <h2 style="color:#ef4444;">Reset Your Password</h2>
                <p>Hello {full_name}, we received a request to reset your DentoAI password.</p>
                <a href="{reset_url}" style="display:inline-block; padding:16px 32px; background:#ef4444; color:white; text-decoration:none; border-radius:8px; font-weight:bold;">Reset Password</a>
            </div>
        </body></html>
        """
        return EmailService.send_email(email, subject, html_content)

    @staticmethod
    def send_admin_verification_request(admin_email: str, dentist_name: str, dentist_email: str, license_number: str, verification_url: str) -> bool:
        subject = f"Audit Required: New Practitioner - {dentist_name}"
        html_content = f"<h3>Practitioner Audit Required</h3><p>Name: {dentist_name}</p><p>License: {license_number}</p><a href='{verification_url}'>Review Practitioner</a>"
        return EmailService.send_email(admin_email, subject, html_content)
