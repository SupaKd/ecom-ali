import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../../services/adminService';
import { formatPrice } from '../../utils/formatPrice';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function getFilteredOrders() {
    if (filter === 'all') {
      return orders;
    }
    return orders.filter(order => order.order_status === filter);
  }

  const filteredOrders = getFilteredOrders();

  if (isLoading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Gestion des Commandes</h1>
      </div>

      <div className="admin-filters">
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'active' : ''}
        >
          Toutes ({orders.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={filter === 'pending' ? 'active' : ''}
        >
          En attente
        </button>
        <button
          onClick={() => setFilter('processing')}
          className={filter === 'processing' ? 'active' : ''}
        >
          En cours
        </button>
        <button
          onClick={() => setFilter('shipped')}
          className={filter === 'shipped' ? 'active' : ''}
        >
          Expédiées
        </button>
        <button
          onClick={() => setFilter('delivered')}
          className={filter === 'delivered' ? 'active' : ''}
        >
          Livrées
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <p>Aucune commande</p>
      ) : (
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>N° Commande</th>
                <th>Client</th>
                <th>Date</th>
                <th>Articles</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.order_number}</td>
                  <td>{order.customer_name}</td>
                  <td>{new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
                  <td>{order.items_count} article{order.items_count > 1 ? 's' : ''}</td>
                  <td>{formatPrice(order.total_amount)}</td>
                  <td>
                    <span className={`status-badge status-${order.order_status}`}>
                      {order.order_status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/admin/orders/${order.id}`} className="btn-small">
                      Voir détail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}