# Database Setup Guide - Neon PostgreSQL

## ✅ Current Status

Your backend is **correctly configured** for PostgreSQL and is compatible with Neon PostgreSQL!

## Configuration Details

### 1. Backend Configuration

Your backend is already set up with:

- **SQLAlchemy ORM** - For database operations
- **psycopg2-binary** - PostgreSQL adapter (in `requirements.txt`)
- **Pydantic Settings** - For environment configuration
- **Database URL** - Loaded from `.env` file

### 2. Required Files

#### [config.py](file:///c:/Users/johnw/OneDrive/Desktop/GIT/dental-caries/backend/app/core/config.py)
```python
class Settings(BaseSettings):
    DATABASE_URL: str  # Loaded from .env
    # ... other settings
```

#### [database.py](file:///c:/Users/johnw/OneDrive/Desktop/GIT/dental-caries/backend/app/core/database.py)
```python
engine = create_engine(settings.DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```

---

## Setting Up Neon PostgreSQL

### Step 1: Get Your Neon Connection String

1. Go to [Neon Console](https://console.neon.tech/)
2. Select your project
3. Go to **Dashboard** → **Connection Details**
4. Copy the connection string (it looks like this):

```
postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
```

### Step 2: Configure Backend Environment

Create or update `backend/.env` file:

```env
# Database Configuration (Neon PostgreSQL)
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require

# Security
SECRET_KEY=your-secret-key-here-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Model Configuration
MODEL_PATH=models/best.pt
CONFIDENCE_THRESHOLD=0.25
IOU_THRESHOLD=0.45

# Paths
UPLOAD_DIR=uploads
RESULTS_DIR=results

# Server
HOST=0.0.0.0
PORT=8000
```

> **Important**: Replace the `DATABASE_URL` with your actual Neon connection string!

### Step 3: Initialize Database Tables

You have two options:

#### Option A: Using SQLAlchemy (Recommended)

Run the test script to create tables:

```bash
cd backend
python test_db_connection.py
```

This will:
- ✓ Test the connection
- ✓ Check existing tables
- ✓ Create missing tables
- ✓ Verify CRUD operations

#### Option B: Using SQL Script

If you prefer to use the SQL script directly in Neon:

1. Go to Neon Console → **SQL Editor**
2. Copy the contents of `database/init.sql`
3. **Remove lines 1-5** (CREATE DATABASE and \\c commands - Neon manages this)
4. Run the modified script

---

## Database Schema

Your database has 5 main tables:

### 1. **users**
- Stores dentist, admin, and assistant accounts
- Fields: id, email, password_hash, full_name, role, is_active
- Default admin: `admin@dentalcare.com` / `admin123`

### 2. **patients**
- Patient records
- Fields: id, patient_id, full_name, age, gender, contact, email, address, medical_history

### 3. **detections**
- Detection records
- Fields: id, detection_id, patient_id, dentist_id, image paths, stats, status

### 4. **caries_findings**
- Individual caries detected
- Fields: id, detection_id, tooth_number, caries_type, severity, confidence, bounding_box

### 5. **detection_history**
- Audit trail
- Fields: id, patient_id, detection_id, action, performed_by, timestamp, changes

---

## Verifying the Setup

### 1. Test Database Connection

```bash
cd backend
python test_db_connection.py
```

Expected output:
```
✓ Connected to PostgreSQL!
✓ Using Neon PostgreSQL
✓ All required tables exist!
✓ Users in database: 1
✓ Patients in database: 0
✓ Detections in database: 0
✅ DATABASE TEST COMPLETED SUCCESSFULLY!
```

### 2. Start Backend Server

```bash
cd backend
uvicorn app.main:app --reload
```

Visit: http://localhost:8000/docs to see the API documentation

### 3. Test API Endpoints

Try the health check:
```bash
curl http://localhost:8000/
```

Try login with default admin:
```bash
curl -X POST http://localhost:8000/api/v1/auth/login/json \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dentalcare.com","password":"admin123"}'
```

---

## Common Issues & Solutions

### Issue 1: Connection Timeout

**Error**: `could not connect to server`

**Solution**:
- Check if your Neon database is active (not suspended)
- Verify the connection string is correct
- Ensure `sslmode=require` is in the URL

### Issue 2: SSL Error

**Error**: `SSL connection required`

**Solution**:
Add `?sslmode=require` to your DATABASE_URL:
```
postgresql://user:pass@host/db?sslmode=require
```

### Issue 3: Tables Not Created

**Error**: `relation "users" does not exist`

**Solution**:
Run the database initialization:
```bash
python test_db_connection.py
```

### Issue 4: Import Errors

**Error**: `ModuleNotFoundError: No module named 'psycopg2'`

**Solution**:
Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

---

## Neon-Specific Features

### 1. Connection Pooling

Neon supports connection pooling. For production, use:

```python
# In database.py
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True  # Verify connections before using
)
```

### 2. Branching (Optional)

Neon supports database branching for development:

1. Create a branch in Neon Console
2. Get the branch connection string
3. Use it in your development `.env`

### 3. Auto-Suspend

Neon databases auto-suspend after inactivity. The first request after suspension may be slower (cold start).

---

## Production Checklist

Before deploying to production:

- [ ] Change `SECRET_KEY` to a strong random value
- [ ] Use environment variables (don't commit `.env`)
- [ ] Enable connection pooling
- [ ] Set up database backups in Neon
- [ ] Configure CORS origins for your frontend domain
- [ ] Use a production-grade WSGI server (gunicorn)
- [ ] Enable SSL/TLS for API endpoints
- [ ] Set up monitoring and logging

---

## Next Steps

1. **Test the connection**: Run `python test_db_connection.py`
2. **Start the backend**: Run `uvicorn app.main:app --reload`
3. **Start the frontend**: Run `npm run dev` in frontend directory
4. **Test the full stack**: Register a user, add a patient, upload an image

---

## Support Resources

- **Neon Documentation**: https://neon.tech/docs
- **SQLAlchemy Docs**: https://docs.sqlalchemy.org/
- **FastAPI Docs**: https://fastapi.tiangolo.com/

Your database is ready to use! 🎉
