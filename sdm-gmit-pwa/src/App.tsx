import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from './components/ui/Toast';
import LandingPage from './pages/LandingPage';
import FormPage from './pages/FormPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import SeedUser from './pages/SeedUser';
import { Toaster } from './components/ui/Toast';
import { OfflineBanner } from './components/ui/OfflineBanner';

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

import { useSession } from './lib/auth-client';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, isPending } = useSession();

  if (isPending) return <PageLoader />;
  if (!session) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

// Inner component to handle routing animations and logic that requires Router context
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
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <Suspense fallback={<PageLoader />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/form" element={<FormPage />} />
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
        </motion.div>
      </AnimatePresence>
      {isOffline && <OfflineBanner />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
      <Toaster />
    </Router>
  )
}

export default App
