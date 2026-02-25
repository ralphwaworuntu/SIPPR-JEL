import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { toast } from './components/ui/Toast';
import LandingPage from './pages/LandingPage';
import FormPage from './pages/FormPage';
import StatusPage from './pages/StatusPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import SeedUser from './pages/SeedUser';
import { Toaster } from './components/ui/Toast';
import { OfflineBanner } from './components/ui/OfflineBanner';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { useSession } from './lib/auth-client';
import { Navigate } from 'react-router-dom';

// Lazy Load Admin Pages for Performance
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminMemberData = React.lazy(() => import('./pages/AdminMemberData'));
const AdminFamilyData = React.lazy(() => import('./pages/AdminFamilyData'));

const AdminReports = React.lazy(() => import('./pages/AdminReports'));
const AdminSettings = React.lazy(() => import('./pages/AdminSettings'));
const AdminNotifications = React.lazy(() => import('./pages/AdminNotifications'));
const AdminProfile = React.lazy(() => import('./pages/AdminProfile'));

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
  const { data: session, isPending } = useSession();

  if (isPending) return <PageLoader />;
  if (!session) return <Navigate to="/login" replace />;

  return <React.Suspense fallback={<PageLoader />}>{children}</React.Suspense>;
}

// Inner component to handle routing logic
const AppContent = () => {
  const location = useLocation();

  // Offline Detection
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => {
      setIsOffline(false);
      toast.success("Koneksi Internet Tersambung Kembali.");
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/seed-user" element={<SeedUser />} />

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
        <Route path="/admin/family" element={
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
        <Route path="/admin/notifications" element={
          <ProtectedRoute>
            <AdminNotifications />
          </ProtectedRoute>
        } />
        <Route path="/admin/profile" element={
          <ProtectedRoute>
            <AdminProfile />
          </ProtectedRoute>
        } />

        {/* Catch-all Route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {isOffline && <OfflineBanner />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
      <Toaster />
    </Router>
  )
}

export default App
