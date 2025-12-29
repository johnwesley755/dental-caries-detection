# Email Service for User Management
from typing import Optional
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
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
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
            msg['To'] = to_email
            
            # Attach HTML content
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            # Send email
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.send_message(msg)
            
            return True
        except Exception as e:
            print(f"Failed to send email: {e}")
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
