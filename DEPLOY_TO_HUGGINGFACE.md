# 🚀 Deploy Calendar & Notifications to Hugging Face

## ✅ All Issues Fixed Locally

Your local backend is now fully working with all fixes applied:
1. ✅ Duplicate route prefixes removed
2. ✅ Model imports corrected
3. ✅ Enum constraints fixed (appointments & notifications)

---

## 📦 Deploy to Hugging Face

### Option 1: PowerShell Script (Recommended)

Save as `deploy-hf.ps1` and run:

```powershell
# Navigate to HF repo
cd "C:\Users\johnw\OneDrive\Desktop\GIT\hugging-face(dental caries)\dental-caries"

# Copy all fixed files
$source = "C:\Users\johnw\OneDrive\Desktop\GIT\dental-caries\backend"
Copy-Item "$source\app\api\v1\__init__.py" -Destination "app\api\v1\__init__.py" -Force
Copy-Item "$source\app\models\appointment.py" -Destination "app\models\appointment.py" -Force
Copy-Item "$source\app\models\notification.py" -Destination "app\models\notification.py" -Force

# Commit and push
git add .
git commit -m "Fix calendar and notifications: routes, imports, and enums"
git push

Write-Host "✅ Deployed! Monitor: https://huggingface.co/spaces/johnwesley756/dental-caries/logs" -ForegroundColor Green
```

### Option 2: Manual Commands

```powershell
cd "C:\Users\johnw\OneDrive\Desktop\GIT\hugging-face(dental caries)\dental-caries"

# Copy files one by one
Copy-Item "C:\Users\johnw\OneDrive\Desktop\GIT\dental-caries\backend\app\api\v1\__init__.py" -Destination "app\api\v1\__init__.py" -Force
Copy-Item "C:\Users\johnw\OneDrive\Desktop\GIT\dental-caries\backend\app\models\appointment.py" -Destination "app\models\appointment.py" -Force
Copy-Item "C:\Users\johnw\OneDrive\Desktop\GIT\dental-caries\backend\app\models\notification.py" -Destination "app\models\notification.py" -Force

# Commit
git add .
git commit -m "Fix calendar and notifications"
git push
```

---

## ⏱️ After Deployment

1. **Wait 2-5 minutes** for Hugging Face to rebuild
2. **Monitor logs**: https://huggingface.co/spaces/johnwesley756/dental-caries/logs
3. **Look for**: `Application startup complete.`

---

## 🧪 Verify Deployment

### Step 1: Check Swagger Docs
Visit: https://johnwesley756-dental-caries.hf.space/docs

**Should see:**
- ✅ `GET /api/v1/appointments` (single path, not double)
- ✅ `POST /api/v1/appointments`
- ✅ `GET /api/v1/notifications`
- ✅ `GET /api/v1/notifications/unread-count`

### Step 2: Test Frontend
1. Open: http://localhost:5173
2. Click **Calendar icon** → Should open modal
3. Create appointment → Should succeed (200 OK)
4. Click **Bell icon** → Should show notifications

---

## 🎉 What Gets Fixed

| Feature | Before | After |
|---------|--------|-------|
| Calendar Modal | 405 Error | ✅ Works |
| Create Appointment | 500 Error | ✅ Works |
| Notifications | 405 Error | ✅ Works |
| Notification Badge | Not working | ✅ Shows count |

---

## 🔍 Troubleshooting

### If you still see errors:

**Check 1: Verify files copied**
```powershell
cd "C:\Users\johnw\OneDrive\Desktop\GIT\hugging-face(dental caries)\dental-caries"
Get-Content app\api\v1\__init__.py | Select-String "appointments_router"
```
Should show: `api_router.include_router(appointments_router, tags=["appointments"])`
(NO `prefix="/appointments"`)

**Check 2: Check HF logs**
Look for import errors or startup failures

**Check 3: Force restart**
Go to Space settings → Factory reboot

---

## 📝 Files Being Deployed

1. **`app/api/v1/__init__.py`** - Fixed duplicate prefixes
2. **`app/models/appointment.py`** - Fixed import + enum
3. **`app/models/notification.py`** - Fixed import + enum

All three files must be deployed together for everything to work.
