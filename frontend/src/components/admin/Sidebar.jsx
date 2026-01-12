import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Sidebar({ admin }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
        <p className="sidebar-user">{admin.name}</p>
        <span className="sidebar-role">
          {admin.role === 'order_manager' ? 'Gestion Commandes' : 'Gestion Produits'}
        </span>
      </div>

      <nav className="sidebar-nav">
        {admin.role === 'order_manager' && (
          <>
            <Link to="/admin/orders" className="sidebar-link">
              Commandes
            </Link>
            <Link to="/admin/stock" className="sidebar-link">
              Gestion Stock
            </Link>
          </>
        )}

        {admin.role === 'product_manager' && (
          <>
            <Link to="/admin/products" className="sidebar-link">
              Produits
            </Link>
            <Link to="/admin/categories" className="sidebar-link">
              Catégories
            </Link>
            <Link to="/admin/brands" className="sidebar-link">
              Marques
            </Link>
          </>
        )}
      </nav>

      <button onClick={handleLogout} className="sidebar-logout">
        Déconnexion
      </button>
    </aside>
  );
}