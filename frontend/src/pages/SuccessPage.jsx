import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import useCart from '../hooks/useCart';
import api from '../services/api';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId) {
        setError('Session invalide');
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await api.get(`/payment/verify/${sessionId}`);
        
        if (response.data.success) {
          setOrder(response.data.order);
          clearCart();
        } else {
          setError('Paiement non confirmé');
        }
        
      } catch (error) {
        setError(error.message);
        
      } finally {
        setIsLoading(false);
      }
    }
    
    verifyPayment();
  }, [sessionId, clearCart]);

  if (isLoading) {
    return <div className="loading">Vérification du paiement...</div>;
  }

  if (error) {
    return (
      <div className="success-page error">
        <h1>Erreur</h1>
        <p>{error}</p>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="success-page error">
        <h1>Commande introuvable</h1>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="success-content">
        <div className="success-icon">
          <CheckCircle size={64} />
        </div>
        <h1>Commande confirmée !</h1>
        <p>Merci pour votre commande {order.customer_name}</p>
        
        <div className="order-info">
          <p><strong>Numéro de commande :</strong> {order.order_number}</p>
          <p><strong>Email de confirmation envoyé à :</strong> {order.customer_email}</p>
        </div>
        
        <div className="success-actions">
          <Link to="/" className="button-primary">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}