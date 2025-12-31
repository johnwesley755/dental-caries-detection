# EmailJS Setup Guide for Frontend Email Sending

## 🚀 Quick Setup (10 Minutes)

EmailJS allows you to send emails directly from the frontend without needing a backend email service!

---

## Step 1: Create EmailJS Account

1. Go to: https://www.emailjs.com/
2. Click "Sign Up" (free tier: 200 emails/month)
3. Verify your email address

---

## Step 2: Add Email Service

1. Go to **Email Services** in the dashboard
2. Click "Add New Service"
3. Choose your email provider:
   - **Gmail** (recommended for testing)
   - Outlook
   - Yahoo
   - Or any custom SMTP

### For Gmail:
1. Select "Gmail"
2. Click "Connect Account"
3. Sign in with your Gmail
4. Allow EmailJS permissions
5. Copy the **Service ID** (e.g., `service_abc123`)

---

## Step 3: Create Email Template

1. Go to **Email Templates**
2. Click "Create New Template"
3. Use this template:

### Template Settings:
- **Template Name**: `Patient Credentials`
- **Subject**: `Welcome to Dental Care - Your Login Credentials`

### Template Content (HTML):
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                   color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .credentials { background: white; padding: 20px; border-left: 4px solid #667eea; 
                       margin: 20px 0; border-radius: 5px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; 
                  color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; 
                   margin: 20px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to {{portal_name}}!</h1>
        </div>
        <div class="content">
            <p>Hello <strong>{{to_name}}</strong>,</p>
            
            <p>Your account has been created successfully. You can now access the {{portal_name}} 
            using the credentials below:</p>
            
            <div class="credentials">
                <p><strong>Email:</strong> {{user_email}}</p>
                <p><strong>Password:</strong> <code>{{user_password}}</code></p>
                <p><strong>Role:</strong> {{user_role}}</p>
            </div>
            
            <div class="warning">
                <strong>⚠️ Important:</strong> Please change your password after your first login 
                for security purposes.
            </div>
            
            <p style="text-align: center;">
                <a href="{{portal_url}}" class="button">Login to Portal</a>
            </p>
            
            <p>If you have any questions or need assistance, please contact your administrator.</p>
            
            <p style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
                This is an automated message. Please do not reply to this email.<br>
                © 2024 Dental Care System. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
```

4. Click "Save"
5. Copy the **Template ID** (e.g., `template_xyz789`)

---

## Step 4: Get Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `AbCdEfGhIjKlMnOp`)
3. Copy it

---

## Step 5: Configure Frontend

### Update `.env` file:
```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=AbCdEfGhIjKlMnOp
VITE_API_URL=http://localhost:8000
```

### For Production (Vercel):
Add the same variables in Vercel → Settings → Environment Variables

---

## Step 6: Test It!

1. Start your frontend: `npm run dev`
2. Login as admin
3. Go to "User Management"
4. Click "Add User"
5. Fill in details with a real email
6. Check "Send login credentials via email"
7. Click "Create User"
8. Check the email inbox!

---

## 🎯 Template Variables

Make sure your EmailJS template uses these variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{to_email}}` | Recipient email | john@example.com |
| `{{to_name}}` | Recipient name | John Doe |
| `{{user_email}}` | Login email | john@example.com |
| `{{user_password}}` | Generated password | Abc123!@# |
| `{{user_role}}` | User role | PATIENT |
| `{{portal_url}}` | Portal login URL | http://localhost:5174 |
| `{{portal_name}}` | Portal name | Patient Portal |

---

## 🔧 Troubleshooting

### Emails not sending?
1. Check browser console for errors
2. Verify all 3 environment variables are set
3. Check EmailJS dashboard for quota (200/month free)

### Emails going to spam?
1. Use a verified email service (Gmail recommended)
2. Ask recipients to check spam folder
3. For production, use a custom domain

### Wrong portal URL?
- Local: Uses `http://localhost:5174`
- Production: Uses `https://dental-caries-detection-patients.vercel.app`

---

## ✅ Benefits of EmailJS

1. ✅ **No backend email service needed**
2. ✅ **Works on Render** (no SMTP restrictions)
3. ✅ **Free tier**: 200 emails/month
4. ✅ **Easy setup**: 10 minutes
5. ✅ **Reliable**: 99.9% uptime
6. ✅ **Frontend-only**: No server configuration

---

**Status**: Ready to send emails from the frontend! 🎉
