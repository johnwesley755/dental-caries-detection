// patient-portal/src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import Sidebar from './components/common/Sidebar';
import { TopNavBar } from './components/common/TopNavBar';
import { FloatingChatButton } from './components/chat/FloatingChatButton';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { MyDetections } from './pages/MyDetections';
import { DetectionView } from './pages/DetectionView';
import { Profile } from './pages/Profile';
import { Appointments } from './pages/Appointments';
import { HealthTracker } from './pages/HealthTracker';
import { Resources } from './pages/Resources';
import { Messages } from './pages/Messages';
import { NewDetection } from './pages/NewDetection';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { VerifyEmail } from './pages/VerifyEmail';

// Layout component for authenticated routes
const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Controlled by state for mobile/desktop */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Navigation Bar - Clinical Standard with Notifications */}
        <TopNavBar onMenuClick={() => setIsMobileMenuOpen(true)} />

        {/* Global Pattern Overlay for Premium Feel */}
        <div className="absolute inset-x-0 bottom-0 top-20 bg-white/40 pattern-grid-lg opacity-10 pointer-events-none" />

        {/* Scrollable Content View */}
        <main className="flex-1 overflow-auto relative z-10">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Floating Chat Button */}
      <FloatingChatButton />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Protected Routes with Sidebar */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Dashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/detections"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <MyDetections />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/detection/:id"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <DetectionView />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Profile />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Appointments />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/health"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <HealthTracker />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Resources />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Messages />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/new-detection"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <NewDetection />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
