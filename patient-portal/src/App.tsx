// patient-portal/src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import Sidebar from './components/common/Sidebar';
import MobileHeader from './components/common/MobileHeader';
import { FloatingChatButton } from './components/chat/FloatingChatButton';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { MyDetections } from './pages/MyDetections';
import { DetectionView } from './pages/DetectionView';
import { Profile } from './pages/Profile';
import { Appointments } from './pages/Appointments';
import { HealthTracker } from './pages/HealthTracker';
import { Resources } from './pages/Resources';

// Layout component for authenticated routes
const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Header */}
      <MobileHeader onMenuClick={() => setIsMobileMenuOpen(true)} />

      {/* Sidebar - Desktop always visible, Mobile controlled by state */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-16 lg:pt-0">
        <div className="h-full">
          {children}
        </div>
      </main>

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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
