import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { DetectionProvider } from './contexts/DetectionContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

import Login from './components/auth/Login';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Detection } from './pages/Detection';
import { History } from './pages/History';
import { PatientDetails } from './pages/PatientDetails';
import { Profile } from './pages/Profile';
import { Patients } from './pages/Patients';
import { UserManagement } from './pages/UserManagement';

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
              <Route path="/detection/:id" element={<Detection />} />
              <Route path="/history" element={<History />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/patients/:id" element={<PatientDetails />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/profile" element={<Profile />} />
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
