# Dental Caries Detection System - Complete Project Structure

> **Last Updated**: December 30, 2025  
> **Project**: Hospital Dental AI Management System with Multi-Doctor Support

---

## 📁 Project Root Structure

```
dental-caries/
├── backend/                    # FastAPI Backend Server
├── frontend/                   # React Admin/Dentist Dashboard
├── patient-portal/             # React Patient Portal
├── CLOUDINARY_SETUP.md        # Cloudinary integration guide
├── DATABASE_SETUP.md          # Database setup instructions
├── ERROR_FIXES.md             # Common errors and solutions
├── HOSPITAL_CONFIGURATION.md  # Hospital branding configuration
└── README.md                  # Main project documentation
```

---

## 🔧 Backend (FastAPI + PostgreSQL)

### Root Files
```
backend/
├── Dockerfile                          # Docker configuration
├── requirements.txt                    # Python dependencies
├── add_cloudinary_urls.sql            # Database migration SQL
└── .env                               # Environment variables (gitignored)
```

### Application Structure
```
backend/app/
├── __init__.py
├── main.py                            # FastAPI application entry point
│
├── api/                               # API Routes
│   └── v1/
│       ├── __init__.py               # Router aggregation
│       ├── admin.py                  # Admin management endpoints
│       ├── auth.py                   # Authentication endpoints
│       ├── detection.py              # Detection CRUD endpoints
│       ├── history.py                # Detection history endpoints
│       ├── patient.py                # Patient info endpoints
│       ├── patients.py               # Patient management endpoints
│       └── report.py                 # PDF report & email endpoints
│
├── core/                              # Core Configuration
│   ├── __init__.py
│   ├── config.py                     # Settings (DB, SMTP, Cloudinary, Hospital)
│   ├── database.py                   # Database connection & session
│   └── security.py                   # Password hashing, JWT tokens
│
├── dependencies/                      # Dependency Injection
│   └── auth.py                       # Auth dependencies (get_current_user, etc.)
│
├── ml/                                # Machine Learning
│   ├── __init__.py
│   ├── model_loader.py               # YOLO model loading
│   ├── predictor.py                  # Inference logic
│   ├── preprocessor.py               # Image preprocessing
│   └── postprocessor.py              # Detection post-processing
│
├── models/                            # SQLAlchemy ORM Models
│   ├── __init__.py
│   ├── caries.py                     # CariesFinding model
│   ├── detection.py                  # Detection model
│   ├── patient.py                    # Patient model
│   └── user.py                       # User model (dentist/admin)
│
├── schemas/                           # Pydantic Schemas
│   ├── __init__.py
│   ├── caries.py                     # CariesFinding schemas
│   ├── detection.py                  # Detection request/response schemas
│   ├── patient.py                    # Patient schemas
│   └── user.py                       # User & auth schemas
│
└── services/                          # Business Logic
    ├── __init__.py
    ├── auth_service.py               # User authentication & registration
    ├── cloudinary_service.py         # Cloudinary image upload
    ├── detection_service.py          # Detection processing
    ├── email_service.py              # Email sending (SMTP)
    ├── image_service.py              # Image handling & storage
    ├── report_service.py             # PDF report generation (ReportLab)
    └── report_service_chart_methods.py  # Chart methods (temporary file)
```

### Backend Dependencies (requirements.txt)
```
fastapi
uvicorn[standard]
python-multipart
python-jose[cryptography]
passlib==1.7.4
bcrypt==3.2.2
python-dotenv
sqlalchemy
psycopg2-binary
alembic
pydantic
pydantic[email]
pydantic-settings
ultralytics                    # YOLO model
opencv-python
numpy
Pillow
torch
torchvision
aiofiles
reportlab                      # PDF generation
cloudinary                     # Image hosting
matplotlib                     # Chart generation
```

---

## 💻 Frontend (React + TypeScript - Dentist/Admin Dashboard)

### Root Files
```
frontend/
├── package.json                       # NPM dependencies
├── tsconfig.json                      # TypeScript configuration
├── vite.config.ts                     # Vite bundler config
├── tailwind.config.js                 # Tailwind CSS config
├── postcss.config.js                  # PostCSS config
├── index.html                         # HTML entry point
└── .env                              # Environment variables (gitignored)
```

### Source Structure
```
frontend/src/
├── App.tsx                            # Main app component with routing
├── App.css                            # Global styles
├── main.tsx                           # React entry point
│
├── components/                        # Reusable Components
│   ├── auth/
│   │   ├── Login.tsx                 # Login form
│   │   └── Register.tsx              # Registration form
│   │
│   ├── common/
│   │   ├── Footer.tsx                # Footer component
│   │   ├── Navbar.tsx                # Top navbar (deprecated)
│   │   ├── Sidebar.tsx               # ✨ NEW: Sidebar navigation
│   │   └── ProtectedRoute.tsx        # Route protection wrapper
│   │
│   ├── detection/
│   │   ├── AnnotatedImage.tsx        # Image with AI annotations
│   │   ├── DetectionResult.tsx       # Detection results display
│   │   ├── ImageComparison.tsx       # Before/after image comparison
│   │   ├── ImageUpload.tsx           # Image upload component
│   │   ├── SeverityChart.tsx         # Severity distribution chart
│   │   └── ShareDialog.tsx           # ✨ NEW: Share/email dialog
│   │
│   ├── layout/
│   │   └── (no files - using layouts/ instead)
│   │
│   └── ui/                           # Shadcn UI Components
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── table.tsx
│       └── tabs.tsx
│
├── contexts/                          # React Context
│   ├── AuthContext.tsx               # Authentication state
│   └── DetectionContext.tsx          # Detection state
│
├── layouts/                           # Layout Components
│   └── MainLayout.tsx                # ✨ UPDATED: Sidebar-based layout
│
├── pages/                             # Page Components
│   ├── Dashboard.tsx                 # Dashboard overview
│   ├── Detection.tsx                 # New detection page
│   ├── DetectionDetails.tsx          # ✨ UPDATED: Detection details with share
│   ├── History.tsx                   # Detection history
│   ├── Home.tsx                      # Landing page
│   ├── PatientDetails.tsx            # Patient details page
│   ├── Patients.tsx                  # Patient list
│   ├── Profile.tsx                   # ✨ NEW: User profile with edit
│   └── UserManagement.tsx            # Admin user management
│
├── services/                          # API Services
│   ├── authService.ts                # Authentication API
│   ├── detectionService.ts           # Detection API
│   ├── patientService.ts             # Patient API
│   ├── reportService.ts              # ✨ NEW: PDF & email API
│   └── userService.ts                # ✨ NEW: User profile API
│
├── types/                             # TypeScript Types
│   ├── auth.types.ts                 # Auth & user types
│   ├── detection.types.ts            # Detection types
│   └── patient.types.ts              # Patient types
│
└── utils/                             # Utility Functions
    └── constants.ts                  # App constants
```

---

## 🏥 Patient Portal (React + TypeScript)

### Root Files
```
patient-portal/
├── package.json                       # NPM dependencies
├── tsconfig.json                      # TypeScript configuration
├── vite.config.ts                     # Vite bundler config
├── tailwind.config.js                 # Tailwind CSS config
├── index.html                         # HTML entry point
├── README.md                          # Patient portal docs
└── .env                              # Environment variables (gitignored)
```

### Source Structure
```
patient-portal/src/
├── App.tsx                            # ✨ UPDATED: Sidebar-based routing
├── main.tsx                           # React entry point
│
├── components/                        # Reusable Components
│   ├── common/
│   │   ├── Footer.tsx                # Footer component
│   │   ├── Navbar.tsx                # Top navbar (deprecated)
│   │   ├── Sidebar.tsx               # ✨ NEW: Patient sidebar
│   │   └── ProtectedRoute.tsx        # Route protection
│   │
│   ├── detection/
│   │   └── ImageComparison.tsx       # ✨ NEW: Image comparison
│   │
│   └── ui/                           # Shadcn UI Components
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── table.tsx
│
├── contexts/                          # React Context
│   └── AuthContext.tsx               # Patient authentication
│
├── pages/                             # Page Components
│   ├── Dashboard.tsx                 # Patient dashboard
│   ├── DetectionView.tsx             # ✨ UPDATED: Detection with download
│   ├── Home.tsx                      # Landing page
│   ├── Login.tsx                     # Patient login
│   ├── MyDetections.tsx              # Patient's detection list
│   └── Profile.tsx                   # Patient profile
│
├── services/                          # API Services
│   ├── authService.ts                # Patient authentication
│   ├── detectionService.ts           # Detection API
│   ├── patientService.ts             # Patient info API
│   ├── reportService.ts              # ✨ NEW: PDF download
│   └── userService.ts                # ✨ NEW: Profile management
│
└── types/                             # TypeScript Types
    ├── auth.types.ts                 # Auth types
    └── detection.types.ts            # Detection types
```

---

## 🔑 Key Features by Module

### Backend Features
- ✅ JWT Authentication with role-based access (Dentist, Admin, Patient)
- ✅ YOLO-based dental caries detection
- ✅ Cloudinary image storage
- ✅ PostgreSQL database with SQLAlchemy ORM
- ✅ PDF report generation with ReportLab
- ✅ Email sending with SMTP
- ✅ Severity distribution charts with Matplotlib
- ✅ Hospital branding configuration

### Frontend (Dentist/Admin) Features
- ✅ Sidebar navigation with light theme
- ✅ Detection management with AI annotations
- ✅ Patient management
- ✅ PDF report download
- ✅ Email reports to patients
- ✅ Social media sharing (WhatsApp, Email, Copy Link)
- ✅ User profile with edit capabilities
- ✅ Password change functionality
- ✅ Role-based UI (Admin sees User Management)

### Patient Portal Features
- ✅ Sidebar navigation with light theme
- ✅ View own detection reports
- ✅ Download PDF reports
- ✅ Image comparison (original vs annotated)
- ✅ Patient profile view
- ✅ Detection history

---

## 🌐 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Security
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# SMTP Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=Hospital Name

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Hospital Branding
HOSPITAL_NAME=Your Hospital Name
HOSPITAL_ADDRESS=123 Main St, City, State
HOSPITAL_PHONE=+1-234-567-8900
HOSPITAL_EMAIL=contact@hospital.com
HOSPITAL_LOGO_URL=https://your-logo-url.com/logo.png
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

### Patient Portal (.env)
```env
VITE_API_URL=http://localhost:8000
```

---

## 📊 Database Schema

### Tables
1. **users** - Dentists, Admins, Patients (auth accounts)
2. **patients** - Patient medical records
3. **detections** - AI detection results
4. **caries_findings** - Individual caries findings per detection

### Key Relationships
- User (1) → (N) Detections (as dentist)
- Patient (1) → (N) Detections
- Detection (1) → (N) CariesFindings

---

## 🚀 Recent Major Updates

### ✨ Sidebar Navigation System
- Replaced top navbar with collapsible sidebar
- Light theme design (white background, blue accents)
- Profile section in sidebar
- Implemented in both frontend and patient portal

### ✨ PDF Report Generation
- Professional PDF reports with ReportLab
- Includes original and annotated images
- Severity distribution charts
- Hospital branding
- Email delivery functionality

### ✨ Profile Management
- View and edit user profile
- Change password functionality
- Form validation
- Success/error notifications

### ✨ Cloudinary Integration
- Image upload and storage
- URL-based image access
- Public ID tracking
- Database migration for URL fields

---

## 📝 Documentation Files

- `CLOUDINARY_SETUP.md` - Cloudinary integration guide
- `DATABASE_SETUP.md` - Database setup and migration
- `ERROR_FIXES.md` - Common errors and solutions
- `HOSPITAL_CONFIGURATION.md` - Hospital branding setup
- `README.md` - Main project documentation

---

## 🔧 Technology Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL (Neon)
- **ORM**: SQLAlchemy
- **Auth**: JWT (python-jose)
- **ML**: YOLO (Ultralytics)
- **Image Storage**: Cloudinary
- **PDF**: ReportLab
- **Charts**: Matplotlib
- **Email**: SMTP (Gmail)

### Frontend
- **Framework**: React 18 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Routing**: React Router v6
- **State**: Context API
- **HTTP**: Axios
- **Notifications**: Sonner

---

**Total Files**: ~150+ source files (excluding node_modules, venv, build artifacts)  
**Lines of Code**: ~15,000+ (estimated)  
**Languages**: Python, TypeScript, SQL, CSS
