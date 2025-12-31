# Email Service for User Management
from typing import Optional
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from ..core.config import settings
import secrets
import string

class EmailService:
    """Service for sending emails to users"""
    
    @staticmethod
    def generate_password(length: int = 12) -> str:
        """Generate a secure random password"""
        alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
        password = ''.join(secrets.choice(alphabet) for _ in range(length))
        return password
    
    @staticmethod
    def send_email(to_email: str, subject: str, html_content: str) -> bool:
        """Send an email via SMTP"""
        try:
            # Validate SMTP configuration
            if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
                print("ERROR: SMTP credentials not configured!")
                print(f"SMTP_USERNAME: {'SET' if settings.SMTP_USERNAME else 'NOT SET'}")
                print(f"SMTP_PASSWORD: {'SET' if settings.SMTP_PASSWORD else 'NOT SET'}")
                return False
            
            print(f"Attempting to send email to: {to_email}")
            print(f"SMTP Host: {settings.SMTP_HOST}:{settings.SMTP_PORT}")
            print(f"SMTP Username: {settings.SMTP_USERNAME}")
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
            msg['To'] = to_email
            
            # Attach HTML content
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            # Send email
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=30) as server:
                server.set_debuglevel(1)  # Enable debug output
                server.starttls()
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.send_message(msg)
            
            print(f"✅ Email sent successfully to: {to_email}")
            return True
        except smtplib.SMTPAuthenticationError as e:
            print(f"❌ SMTP Authentication Error: {e}")
            print("Check your SMTP_USERNAME and SMTP_PASSWORD")
            return False
        except smtplib.SMTPException as e:
            print(f"❌ SMTP Error: {e}")
            return False
        except Exception as e:
            print(f"❌ Failed to send email: {type(e).__name__}: {e}")
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
        # Remove any existing port from portal_url
        base_url = portal_url.rstrip('/')
        if ':' in base_url.split('//')[-1]:  # Check if port already exists
            base_url = '://'.join(base_url.split('://')[0:1]) + '://' + base_url.split('://')[1].split(':')[0]
        
        if role.upper() == "PATIENT":
            login_url = f"{base_url}:5174"  # Patient portal
            portal_name = "Patient Portal"
        else:
            login_url = f"{base_url}:5173"  # Dentist portal
            portal_name = "Dental Care Portal"
        
        subject = f"Welcome to {portal_name} - Your Account Credentials"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                           color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .credentials {{ background: white; padding: 20px; border-left: 4px solid #667eea; 
                               margin: 20px 0; border-radius: 5px; }}
                .button {{ display: inline-block; padding: 12px 30px; background: #667eea; 
                          color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
                .warning {{ background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; 
                           margin: 20px 0; border-radius: 5px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to {portal_name}!</h1>
                </div>
                <div class="content">
                    <p>Hello <strong>{full_name}</strong>,</p>
                    
                    <p>Your account has been created successfully. You can now access the {portal_name} 
                    using the credentials below:</p>
                    
                    <div class="credentials">
                        <p><strong>Email:</strong> {email}</p>
                        <p><strong>Password:</strong> <code>{password}</code></p>
                        <p><strong>Role:</strong> {role.title()}</p>
                    </div>
                    
                    <div class="warning">
                        <strong>⚠️ Important:</strong> Please change your password after your first login 
                        for security purposes.
                    </div>
                    
                    <p style="text-align: center;">
                        <a href="{login_url}" class="button">Login to Portal</a>
                    </p>
                    
                    <p>If you have any questions or need assistance, please contact your administrator.</p>
                    
                    <div class="footer">
                        <p>This is an automated message. Please do not reply to this email.</p>
                        <p>&copy; 2024 Dental Care System. All rights reserved.</p>
                    </div>
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
        cc_email: Optional[str] = None
    ) -> bool:
        """
        Send detection report via email with PDF attachment
        
        Args:
            to_email: Recipient email address
            patient_name: Patient's full name
            detection_id: Detection ID
            detection_date: Detection date string
            summary_stats: Dictionary with teeth_detected, caries_found, etc.
            pdf_bytes: PDF file as bytes
            cc_email: Optional CC email address
            
        Returns:
            True if email sent successfully, False otherwise
        """
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
            msg['To'] = to_email
            if cc_email:
                msg['Cc'] = cc_email
            msg['Subject'] = f"Dental Detection Report - {detection_id}"
            
            # HTML body
            html_body = EmailService._create_report_email_html(
                patient_name,
                detection_id,
                detection_date,
                summary_stats
            )
            
            msg.attach(MIMEText(html_body, 'html'))
            
            # Attach PDF
            pdf_attachment = MIMEApplication(pdf_bytes, _subtype='pdf')
            pdf_attachment.add_header(
                'Content-Disposition',
                'attachment',
                filename=f'Detection_Report_{detection_id}.pdf'
            )
            msg.attach(pdf_attachment)
            
            # Send email
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                
                recipients = [to_email]
                if cc_email:
                    recipients.append(cc_email)
                
                server.sendmail(settings.SMTP_FROM_EMAIL, recipients, msg.as_string())
            
            return True
            
        except Exception as e:
            print(f"Failed to send detection report email: {str(e)}")
            return False
    
    @staticmethod
    def _create_report_email_html(
        patient_name: str,
        detection_id: str,
        detection_date: str,
        summary_stats: dict
    ) -> str:
        """Create professional HTML email body for detection report"""
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 24px;
                }}
                .content {{
                    background: #ffffff;
                    padding: 30px;
                    border: 1px solid #e5e7eb;
                }}
                .summary-box {{
                    background: #f9fafb;
                    border-left: 4px solid #3b82f6;
                    padding: 20px;
                    margin: 20px 0;
                }}
                .summary-box h3 {{
                    margin-top: 0;
                    color: #1e40af;
                }}
                .stat-row {{
                    display: flex;
                    justify-content: space-between;
                    margin: 10px 0;
                }}
                .stat-label {{
                    font-weight: bold;
                    color: #6b7280;
                }}
                .footer {{
                    background: #f9fafb;
                    padding: 20px;
                    text-align: center;
                    border-radius: 0 0 8px 8px;
                    border: 1px solid #e5e7eb;
                    border-top: none;
                }}
                .footer p {{
                    margin: 5px 0;
                    color: #6b7280;
                    font-size: 14px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🦷 Dental Detection Report</h1>
                </div>
                
                <div class="content">
                    <p>Dear {patient_name},</p>
                    
                    <p>Please find attached your dental detection report from <strong>{detection_date}</strong>.</p>
                    
                    <div class="summary-box">
                        <h3>Summary</h3>
                        <div class="stat-row">
                            <span class="stat-label">Detection ID:</span>
                            <span>{detection_id}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Teeth Detected:</span>
                            <span>{summary_stats.get('teeth_detected', 'N/A')}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Caries Found:</span>
                            <span>{summary_stats.get('caries_found', 'N/A')}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Status:</span>
                            <span style="text-transform: uppercase;">{summary_stats.get('status', 'N/A')}</span>
                        </div>
                    </div>
                    
                    <p>The attached PDF contains detailed information about your dental examination, including AI-detected findings and recommendations.</p>
                    
                    <p>If you have any questions or concerns about your report, please don't hesitate to contact us.</p>
                    
                    <p>Best regards,<br>
                    <strong>{settings.HOSPITAL_NAME}</strong></p>
                </div>
                
                <div class="footer">
                    <p><strong>{settings.HOSPITAL_NAME}</strong></p>
                    {f'<p>{settings.HOSPITAL_ADDRESS}</p>' if settings.HOSPITAL_ADDRESS else ''}
                    {f'<p>Phone: {settings.HOSPITAL_PHONE}</p>' if settings.HOSPITAL_PHONE else ''}
                    {f'<p>Email: {settings.HOSPITAL_EMAIL}</p>' if settings.HOSPITAL_EMAIL else ''}
                </div>
            </div>
        </body>
        </html>
        """
        
        return html
