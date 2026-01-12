import { formatPrice } from '../utils/formatPrice';
import useCart from '../hooks/useCart';

export default function CartItem({ id, name, price, image_url, quantity, brand_name }) {
  const { updateQuantity, removeFromCart } = useCart();

  function handleQuantityChange(newQuantity) {
    updateQuantity(id, Number(newQuantity));
  }

  function handleRemove() {
    removeFromCart(id);
  }

  const subtotal = price * quantity;

  return (
    <div className="cart-item">
      {image_url && (
        <img 
          src={`http://localhost:3001${image_url}`} 
          alt={name} 
          className="cart-item-image"
        />
      )}
      
      <div className="cart-item-details">
        <h3>{name}</h3>
        <p className="cart-item-brand">{brand_name}</p>
        <p className="cart-item-price">{formatPrice(price)}</p>
      </div>
      
      <div className="cart-item-quantity">
        <label>Quantité :</label>
        <input 
          type="number" 
          min="1" 
          max="99"
          value={quantity}
          onChange={(e) => handleQuantityChange(e.target.value)}
          className="cart-item-quantity-input"
        />
      </div>
      
      <div className="cart-item-subtotal">
        <p>{formatPrice(subtotal)}</p>
      </div>
      
      <button 
        onClick={handleRemove}
        className="cart-item-remove"
      >
        Supprimer
      </button>
    </div>
  );
}