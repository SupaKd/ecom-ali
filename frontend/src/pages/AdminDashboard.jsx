import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { admin } = useAuth();

  useEffect(() => {
    if (admin.role === 'order_manager') {
      navigate('/admin/orders');
    } else if (admin.role === 'product_manager') {
      navigate('/admin/products');
    }
  }, [admin.role, navigate]);

  return (
    <div className="admin-page">
      <h1>Bienvenue {admin.name}</h1>
      <p>Redirection en cours...</p>
    </div>
  );
}