import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderById, updateOrderStatus } from '../../services/adminService';
import { formatPrice } from '../../utils/formatPrice';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  async function loadOrder() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchOrderById(id);
      setOrder(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(newStatus) {
    if (!confirm(`Changer le statut en "${newStatus}" ?`)) {
      return;
    }

    setIsUpdating(true);

    try {
      const updatedOrder = await updateOrderStatus(id, newStatus);
      setOrder(updatedOrder);
      alert('Statut mis à jour');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!order) {
    return <div className="error">Commande introuvable</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <button onClick={() => navigate('/admin/orders')} className="btn-back">
          ← Retour
        </button>
        <h1>Commande {order.order_number}</h1>
      </div>

      <div className="order-detail-grid">
        <div className="order-info-card">
          <h2>Informations client</h2>
          <p><strong>Nom :</strong> {order.customer_name}</p>
          <p><strong>Email :</strong> {order.customer_email}</p>
          <p><strong>Téléphone :</strong> {order.customer_phone || 'Non renseigné'}</p>
          <p><strong>Date :</strong> {new Date(order.created_at).toLocaleString('fr-FR')}</p>
        </div>

        <div className="order-info-card">
          <h2>Livraison</h2>
          <p>{order.shipping_address}</p>
          <p>{order.shipping_postal_code} {order.shipping_city}</p>
          <p>{order.shipping_country}</p>
        </div>

        <div className="order-info-card">
          <h2>Paiement</h2>
          <p><strong>Statut :</strong> {order.payment_status}</p>
          <p><strong>ID Stripe :</strong> {order.stripe_payment_id || 'N/A'}</p>
          <p><strong>Total :</strong> {formatPrice(order.total_amount)}</p>
        </div>
      </div>

      <div className="order-items-section">
        <h2>Produits commandés</h2>
        <table>
          <thead>
            <tr>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Prix unitaire</th>
              <th>Sous-total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(item => (
              <tr key={item.id}>
                <td>{item.product_name}</td>
                <td>{item.quantity}</td>
                <td>{formatPrice(item.unit_price)}</td>
                <td>{formatPrice(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3"><strong>Total</strong></td>
              <td><strong>{formatPrice(order.total_amount)}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="order-status-section">
        <h2>Gestion du statut</h2>
        <p>Statut actuel : <strong>{order.order_status}</strong></p>

        <div className="status-buttons">
          <button
            onClick={() => handleStatusChange('processing')}
            disabled={isUpdating || order.order_status === 'processing'}
          >
            Marquer en cours
          </button>
          <button
            onClick={() => handleStatusChange('shipped')}
            disabled={isUpdating || order.order_status === 'shipped'}
          >
            Marquer expédiée
          </button>
          <button
            onClick={() => handleStatusChange('delivered')}
            disabled={isUpdating || order.order_status === 'delivered'}
          >
            Marquer livrée
          </button>
          <button
            onClick={() => handleStatusChange('cancelled')}
            disabled={isUpdating || order.order_status === 'cancelled'}
            className="btn-danger"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}