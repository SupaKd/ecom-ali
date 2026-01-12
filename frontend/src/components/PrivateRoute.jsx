import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function PrivateRoute({ children, allowedRoles }) {
  const { isAuthenticated, admin, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(admin.role)) {
    return <div className="error">Accès refusé</div>;
  }

  return children;
}