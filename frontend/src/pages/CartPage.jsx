import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import CartItem from '../components/CartItem';
import { formatPrice } from '../utils/formatPrice';

export default function CartPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const total = getCartTotal();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page-empty">
        <h1>Votre panier est vide</h1>
        <Link to="/" className="continue-shopping">
          Continuer mes achats
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Mon Panier</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map(item => (
            <CartItem 
              key={item.id}
              {...item}
            />
          ))}
        </div>
        
        <div className="cart-summary">
          <h2>Récapitulatif</h2>
          
          <div className="cart-summary-line">
            <span>Sous-total</span>
            <span>{formatPrice(total)}</span>
          </div>
          
          <div className="cart-summary-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          
          <Link to="/checkout" className="checkout-button">
            Passer la commande
          </Link>
          
          <button onClick={clearCart} className="clear-cart-button">
            Vider le panier
          </button>
        </div>
      </div>
    </div>
  );
}