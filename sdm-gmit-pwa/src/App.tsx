import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FormPage from './pages/FormPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import { Toaster } from './components/ui/Toast';

// Lazy Load Admin Pages for Performance
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminMemberData = React.lazy(() => import('./pages/AdminMemberData'));
const AdminFamilyData = React.lazy(() => import('./pages/AdminFamilyData'));
const AdminReports = React.lazy(() => import('./pages/AdminReports'));
const AdminSettings = React.lazy(() => import('./pages/AdminSettings'));

// Loading Fallback Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

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
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Routes */}
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

          {/* Catch-all Route for 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Toaster />
    </Router>
  )
}

export default App
