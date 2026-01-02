# 🚀 Quick Deploy to Hugging Face

## ✅ Issue Fixed Locally

The duplicate route prefix issue has been fixed. Your local backend now has the correct endpoints:
- ✅ `/api/v1/appointments` (not `/appointments/appointments`)
- ✅ `/api/v1/notifications` (not `/notifications/notifications`)

---

## 📦 Deploy to Hugging Face

### Option 1: Quick PowerShell Script

Save this as `deploy-hf.ps1` and run it:

```powershell
# Navigate to HF repo
cd "C:\Users\johnw\OneDrive\Desktop\GIT\hugging-face(dental caries)\dental-caries"

# Copy the fixed __init__.py file
$source = "C:\Users\johnw\OneDrive\Desktop\GIT\dental-caries\backend"
Copy-Item "$source\app\api\v1\__init__.py" -Destination "app\api\v1\__init__.py" -Force

# Commit and push
git add app/api/v1/__init__.py
git commit -m "Fix duplicate route prefixes for appointments and notifications"
git push

Write-Host "✅ Deployed! Check https://huggingface.co/spaces/johnwesley756/dental-caries" -ForegroundColor Green
```

### Option 2: Manual Steps

```powershell
# 1. Navigate to HF repo
cd "C:\Users\johnw\OneDrive\Desktop\GIT\hugging-face(dental caries)\dental-caries"

# 2. Copy the fixed file
Copy-Item "C:\Users\johnw\OneDrive\Desktop\GIT\dental-caries\backend\app\api\v1\__init__.py" -Destination "app\api\v1\__init__.py" -Force

# 3. Commit
git add app/api/v1/__init__.py
git commit -m "Fix duplicate route prefixes"

# 4. Push
git push
```

---

## ⏱️ After Deployment

1. **Wait 2-5 minutes** for Hugging Face to rebuild
2. **Check logs**: https://huggingface.co/spaces/johnwesley756/dental-caries/logs
3. **Verify endpoints**: https://johnwesley756-dental-caries.hf.space/docs

You should see:
- ✅ `/api/v1/appointments` (single, not double)
- ✅ `/api/v1/notifications` (single, not double)

---

## 🧪 Test After Deployment

1. Open your frontend: http://localhost:5173
2. Click the **Calendar icon** → Should work!
3. Click the **Bell icon** → Should work!
4. No more 405 errors! 🎉

---

## 📝 What Was Fixed

**The Problem:**
- Routers defined paths like `/appointments`
- `__init__.py` added prefix `/appointments` again
- Result: `/api/v1/appointments/appointments` ❌

**The Solution:**
- Removed duplicate prefix from `__init__.py`
- Result: `/api/v1/appointments` ✅
