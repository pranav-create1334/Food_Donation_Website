import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth';
import AppShell from './components/AppShell';
import ProtectedRoute, { homePathForRole } from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import DonorDashboard from './pages/DonorDashboard';
import Landing from './pages/Landing';
import LoginPage from './pages/LoginPage';
import VolunteerDashboard from './pages/VolunteerDashboard';

function AppRoutes() {
  const { user } = useAuth();
  const home = user ? homePathForRole(user.role) : '/';

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/donor"
          element={
            <ProtectedRoute allowedRoles={['DONOR']}>
              <DonorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer"
          element={
            <ProtectedRoute allowedRoles={['VOLUNTEER']}>
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={home} replace />} />
      </Routes>
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

