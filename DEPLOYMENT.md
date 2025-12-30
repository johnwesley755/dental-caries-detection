# Deployment Guide

Complete guide for deploying the Dental Caries Detection System.

---

## 📦 Deployment Architecture

- **Backend**: Render (Docker container)
- **Frontend (Dentist/Admin)**: Vercel
- **Patient Portal**: Vercel
- **Database**: Render PostgreSQL

---

## 🐳 Backend Deployment (Render)

### Step 1: Prepare Repository

Your repository already has:
- ✅ `Dockerfile`
- ✅ `.dockerignore`
- ✅ `render.yaml`

### Step 2: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Connect your repository

### Step 3: Create PostgreSQL Database

1. Click "New +" → "PostgreSQL"
2. Name: `dental-caries-db`
3. Database: `dental_caries`
4. User: `dental_user`
5. Region: Choose closest to you
6. Plan: **Free** (for testing) or **Starter** (for production)
7. Click "Create Database"
8. **Copy the Internal Database URL** (starts with `postgresql://`)

### Step 4: Create Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `dental-caries-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `./Dockerfile`
   - **Plan**: **Free** (for testing) or **Starter** ($7/month)

### Step 5: Add Environment Variables

In Render dashboard, add these environment variables:

```
DATABASE_URL=<your-internal-database-url>
SECRET_KEY=<generate-random-string>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Groq API
GROQ_API_KEY=gsk_your_groq_api_key
GROQ_MODEL=llama-3.1-8b-instant
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Hospital Info
HOSPITAL_NAME=Dental Care Hospital
HOSPITAL_ADDRESS=123 Main St
HOSPITAL_PHONE=+1-234-567-8900
HOSPITAL_EMAIL=info@dentalcare.com
```

### Step 6: Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your backend will be live at: `https://dental-caries-backend.onrender.com`

### Step 7: Run Database Migrations

1. Go to your database in Render
2. Click "Connect" → "External Connection"
3. Use the connection string with psql:

```bash
psql <external-database-url>
```

4. Run migrations:

```sql
-- Copy and paste contents of database/create_chat_messages_table.sql
```

---

## ▲ Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

Your repository already has:
- ✅ `frontend/vercel.json`
- ✅ Build configuration

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Add Environment Variable

```
VITE_API_URL=https://dental-caries-backend.onrender.com
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Your frontend will be live at: `https://your-frontend.vercel.app`

---

## 🏥 Patient Portal Deployment (Vercel)

### Step 1: Deploy to Vercel

1. In Vercel, click "Add New" → "Project"
2. Import the same repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `patient-portal`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2: Add Environment Variable

```
VITE_API_URL=https://dental-caries-backend.onrender.com
```

### Step 3: Deploy

1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Your patient portal will be live at: `https://your-patient-portal.vercel.app`

---

## 🔧 Post-Deployment Configuration

### Update CORS in Backend

After deployment, update `backend/app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend.vercel.app",
        "https://your-patient-portal.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Commit and push to trigger redeployment.

---

## ✅ Verification Checklist

### Backend
- [ ] Backend is accessible at Render URL
- [ ] Health check works: `https://your-backend.onrender.com/health`
- [ ] API docs accessible: `https://your-backend.onrender.com/docs`
- [ ] Database connected (no errors in logs)
- [ ] Environment variables set correctly

### Frontend
- [ ] Frontend loads at Vercel URL
- [ ] Can login as dentist/admin
- [ ] Can view patients
- [ ] Can perform detections
- [ ] Can generate PDF reports

### Patient Portal
- [ ] Patient portal loads at Vercel URL
- [ ] Can login as patient
- [ ] Can view detections
- [ ] Chatbot button appears
- [ ] Chatbot responds to messages
- [ ] Can download PDF reports

---

## 🚨 Troubleshooting

### Backend Won't Start

**Check Render Logs**:
1. Go to Render dashboard
2. Click your service
3. View "Logs" tab
4. Look for errors

**Common Issues**:
- Missing environment variables
- Database connection failed
- Model download timeout

**Solutions**:
- Verify all env vars are set
- Check DATABASE_URL is correct
- Increase timeout in Render settings

### Frontend Can't Connect to Backend

**Check CORS**:
1. Open browser console
2. Look for CORS errors
3. Update `allow_origins` in backend
4. Redeploy backend

### Chatbot Not Working

**Check**:
1. GROQ_API_KEY is set in Render
2. API key is valid at https://console.groq.com/
3. Backend logs show Groq API calls
4. No rate limit errors

---

## 💰 Cost Breakdown

### Free Tier (Testing)
- **Render Backend**: Free (with sleep after inactivity)
- **Render PostgreSQL**: Free (limited storage)
- **Vercel Frontend**: Free
- **Vercel Patient Portal**: Free
- **Groq API**: Free (14,400 requests/day)
- **Total**: $0/month

### Production (Recommended)
- **Render Backend**: $7/month (Starter)
- **Render PostgreSQL**: $7/month (Starter)
- **Vercel Frontend**: Free (or $20/month Pro)
- **Vercel Patient Portal**: Free (or $20/month Pro)
- **Groq API**: Free (sufficient for most clinics)
- **Total**: $14-54/month

---

## 🔄 Continuous Deployment

Both Render and Vercel support automatic deployments:

1. **Push to GitHub** → Automatic deployment
2. **Pull Request** → Preview deployment
3. **Merge to main** → Production deployment

---

## 📊 Monitoring

### Render
- View logs in real-time
- Monitor CPU/Memory usage
- Set up alerts

### Vercel
- View deployment logs
- Monitor build times
- Analytics dashboard

---

## 🔐 Security Checklist

- [ ] Change default SECRET_KEY
- [ ] Use strong database password
- [ ] Enable HTTPS (automatic on Render/Vercel)
- [ ] Restrict CORS to specific domains
- [ ] Rotate API keys regularly
- [ ] Enable database backups (Render)
- [ ] Set up monitoring alerts

---

## 📝 Environment Variables Reference

### Backend (Render)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| DATABASE_URL | ✅ | postgresql://... | PostgreSQL connection string |
| SECRET_KEY | ✅ | random-string-here | JWT secret key |
| GROQ_API_KEY | ✅ | gsk_... | Groq API key for chatbot |
| CLOUDINARY_CLOUD_NAME | ✅ | your-cloud | Cloudinary cloud name |
| CLOUDINARY_API_KEY | ✅ | 123456789 | Cloudinary API key |
| CLOUDINARY_API_SECRET | ✅ | abc123... | Cloudinary API secret |
| ALGORITHM | ❌ | HS256 | JWT algorithm (default: HS256) |
| ACCESS_TOKEN_EXPIRE_MINUTES | ❌ | 30 | Token expiry (default: 30) |
| GROQ_MODEL | ❌ | llama-3.1-8b-instant | Groq model name |

### Frontend (Vercel)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| VITE_API_URL | ✅ | https://your-backend.onrender.com | Backend API URL |

### Patient Portal (Vercel)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| VITE_API_URL | ✅ | https://your-backend.onrender.com | Backend API URL |

---

## 🎯 Quick Deploy Commands

### Test Locally with Docker

```bash
# Build and run with docker-compose
docker-compose up --build

# Access:
# Backend: http://localhost:8000
# Database: localhost:5432
```

### Deploy to Production

```bash
# 1. Commit changes
git add .
git commit -m "Deploy to production"
git push origin main

# 2. Deployments happen automatically!
# - Render: Deploys backend
# - Vercel: Deploys frontend and patient portal
```

---

**🎉 Your application is now live and ready for production!**
