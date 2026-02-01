import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FormPage from './pages/FormPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminMemberData from './pages/AdminMemberData';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
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
      </Routes>
    </Router>
  )
}

export default App
