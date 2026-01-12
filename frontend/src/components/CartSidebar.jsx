import { Link } from 'react-router-dom';
import { X, Trash2 } from 'lucide-react';
import useCart from '../hooks/useCart';
import { formatPrice } from '../utils/formatPrice';

export default function CartSidebar({ isOpen, onClose }) {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
  const cartTotal = getCartTotal();
  const cartCount = getCartCount();

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  function handleRemoveItem(productId) {
    removeFromCart(productId);
  }

  function handleQuantityChange(productId, newQuantity) {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="cart-sidebar-backdrop"
          onClick={handleBackdropClick}
        />
      )}

      {/* Sidebar */}
      <div className={`cart-sidebar ${isOpen ? 'cart-sidebar-open' : ''}`}>
        <div className="cart-sidebar-header">
          <h2>Mon Panier ({cartCount})</h2>
          <button
            className="cart-sidebar-close"
            onClick={onClose}
            aria-label="Fermer le panier"
          >
            <X size={24} />
          </button>
        </div>

        <div className="cart-sidebar-content">
          {cartItems.length === 0 ? (
            <div className="cart-sidebar-empty">
              <p>Votre panier est vide</p>
              <button className="btn-continue-shopping" onClick={onClose}>
                Continuer mes achats
              </button>
            </div>
          ) : (
            <>
              <div className="cart-sidebar-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-sidebar-item">
                    <div className="cart-sidebar-item-image">
                      {item.image_url && (
                        <img
                          src={`http://localhost:3001${item.image_url}`}
                          alt={item.name}
                        />
                      )}
                    </div>

                    <div className="cart-sidebar-item-details">
                      <h3>{item.name}</h3>
                      {item.brand_name && (
                        <p className="cart-sidebar-item-brand">{item.brand_name}</p>
                      )}
                      <p className="cart-sidebar-item-price">
                        {formatPrice(item.price)}
                      </p>

                      <div className="cart-sidebar-item-quantity">
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      className="cart-sidebar-item-remove"
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label="Supprimer cet article"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-sidebar-footer">
                <div className="cart-sidebar-total">
                  <span>Total:</span>
                  <span className="cart-sidebar-total-amount">
                    {formatPrice(cartTotal)}
                  </span>
                </div>

                <Link
                  to="/checkout"
                  className="btn-checkout"
                  onClick={onClose}
                >
                  Passer la commande
                </Link>

                <Link
                  to="/cart"
                  className="btn-view-cart"
                  onClick={onClose}
                >
                  Voir le panier complet
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
