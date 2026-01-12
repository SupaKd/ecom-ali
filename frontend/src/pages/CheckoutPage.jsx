import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        <h1>Votre panier est vide</h1>
        <button onClick={() => navigate('/')}>
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const total = getCartTotal();

  return (
    <div className="checkout-page">
      <h1>Finaliser la commande</h1>
      
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="checkout-form">
          <h2>Informations de livraison</h2>
          
          <div className="form-group">
            <label htmlFor="customer_name">Nom complet *</label>
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              className={errors.customer_name ? 'error' : ''}
            />
            {errors.customer_name && (
              <span className="error-message">{errors.customer_name}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="customer_email">Email *</label>
            <input
              type="email"
              id="customer_email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              className={errors.customer_email ? 'error' : ''}
            />
            {errors.customer_email && (
              <span className="error-message">{errors.customer_email}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="customer_phone">Téléphone</label>
            <input
              type="tel"
              id="customer_phone"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleChange}
              placeholder="0612345678"
              className={errors.customer_phone ? 'error' : ''}
            />
            {errors.customer_phone && (
              <span className="error-message">{errors.customer_phone}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="shipping_address">Adresse *</label>
            <textarea
              id="shipping_address"
              name="shipping_address"
              value={formData.shipping_address}
              onChange={handleChange}
              rows="3"
              className={errors.shipping_address ? 'error' : ''}
            />
            {errors.shipping_address && (
              <span className="error-message">{errors.shipping_address}</span>
            )}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="shipping_postal_code">Code postal *</label>
              <input
                type="text"
                id="shipping_postal_code"
                name="shipping_postal_code"
                value={formData.shipping_postal_code}
                onChange={handleChange}
                placeholder="01000"
                className={errors.shipping_postal_code ? 'error' : ''}
              />
              {errors.shipping_postal_code && (
                <span className="error-message">{errors.shipping_postal_code}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="shipping_city">Ville *</label>
              <input
                type="text"
                id="shipping_city"
                name="shipping_city"
                value={formData.shipping_city}
                onChange={handleChange}
                className={errors.shipping_city ? 'error' : ''}
              />
              {errors.shipping_city && (
                <span className="error-message">{errors.shipping_city}</span>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="shipping_country">Pays</label>
            <input
              type="text"
              id="shipping_country"
              name="shipping_country"
              value={formData.shipping_country}
              onChange={handleChange}
              readOnly
            />
          </div>
          
          <button 
            type="submit" 
            className="checkout-submit"
            disabled={isLoading}
          >
            {isLoading ? 'Redirection vers le paiement...' : 'Finaliser la commande'}
          </button>
        </form>
        
        <div className="checkout-summary">
          <h2>Récapitulatif</h2>
          
          <div className="checkout-items">
            {cartItems.map(item => (
              <div key={item.id} className="checkout-item">
                <span>{item.name} x{item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          
          <div className="checkout-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}