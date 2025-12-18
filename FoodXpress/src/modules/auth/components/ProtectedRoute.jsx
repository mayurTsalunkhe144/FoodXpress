import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService.jsx';

export default function ProtectedRoute({ children, requiredRole }) {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
