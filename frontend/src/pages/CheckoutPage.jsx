import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  CreditCard,
  ShoppingCart,
  Check,
  AlertCircle,
  Lock,
  Loader2,
  Flag
} from 'lucide-react';
import useCart from '../hooks/useCart';
import { formatPrice } from '../utils/formatPrice';
import { isValidEmail, isValidPhone, isValidPostalCode } from '../utils/validation';
import api from '../services/api';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal } = useCart();

  const [formData, setFormData] = useState({
    customer_email: '',
    customer_name: '',
    customer_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_postal_code: '',
    shipping_country: 'France'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Calculer la progression du formulaire (dérivé de l'état)
  const calculateProgress = () => {
    const fields = [
      formData.customer_name,
      formData.customer_email,
      formData.customer_phone,
      formData.shipping_address,
      formData.shipping_city,
      formData.shipping_postal_code
    ];
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const formProgress = calculateProgress();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  function validateForm() {
    const newErrors = {};
    
    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Nom requis';
    }
    
    if (!isValidEmail(formData.customer_email)) {
      newErrors.customer_email = 'Email invalide';
    }
    
    if (formData.customer_phone && !isValidPhone(formData.customer_phone)) {
      newErrors.customer_phone = 'Téléphone invalide (10 chiffres)';
    }
    
    if (!formData.shipping_address.trim()) {
      newErrors.shipping_address = 'Adresse requise';
    }
    
    if (!formData.shipping_city.trim()) {
      newErrors.shipping_city = 'Ville requise';
    }
    
    if (!isValidPostalCode(formData.shipping_postal_code)) {
      newErrors.shipping_postal_code = 'Code postal invalide (5 chiffres)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (cartItems.length === 0) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const orderData = {
        ...formData,
        items: cartItems.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity
        }))
      };
      
      const response = await api.post('/payment/checkout', orderData);
      
      // Redirection directe vers l'URL Stripe
      window.location.href = response.data.url;
      
    } catch (error) {
      alert(error.response?.data?.error || 'Erreur lors de la création de la commande');
      setIsLoading(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <div className="empty-icon">
          <ShoppingCart size={80} strokeWidth={1.5} />
        </div>
        <h1>Votre panier est vide</h1>
        <p>Ajoutez des produits pour passer commande</p>
        <button onClick={() => navigate('/')} className="button-primary">
          Découvrir nos produits
        </button>
      </div>
    );
  }

  const total = getCartTotal();

  return (
    <div className="checkout-page">
      {/* En-tête avec progression */}
      <div className="checkout-header">
        <h1>Finaliser votre commande</h1>
        <div className="progress-indicator">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${formProgress}%` }}
            />
          </div>
          <span className="progress-text">{formProgress}% complété</span>
        </div>
      </div>

      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="checkout-form">
          {/* Section Informations personnelles */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <User size={24} />
              </div>
              <div>
                <h2>Informations personnelles</h2>
                <p className="section-description">Nous avons besoin de ces informations pour vous contacter</p>
              </div>
            </div>
          
            <div className="form-group">
              <label htmlFor="customer_name">
                Nom complet *
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="customer_name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="Jean Dupont"
                  className={errors.customer_name ? 'error' : ''}
                />
                {formData.customer_name && !errors.customer_name && (
                  <span className="input-icon success">
                    <Check size={18} />
                  </span>
                )}
              </div>
              {errors.customer_name && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.customer_name}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="customer_email">
                Email *
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="customer_email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleChange}
                  placeholder="jean.dupont@email.com"
                  className={errors.customer_email ? 'error' : ''}
                />
                {formData.customer_email && !errors.customer_email && (
                  <span className="input-icon success">
                    <Check size={18} />
                  </span>
                )}
              </div>
              {errors.customer_email && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.customer_email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="customer_phone">
                Téléphone <span className="optional">(optionnel)</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="tel"
                  id="customer_phone"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleChange}
                  placeholder="0612345678"
                  className={errors.customer_phone ? 'error' : ''}
                />
                {formData.customer_phone && !errors.customer_phone && (
                  <span className="input-icon success">
                    <Check size={18} />
                  </span>
                )}
              </div>
              {errors.customer_phone && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.customer_phone}
                </span>
              )}
            </div>
          </div>

          {/* Section Adresse de livraison */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <Package size={24} />
              </div>
              <div>
                <h2>Adresse de livraison</h2>
                <p className="section-description">Où souhaitez-vous recevoir votre commande ?</p>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="shipping_address">
                Adresse complète *
              </label>
              <div className="input-wrapper">
                <textarea
                  id="shipping_address"
                  name="shipping_address"
                  value={formData.shipping_address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="12 Rue de la République, Appartement 3B"
                  className={errors.shipping_address ? 'error' : ''}
                />
                {formData.shipping_address && !errors.shipping_address && (
                  <span className="input-icon success textarea-icon">
                    <Check size={18} />
                  </span>
                )}
              </div>
              {errors.shipping_address && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.shipping_address}
                </span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="shipping_postal_code">
                  Code postal *
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="shipping_postal_code"
                    name="shipping_postal_code"
                    value={formData.shipping_postal_code}
                    onChange={handleChange}
                    placeholder="01000"
                    maxLength="5"
                    className={errors.shipping_postal_code ? 'error' : ''}
                  />
                  {formData.shipping_postal_code && !errors.shipping_postal_code && (
                    <span className="input-icon success">
                      <Check size={18} />
                    </span>
                  )}
                </div>
                {errors.shipping_postal_code && (
                  <span className="error-message">
                    <AlertCircle size={14} />
                    {errors.shipping_postal_code}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="shipping_city">
                  Ville *
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="shipping_city"
                    name="shipping_city"
                    value={formData.shipping_city}
                    onChange={handleChange}
                    placeholder="Bourg-en-Bresse"
                    className={errors.shipping_city ? 'error' : ''}
                  />
                  {formData.shipping_city && !errors.shipping_city && (
                    <span className="input-icon success">
                      <Check size={18} />
                    </span>
                  )}
                </div>
                {errors.shipping_city && (
                  <span className="error-message">
                    <AlertCircle size={14} />
                    {errors.shipping_city}
                  </span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="shipping_country">
                Pays
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="shipping_country"
                  name="shipping_country"
                  value={formData.shipping_country}
                  onChange={handleChange}
                  readOnly
                  className="readonly-input"
                />
                <span className="input-icon">
                  <Flag size={18} />
                </span>
              </div>
            </div>
          </div>

          {/* Section Paiement */}
          <div className="form-section payment-section">
            <div className="section-header">
              <div className="section-icon">
                <CreditCard size={24} />
              </div>
              <div>
                <h2>Paiement sécurisé</h2>
                <p className="section-description">Vos informations de paiement sont sécurisées avec Stripe</p>
              </div>
            </div>

            <div className="payment-info">
              <div className="payment-badge">
                <span className="badge-icon">
                  <Lock size={24} />
                </span>
                <div>
                  <strong>Paiement 100% sécurisé</strong>
                  <p>Vous serez redirigé vers notre page de paiement sécurisée Stripe</p>
                </div>
              </div>

              <div className="payment-methods">
                <span>Moyens de paiement acceptés :</span>
                <div className="payment-icons">
                  <CreditCard size={24} title="Carte bancaire" />
                  <span className="payment-text">Visa, Mastercard, Apple Pay, Google Pay</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="checkout-submit"
            disabled={isLoading || formProgress < 100}
          >
            {isLoading ? (
              <>
                <Loader2 className="button-spinner" size={20} />
                Redirection en cours...
              </>
            ) : formProgress < 100 ? (
              <>
                <AlertCircle size={20} />
                Veuillez remplir tous les champs requis
              </>
            ) : (
              <>
                <Lock size={20} />
                Procéder au paiement sécurisé
              </>
            )}
          </button>

          <p className="checkout-disclaimer">
            En cliquant sur "Procéder au paiement", vous acceptez nos conditions générales de vente.
          </p>
        </form>

        <div className="checkout-summary">
          <div className="summary-header">
            <h2>Récapitulatif</h2>
            <span className="item-count">{cartItems.length} article{cartItems.length > 1 ? 's' : ''}</span>
          </div>

          <div className="checkout-items">
            {cartItems.map(item => (
              <div key={item.id} className="checkout-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">× {item.quantity}</span>
                </div>
                <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="summary-details">
            <div className="summary-row">
              <span>Sous-total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="summary-row">
              <span>Livraison</span>
              <span className="free-shipping">Gratuite</span>
            </div>
          </div>

          <div className="checkout-total">
            <span>Total TTC</span>
            <span className="total-amount">{formatPrice(total)}</span>
          </div>

          <div className="trust-badges">
            <div className="trust-badge">
              <Check size={16} />
              <span>Paiement sécurisé</span>
            </div>
            <div className="trust-badge">
              <Check size={16} />
              <span>Livraison rapide</span>
            </div>
            <div className="trust-badge">
              <Check size={16} />
              <span>Satisfaction garantie</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}