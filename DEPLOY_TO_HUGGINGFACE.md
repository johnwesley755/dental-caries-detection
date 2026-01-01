# Deploy Calendar & Notifications to Hugging Face

## 🚨 The Problem

Your Hugging Face backend is returning `405 Method Not Allowed` because the new API endpoints (`/appointments` and `/notifications`) haven't been deployed yet.

## ✅ Solution: Deploy Updated Backend

### Step 1: Navigate to Your Hugging Face Repo

```bash
cd "C:\Users\johnw\OneDrive\Desktop\GIT\hugging-face(dental caries)\dental-caries"
```

### Step 2: Copy Updated Files

```bash
# Copy the new model files
copy "C:\Users\johnw\OneDrive\Desktop\GIT\dental-caries\backend\app\models\appointment.py" app\models\appointment.py
copy "C:\Users\johnw\OneDrive\Desktop\GIT\dental-caries\backend\app\models\notification.py" app\models\notification.py

# Copy the updated patient model
copy "C:\Users\johnw\OneDrive\Desktop\GIT\dental-caries\backend\app\models\patient.py" app\models\patient.py

# Copy the new API routers
copy "C:\Users\johnw\OneDrive\Desktop\GIT\dental-caries\backend\app\api\v1\appointments.py" app\api\v1\appointments.py
copy "C:\Users\johnw\OneDrive\Desktop\GIT\dental-caries\backend\app\api\v1\notifications.py" app\api\v1\notifications.py

# Copy the updated __init__.py
copy "C:\Users\johnw\OneDrive\Desktop\GIT\dental-caries\backend\app\api\v1\__init__.py" app\api\v1\__init__.py
```

### Step 3: Commit and Push

```bash
git add .
git commit -m "Add appointments and notifications API endpoints"
git push
```

### Step 4: Wait for Deployment

- Go to your Hugging Face Space: https://huggingface.co/spaces/johnwesley756/dental-caries
- Wait for the build to complete (usually 2-5 minutes)
- Check the logs to ensure no errors

### Step 5: Verify Deployment

Visit the Swagger docs to confirm the endpoints are live:
```
https://johnwesley756-dental-caries.hf.space/docs
```

You should see:
- ✅ `GET /api/v1/appointments`
- ✅ `POST /api/v1/appointments`
- ✅ `GET /api/v1/notifications`
- ✅ `GET /api/v1/notifications/unread-count`

---

## 🔍 Troubleshooting

### If endpoints still show 405:

1. **Check Hugging Face build logs** for import errors
2. **Restart the Space** manually from the Hugging Face UI
3. **Verify the files were copied** by checking the Hugging Face repo

### If you see import errors:

Make sure these files exist in your Hugging Face repo:
- `app/models/appointment.py`
- `app/models/notification.py`
- `app/api/v1/appointments.py`
- `app/api/v1/notifications.py`

---

## ✨ After Deployment

Once deployed, your Calendar and Notification icons will work automatically! No frontend changes needed.

**Test by:**
1. Clicking the Calendar icon → Should open calendar modal
2. Clicking the Bell icon → Should show notifications dropdown
3. Creating an appointment → Should work without errors
