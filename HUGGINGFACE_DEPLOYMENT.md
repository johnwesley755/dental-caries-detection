# Hugging Face Spaces Deployment Guide

## 🚀 Deploy FastAPI Backend to Hugging Face Spaces

Hugging Face Spaces provides **FREE** hosting for Docker applications with better performance than Render's free tier!

---

## **Step 1: Create Hugging Face Account**

1. Go to: https://huggingface.co/join
2. Sign up (free)
3. Verify your email

---

## **Step 2: Create New Space**

1. Go to: https://huggingface.co/new-space
2. Fill in details:
   - **Space name**: `dental-caries-api`
   - **License**: MIT
   - **SDK**: Docker
   - **Hardware**: CPU basic (free)
   - **Visibility**: Public (or Private if you have Pro)

3. Click "Create Space"

---

## **Step 3: Upload Backend Files**

### **Option A: Git Push (Recommended)**

```bash
# Navigate to backend directory
cd backend

# Initialize git (if not already)
git init

# Add Hugging Face remote
git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/dental-caries-api

# Add files
git add .

# Commit
git commit -m "Initial deployment"

# Push to Hugging Face
git push hf main
```

### **Option B: Web Upload**

1. Go to your Space's "Files" tab
2. Click "Add file" → "Upload files"
3. Upload all backend files:
   - `Dockerfile`
   - `requirements.txt`
   - `app/` folder
   - `README.md`
   - `.dockerignore`

---

## **Step 4: Configure Environment Variables (Secrets)**

1. Go to your Space → **Settings** tab
2. Scroll to **Repository secrets**
3. Add the following secrets:

### **Required Secrets:**

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### **Optional Secrets (if using features):**

```
# Cloudinary (for image storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Groq (for chatbot)
GROQ_API_KEY=your_groq_api_key

# Model configuration
MODEL_PATH=models/best.pt
CONFIDENCE_THRESHOLD=0.25
IOU_THRESHOLD=0.45
```

### **How to Add Secrets:**
1. Click "New secret"
2. Name: `DATABASE_URL`
3. Value: `your-database-url`
4. Click "Save"
5. Repeat for all secrets

---

## **Step 5: Database Setup**

### **Option A: Supabase (Free PostgreSQL)**

1. Go to: https://supabase.com/
2. Create new project
3. Get connection string from Settings → Database
4. Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`
5. Add as `DATABASE_URL` secret

### **Option B: Neon (Free PostgreSQL)**

1. Go to: https://neon.tech/
2. Create new project
3. Copy connection string
4. Add as `DATABASE_URL` secret

---

## **Step 6: Deploy & Monitor**

1. After pushing files, Hugging Face will automatically build
2. Check **Logs** tab for build progress
3. Wait 5-10 minutes for first build
4. Your API will be available at:
   ```
   https://YOUR_USERNAME-dental-caries-api.hf.space
   ```

---

## **Step 7: Update Frontend**

Update your frontend `.env` files:

### **Frontend `.env`:**
```env
VITE_API_URL=https://YOUR_USERNAME-dental-caries-api.hf.space
```

### **Patient Portal `.env`:**
```env
VITE_API_URL=https://YOUR_USERNAME-dental-caries-api.hf.space
```

### **Update CORS in Backend:**

Add your Hugging Face URL to `ALLOWED_ORIGINS` in backend `.env`:
```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,https://dental-caries-detection.vercel.app,https://dental-caries-detection-patients.vercel.app,https://YOUR_USERNAME-dental-caries-api.hf.space
```

---

## **Step 8: Test Your API**

1. Visit: `https://YOUR_USERNAME-dental-caries-api.hf.space/docs`
2. You should see Swagger UI
3. Test the `/health` endpoint
4. Try authentication endpoints

---

## **📊 Comparison: Render vs Hugging Face**

| Feature | Render Free | Hugging Face Free |
|---------|-------------|-------------------|
| **RAM** | 512MB | 16GB |
| **CPU** | Shared | 2 vCPU |
| **Build Time** | 5-10 min | 5-10 min |
| **Cold Start** | Yes (15s) | Yes (30s) |
| **Uptime** | Sleeps after 15min | Always on |
| **SMTP** | ❌ Blocked | ✅ Works |
| **Speed** | Slow | Fast |
| **Storage** | Ephemeral | Ephemeral |

---

## **🔧 Troubleshooting**

### **Build Fails:**
- Check Logs tab for errors
- Ensure all dependencies in `requirements.txt`
- Verify Dockerfile syntax

### **App Crashes:**
- Check Runtime logs
- Verify all environment variables are set
- Check database connection

### **Slow Performance:**
- Upgrade to GPU space (paid)
- Optimize model loading (lazy loading)
- Use smaller YOLOv8 model (nano instead of medium)

### **Port Issues:**
- Hugging Face uses port 7860 by default
- Dockerfile is already configured correctly

---

## **🎯 Production Checklist**

- [ ] All secrets configured
- [ ] Database connected and tables created
- [ ] Model file uploaded or accessible
- [ ] CORS origins updated
- [ ] Frontend URLs updated
- [ ] API tested via `/docs`
- [ ] Health check working
- [ ] Authentication working
- [ ] Image upload working

---

## **📝 File Structure for Hugging Face**

```
backend/
├── Dockerfile              # Docker configuration
├── .dockerignore          # Files to exclude from Docker
├── README.md              # Hugging Face Space description
├── requirements.txt       # Python dependencies
├── app/                   # FastAPI application
│   ├── main.py
│   ├── api/
│   ├── core/
│   ├── models/
│   ├── schemas/
│   └── services/
└── models/                # YOLOv8 model (optional)
    └── best.pt
```

---

## **🚀 Quick Deploy Command**

```bash
# One-command deploy
cd backend
git init
git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/dental-caries-api
git add .
git commit -m "Deploy to Hugging Face"
git push hf main
```

---

## **💡 Tips**

1. **Use Supabase for database** - Free PostgreSQL with good performance
2. **Enable lazy model loading** - Already configured in your code
3. **Monitor logs** - Check for memory issues
4. **Use secrets** - Never commit sensitive data
5. **Test locally first** - Use `docker build` and `docker run`

---

**Your API will be live at:**
```
https://YOUR_USERNAME-dental-caries-api.hf.space
```

**API Docs:**
```
https://YOUR_USERNAME-dental-caries-api.hf.space/docs
```

---

**Need help?** Check Hugging Face Spaces documentation: https://huggingface.co/docs/hub/spaces
