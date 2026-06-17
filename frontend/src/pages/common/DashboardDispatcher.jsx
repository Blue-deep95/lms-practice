import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

export default function DashboardDispatcher() {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If auth is loading (token present but user state empty)
  if (token && !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#fafafc' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // If the path is exactly '/dashboard' or '/dashboard/', redirect based on role
  if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  // Render sub-routes (/dashboard/admin, etc.)
  return <Outlet />;
}
