// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { DetectionProvider } from './contexts/DetectionContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Login from './components/auth/Login';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Detection } from './pages/Detection';
import { History } from './pages/History';
import { PatientDetails } from './pages/PatientDetails';
import { Profile } from './pages/Profile';
import { Patients } from './pages/Patients';
import { UserManagement } from './pages/UserManagement';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <DetectionProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/detection"
                  element={
                    <ProtectedRoute>
                      <Detection />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/detection/:id"
                  element={
                    <ProtectedRoute>
                      <Detection />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patients"
                  element={
                    <ProtectedRoute>
                      <Patients />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute>
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patients/:id"
                  element={
                    <ProtectedRoute>
                      <PatientDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <Toaster position="top-right" richColors />
          </div>
        </Router>
      </DetectionProvider>
    </AuthProvider>
  );
}

// Wrapper component for Patients page
const PatientsPage: React.FC = () => {
  const [patients, setPatients] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const { patientService } = await import('./services/patientService');
      const data = await patientService.getPatients();
      setPatients(data);
    } catch (error) {
      console.error('Failed to load patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (patient: any) => {
    // TODO: Implement edit modal
    console.log('Edit patient:', patient);
  };

  const handleDelete = async (patientId: string) => {
    try {
      const { patientService } = await import('./services/patientService');
      await patientService.deletePatient(patientId);
      loadPatients();
    } catch (error) {
      console.error('Failed to delete patient:', error);
    }
  };

  const handleAddNew = () => {
    // TODO: Implement add patient modal
    console.log('Add new patient');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PatientList
        patients={patients}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={handleAddNew}
        isLoading={isLoading}
      />
    </div>
  );
};

export default App;
