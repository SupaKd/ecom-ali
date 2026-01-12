import { Outlet, Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  const { isAuthenticated, admin, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-layout">
      <Sidebar admin={admin} />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}