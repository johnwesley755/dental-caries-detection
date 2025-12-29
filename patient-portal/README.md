# Patient Portal - Dental Caries Detection System

A patient-facing web portal for viewing dental scan results and managing personal health information.

## Features

- 🔐 Secure patient login
- 📊 View dental scan results
- 📈 Track dental health over time
- 👤 Manage profile information
- 📱 Mobile-responsive design

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Radix UI
- **Routing**: React Router DOM
- **State**: React Context API
- **HTTP Client**: Axios
- **Charts**: Recharts

## Setup Instructions

### 1. Install Dependencies

```bash
cd patient-portal
npm install
```

### 2. Configure Environment

Create a `.env` file in the `patient-portal` directory:

```env
VITE_API_URL=http://localhost:8000
```

### 3. Start Development Server

```bash
npm run dev
```

The patient portal will run on **http://localhost:5174**

## Project Structure

```
patient-portal/
├── src/
│   ├── components/
│   │   ├── common/          # Navbar, Footer, ProtectedRoute
│   │   └── ui/              # Radix UI components
│   ├── contexts/
│   │   └── AuthContext.tsx  # Authentication state
│   ├── pages/
│   │   ├── Home.tsx         # Landing page
│   │   ├── Login.tsx        # Patient login
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── MyDetections.tsx # List of scans
│   │   ├── DetectionView.tsx # Scan details
│   │   └── Profile.tsx      # Patient profile
│   ├── services/
│   │   ├── api.ts           # Axios instance
│   │   ├── authService.ts   # Auth API calls
│   │   └── patientService.ts # Patient API calls
│   ├── types/
│   │   ├── auth.types.ts    # Auth types
│   │   └── detection.types.ts # Detection types
│   ├── App.tsx              # Main app with routing
│   └── main.tsx             # Entry point
├── package.json
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server (port 5174)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The patient portal connects to the same backend as the dentist portal:

- **Backend URL**: http://localhost:8000
- **API Endpoints**:
  - `POST /api/v1/auth/login/json` - Patient login
  - `GET /api/v1/patient/me` - Get patient info
  - `GET /api/v1/patient/detections` - Get patient's scans
  - `GET /api/v1/patient/detection/{id}` - Get scan details

## User Roles

Only users with the `PATIENT` role can access this portal.

## Development Notes

- The portal runs on port **5174** (different from dentist portal on 5173)
- Uses the same backend API at port **8000**
- Shares the same database
- Patient authentication is separate from dentist authentication

## Production Build

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

## Security

- All routes except Home and Login are protected
- JWT tokens stored in localStorage
- Automatic logout on 401 responses
- Patients can only access their own data

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary - Dental Care System
