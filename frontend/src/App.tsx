import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { DetectionProvider } from './contexts/DetectionContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import VerifyEmail from './components/auth/VerifyEmail';
import { Home } from './pages/Home';

import { Dashboard } from './pages/Dashboard';
import { Detection } from './pages/Detection';
import { DetectionDetails } from './pages/DetectionDetails';
import { History } from './pages/History';
import { Schedules } from './pages/Schedules';
import { PatientDetails } from './pages/PatientDetails';
import { Profile } from './pages/Profile';
import { Patients } from './pages/Patients';
import { UserManagement } from './pages/UserManagement';
import { Messages } from './pages/Messages';
import { Guidelines } from './pages/Guidelines';
import VerificationDashboard from './pages/VerificationDashboard';
import { PendingVerification } from './pages/PendingVerification';

import MainLayout from './layouts/MainLayout';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <DetectionProvider>
        <Router>
          <Routes>

            {/* 🌍 Public Routes (NO Navbar / Footer) */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* 🔐 Protected Routes (WITH Navbar / Footer) */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/detection" element={<Detection />} />
              <Route path="/detection/:id" element={<DetectionDetails />} />
              <Route path="/history" element={<History />} />
              <Route path="/schedules" element={<Schedules />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/patients/:id" element={<PatientDetails />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/guidelines" element={<Guidelines />} />
              <Route path="/verifications" element={<VerificationDashboard />} />
              <Route path="/pending-verification" element={<PendingVerification />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>

          <Toaster position="top-right" richColors />
        </Router>
      </DetectionProvider>
    </AuthProvider>
  );
}

export default App;
