import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FormPage from './pages/FormPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminMemberData from './pages/AdminMemberData';
import AdminFamilyData from './pages/AdminFamilyData';
import AdminReports from './pages/AdminReports';
import AdminSettings from './pages/AdminSettings';
import { Toaster } from './components/ui/Toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  // const { data: session, isPending } = useSession();
  // if (isPending) return <div>Loading...</div>;
  // if (!session) return <Navigate to="/login" />;
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/members" element={
          <ProtectedRoute>
            <AdminMemberData />
          </ProtectedRoute>
        } />
        <Route path="/admin/families" element={
          <ProtectedRoute>
            <AdminFamilyData />
          </ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute>
            <AdminReports />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute>
            <AdminSettings />
          </ProtectedRoute>
        } />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App
