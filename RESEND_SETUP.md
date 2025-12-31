# Resend Email Service Setup Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Resend Account
1. Go to: https://resend.com/signup
2. Sign up (free - 3,000 emails/month)
3. Verify your email

### Step 2: Get API Key
1. Go to: https://resend.com/api-keys
2. Click "Create API Key"
3. Name: `Dental Caries Backend`
4. Permission: **Full Access**
5. Click "Create"
6. **Copy the API key** (starts with `re_`)

### Step 3: Update Render Environment Variables

Go to Render Dashboard → Your Service → Environment:

**Add this variable:**
```
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_FROM_NAME=Dental Care System
```

**Remove these old SMTP variables** (not needed anymore):
- ❌ SMTP_HOST
- ❌ SMTP_PORT
- ❌ SMTP_USERNAME
- ❌ SMTP_PASSWORD
- ❌ SMTP_FROM_EMAIL
- ❌ SMTP_FROM_NAME

### Step 4: Save and Redeploy

1. Click "Save Changes"
2. Wait for automatic redeploy (2-3 minutes)
3. Done!

---

## 🧪 Testing

After redeployment:

1. Go to your frontend: https://dental-caries-detection.vercel.app
2. Create a new patient user
3. Check Render logs for:
   ```
   Attempting to send email to: ...
   Using Resend API
   ✅ Email sent successfully to: ...
   ```
4. Check the email inbox - you should receive credentials!

---

## 📧 Email Limits

**Free Tier:**
- ✅ 3,000 emails/month
- ✅ 100 emails/day
- ✅ Unlimited domains
- ✅ Email analytics

**Using `onboarding@resend.dev`:**
- ✅ Good for testing
- ✅ No domain setup needed
- ⚠️ Limited to 100 emails total
- ⚠️ May go to spam

**For Production (Optional):**
1. Add your own domain in Resend
2. Update `RESEND_FROM_EMAIL` to your domain
3. Better deliverability

---

## ✅ Advantages Over SMTP

1. ✅ **Works on Render** (HTTP API, not SMTP)
2. ✅ **No network restrictions**
3. ✅ **Better deliverability** than Gmail
4. ✅ **Email analytics** included
5. ✅ **Faster** than SMTP
6. ✅ **More reliable**

---

## 🔍 Troubleshooting

### Error: "API key is invalid"
**Solution**: Check that you copied the full API key (starts with `re_`)

### Emails going to spam
**Solution**: 
- Use `onboarding@resend.dev` for testing only
- For production, add your own domain

### Error: "Daily limit exceeded"
**Solution**: Free tier has 100 emails/day limit. Upgrade or wait 24 hours.

---

## 📝 Code Changes Made

1. ✅ Replaced SMTP with Resend HTTP API in `email_service.py`
2. ✅ Updated `config.py` with Resend settings
3. ✅ Updated `.env.example` with Resend configuration
4. ✅ Removed SMTP dependencies

---

**Status**: Ready to deploy! Just add your Resend API key to Render environment variables. 🎉
