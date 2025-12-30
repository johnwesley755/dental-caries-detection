# Dental Caries Detection System

A comprehensive AI-powered dental caries detection system with role-based access control, patient management, and an intelligent chatbot assistant.

## 🌟 Features

### Core Features
- **AI-Powered Caries Detection**: YOLOv8-based tooth decay detection from dental X-rays
- **Role-Based Access Control**: Separate interfaces for Dentists, Admins, and Patients
- **Patient Management**: Complete patient records and detection history
- **PDF Report Generation**: Professional reports with charts and analysis
- **Intelligent Chatbot**: LLaMA 3.1-powered assistant for patients (via Groq API)
- **Image Management**: Cloudinary integration for secure image storage
- **Real-time Detection**: Instant analysis with confidence scores and severity levels

### User Roles
- **Admin**: User management, system oversight
- **Dentist**: Patient management, detection analysis, report generation
- **Patient**: View own detections, download reports, chat with AI assistant

---

## 🏗️ Architecture

```
dental-caries/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/v1/      # API endpoints
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic
│   │   └── core/        # Config, database, security
│   └── requirements.txt
├── frontend/            # React admin/dentist portal
├── patient-portal/      # React patient interface
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL 13+
- Groq API Key (free tier available)

### 1. Clone Repository
```bash
git clone <repository-url>
cd dental-caries
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings (see Configuration section)

# Run database migrations
psql -U postgres -d dental_caries -f create_chat_messages_table.sql

# Start server
uvicorn app.main:app --reload
```

Backend runs on: `http://localhost:8000`

### 3. Frontend Setup (Dentist/Admin Portal)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

### 4. Patient Portal Setup

```bash
cd patient-portal
npm install
npm run dev
```

Patient portal runs on: `http://localhost:5174`

---

## ⚙️ Configuration

### Backend `.env`

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dental_caries

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Groq API (Chatbot)
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions

# Hospital Info (for PDF reports)
HOSPITAL_NAME=Dental Care Hospital
HOSPITAL_ADDRESS=123 Main St
HOSPITAL_PHONE=+1-234-567-8900
HOSPITAL_EMAIL=info@dentalcare.com
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:8000
```

### Patient Portal `.env`

```env
VITE_API_URL=http://localhost:8000
```

---

## 🤖 Chatbot Setup

The system includes an AI chatbot for patients powered by Groq's LLaMA 3.1 model.

### Get Free Groq API Key

1. Visit: https://console.groq.com/
2. Sign up (free)
3. Navigate to "API Keys"
4. Create new API key
5. Copy key (starts with `gsk_`)
6. Add to `backend/.env`: `GROQ_API_KEY=gsk_your_key_here`

### Free Tier Limits
- **14,400 requests/day**
- **30 requests/minute**
- **500K tokens/day**

More than sufficient for most dental clinics!

### Chatbot Features
- ✅ Explains scan results in simple terms
- ✅ Answers questions about severity levels
- ✅ Provides safe dental health information
- ✅ Medical safety filters (blocks diagnosis/prescription requests)
- ✅ Automatic dentist consultation disclaimers
- ✅ Chat history storage

---

## 📊 Database Setup

### Create Database

```sql
CREATE DATABASE dental_caries;
```

### Run Migrations

```bash
cd backend
psql -U postgres -d dental_caries -f create_chat_messages_table.sql
```

### Database Schema

**Main Tables:**
- `users` - User accounts (dentists, admins, patients)
- `patients` - Patient records
- `detections` - Caries detection results
- `caries_findings` - Individual caries details
- `chat_messages` - Chatbot conversation history

---

## 🧪 Testing

### Test Chatbot API (Postman)

**1. Login**
```
POST http://localhost:8000/api/v1/auth/login/json
Body: {"email": "patient@example.com", "password": "password"}
```

**2. Send Chat Message**
```
POST http://localhost:8000/api/v1/chat/
Headers: Authorization: Bearer <your_token>
Body: {"message": "What does moderate severity mean?", "detection_id": null}
```

**3. Get Chat History**
```
GET http://localhost:8000/api/v1/chat/history?limit=10
Headers: Authorization: Bearer <your_token>
```

---

## 📁 Project Structure

```
dental-caries/
├── backend/
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── auth.py          # Authentication
│   │   │   ├── patients.py      # Patient management
│   │   │   ├── detection.py     # Caries detection
│   │   │   ├── chat.py          # Chatbot endpoints
│   │   │   └── report.py        # PDF reports
│   │   ├── models/
│   │   │   ├── user.py          # User model
│   │   │   ├── patient.py       # Patient model
│   │   │   ├── detection.py     # Detection model
│   │   │   └── chat.py          # Chat message model
│   │   ├── services/
│   │   │   ├── auth_service.py  # Auth logic
│   │   │   ├── detection_service.py  # AI detection
│   │   │   ├── chat_service.py  # Chatbot logic
│   │   │   └── report_service.py  # PDF generation
│   │   └── core/
│   │       ├── config.py        # Configuration
│   │       ├── database.py      # Database connection
│   │       └── security.py      # JWT & hashing
│   └── requirements.txt
├── frontend/                    # Dentist/Admin portal
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── contexts/
│   └── package.json
└── patient-portal/              # Patient interface
    ├── src/
    │   ├── components/
    │   │   └── chat/
    │   │       ├── ChatBot.tsx
    │   │       └── FloatingChatButton.tsx
    │   ├── pages/
    │   ├── services/
    │   │   └── chatService.ts
    │   └── contexts/
    └── package.json
```

---

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **Role-Based Access Control**: Granular permissions
- **Password Hashing**: bcrypt encryption
- **Medical Safety Filters**: Chatbot blocks unsafe queries
- **CORS Protection**: Configured allowed origins
- **SQL Injection Prevention**: SQLAlchemy ORM
- **Input Validation**: Pydantic schemas

---

## 🎨 UI Features

### Dentist/Admin Portal
- Sidebar navigation
- Patient management dashboard
- Detection analysis interface
- User management (Admin only)
- Profile settings

### Patient Portal
- Clean, modern interface
- Detection history view
- PDF report downloads
- **Floating chatbot button** (bottom-right)
- Profile management

---

## 📖 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🚨 Troubleshooting

### Chatbot Not Responding

**Error**: "I'm currently unable to respond"

**Solution**:
1. Check `GROQ_API_KEY` in `backend/.env`
2. Verify API key is valid at https://console.groq.com/
3. Restart backend: `uvicorn app.main:app --reload`
4. Check backend logs for errors

### Database Connection Error

**Solution**:
1. Verify PostgreSQL is running
2. Check `DATABASE_URL` in `.env`
3. Ensure database exists: `CREATE DATABASE dental_caries;`
4. Run migrations

### CORS Error in Frontend

**Solution**:
1. Check `ALLOWED_ORIGINS` in `backend/app/core/config.py`
2. Add your frontend URL (e.g., `http://localhost:5173`)
3. Restart backend

---

## 📦 Deployment

### Backend (Example: Heroku/Railway)

```bash
# Set environment variables
DATABASE_URL=postgresql://...
SECRET_KEY=...
GROQ_API_KEY=gsk_...
CLOUDINARY_CLOUD_NAME=...

# Deploy
git push heroku main
```

### Frontend (Example: Vercel/Netlify)

```bash
# Set environment variable
VITE_API_URL=https://your-backend-url.com

# Deploy
npm run build
# Upload dist/ folder
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Authors

- **John Wesley** - Initial work

---

## 🙏 Acknowledgments

- YOLOv8 for object detection
- Groq for LLaMA 3.1 API access
- FastAPI framework
- React ecosystem
- Cloudinary for image storage

---

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@example.com

---

**Built with ❤️ for better dental healthcare**
