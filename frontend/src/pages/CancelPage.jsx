import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function CancelPage() {
  return (
    <div className="cancel-page">
      <div className="cancel-content">
        <div className="cancel-icon">
          <XCircle size={64} />
        </div>
        <h1>Paiement annulé</h1>
        <p>Votre commande n'a pas été finalisée</p>
        
        <div className="cancel-actions">
          <Link to="/cart" className="button-primary">
            Retour au panier
          </Link>
          <Link to="/" className="button-secondary">
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  );
}