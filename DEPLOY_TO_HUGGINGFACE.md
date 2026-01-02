# 🚀 Deploy Calendar & Notifications to Hugging Face

## ✅ Local Backend Fixed

The local backend import errors have been fixed. Your local server should now be running correctly.

## 🔴 Critical Issue: Hugging Face Deployment

Your Hugging Face backend is **missing the new API endpoints**. The 405 errors confirm this.

---

## 📋 Step-by-Step Deployment Guide

### Step 1: Navigate to Hugging Face Repo

```powershell
cd "C:\Users\johnw\OneDrive\Desktop\GIT\hugging-face(dental caries)\dental-caries"
```

### Step 2: Copy Updated Files

Copy these files from your main project to the Hugging Face repo:

```powershell
# Copy new model files
Copy-Item "C:\Users\johnw\OneDrive\Desktop\GIT\dental-caries\backend\app\models\appointment.py" -Destination "app\models\appointment.py"
Copy-Item "C:\Users\johnw\OneDrive\Desktop\GIT\dental-caries\backend\app\models\notification.py" -Destination "app\models\notification.py"

# Copy updated patient model (has appointments relationship)
Copy-Item "C:\Users\johnw\OneDrive\Desktop\GIT\dental-caries\backend\app\models\patient.py" -Destination "app\models\patient.py"

# Copy new API routers
Copy-Item "C:\Users\johnw\OneDrive\Desktop\GIT\dental-caries\backend\app\api\v1\appointments.py" -Destination "app\api\v1\appointments.py"
Copy-Item "C:\Users\johnw\OneDrive\Desktop\GIT\dental-caries\backend\app\api\v1\notifications.py" -Destination "app\api\v1\notifications.py"

# Copy updated __init__.py (registers the new routers)
Copy-Item "C:\Users\johnw\OneDrive\Desktop\GIT\dental-caries\backend\app\api\v1\__init__.py" -Destination "app\api\v1\__init__.py"
```

### Step 3: Verify Files Were Copied

```powershell
# Check that files exist
Test-Path "app\models\appointment.py"
Test-Path "app\models\notification.py"
Test-Path "app\api\v1\appointments.py"
Test-Path "app\api\v1\notifications.py"
```

All should return `True`.

### Step 4: Commit and Push to Hugging Face

```powershell
git add .
git commit -m "Add appointments and notifications API endpoints"
git push
```

### Step 5: Monitor Deployment

1. Go to: https://huggingface.co/spaces/johnwesley756/dental-caries
2. Click on **"Logs"** tab
3. Wait for the build to complete (2-5 minutes)
4. Look for: `Application startup complete.`

### Step 6: Verify Endpoints Are Live

Visit the Swagger docs:
```
https://johnwesley756-dental-caries.hf.space/docs
```

**You should see these new endpoints:**
- ✅ `GET /api/v1/appointments`
- ✅ `POST /api/v1/appointments`
- ✅ `GET /api/v1/appointments/{appointment_id}`
- ✅ `PUT /api/v1/appointments/{appointment_id}`
- ✅ `DELETE /api/v1/appointments/{appointment_id}`
- ✅ `GET /api/v1/notifications`
- ✅ `GET /api/v1/notifications/unread-count`
- ✅ `PUT /api/v1/notifications/{notification_id}/read`
- ✅ `POST /api/v1/notifications/mark-all-read`

---

## 🧪 Testing After Deployment

### Test 1: Check Swagger UI
1. Open https://johnwesley756-dental-caries.hf.space/docs
2. Expand `/api/v1/appointments` section
3. Click "Try it out" on `GET /api/v1/appointments`
4. Click "Execute"
5. Should return `200 OK` (not 405)

### Test 2: Frontend Calendar Icon
1. Open your frontend at http://localhost:5173
2. Click the **Calendar icon** in the sidebar
3. Calendar modal should open without errors

### Test 3: Frontend Notification Icon
1. Click the **Bell icon** in the sidebar
2. Notification dropdown should open
3. Should show "No notifications" (not an error)

---

## 🔍 Troubleshooting

### If you still see 405 errors after deployment:

**Check 1: Verify files in Hugging Face repo**
- Go to https://huggingface.co/spaces/johnwesley756/dental-caries/tree/main
- Navigate to `app/api/v1/`
- Confirm `appointments.py` and `notifications.py` exist

**Check 2: Check build logs for errors**
- Look for import errors
- Look for syntax errors
- Look for database connection issues

**Check 3: Manually restart the Space**
- Go to Space settings
- Click "Factory reboot"
- Wait for restart

### If imports fail:

The models now use the correct import:
```python
from ..core.database import Base  # ✅ Correct
# NOT: from .base import Base     # ❌ Wrong
```

---

## 📊 What Gets Fixed

Once deployed, these features will work:

1. **Calendar Modal** - View and create appointments
2. **Notification Dropdown** - See real-time notifications
3. **Appointment Management** - Full CRUD operations
4. **Notification System** - Track unread notifications

---

## ⚡ Quick Deploy Script

Save this as `deploy-to-hf.ps1`:

```powershell
# Navigate to HF repo
cd "C:\Users\johnw\OneDrive\Desktop\GIT\hugging-face(dental caries)\dental-caries"

# Copy files
$source = "C:\Users\johnw\OneDrive\Desktop\GIT\dental-caries\backend"
Copy-Item "$source\app\models\appointment.py" -Destination "app\models\appointment.py" -Force
Copy-Item "$source\app\models\notification.py" -Destination "app\models\notification.py" -Force
Copy-Item "$source\app\models\patient.py" -Destination "app\models\patient.py" -Force
Copy-Item "$source\app\api\v1\appointments.py" -Destination "app\api\v1\appointments.py" -Force
Copy-Item "$source\app\api\v1\notifications.py" -Destination "app\api\v1\notifications.py" -Force
Copy-Item "$source\app\api\v1\__init__.py" -Destination "app\api\v1\__init__.py" -Force

# Commit and push
git add .
git commit -m "Add appointments and notifications endpoints"
git push

Write-Host "✅ Deployed! Check https://huggingface.co/spaces/johnwesley756/dental-caries/logs" -ForegroundColor Green
```

Run with: `.\deploy-to-hf.ps1`

---

## 🎯 Summary

**Problem:** 405 Method Not Allowed for `/api/v1/appointments` and `/api/v1/notifications`

**Root Cause:** New endpoints not deployed to Hugging Face

**Solution:** Copy 6 files to HF repo and push

**Expected Result:** Calendar and Notifications work perfectly! 🎉
