import { Link } from 'react-router-dom';
import { ArrowUpRight, ShoppingCart } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';
import useCart from '../hooks/useCart';

export default function ProductCard({ id, name, slug, price, image_url, brand_name, stock_quantity, onAddToCart }) {
  const { addToCart } = useCart();

  function handleAddToCart(e) {
    e.preventDefault();

    if (stock_quantity <= 0) {
      return;
    }

    addToCart({
      id,
      name,
      price,
      image_url,
      brand_name
    });

    if (onAddToCart) {
      onAddToCart();
    }
  }

  return (
    <div className="product-card">
      <Link to={`/product/${slug}`} className="product-card-link">
        {image_url && (
          <div className="product-card-image-wrapper">
            <img 
              src={`http://localhost:3001${image_url}`} 
              alt={name} 
              className="product-card-image"
            />
            <div className="product-card-link-indicator">
              <ArrowUpRight size={16} />
            </div>
          </div>
        )}
      </Link>
        
      <div className="product-card-content">
        <div className="product-card-info">
          <h3 className="product-card-name">{name}</h3>
          <p className="product-card-price">{formatPrice(price)}</p>
          
          {stock_quantity <= 0 && (
            <p className="product-card-stock-out">Rupture de stock</p>
          )}
        </div>
      
        <button 
          onClick={handleAddToCart}
          disabled={stock_quantity <= 0}
          className="product-card-button"
        >
          {stock_quantity > 0 ? <ShoppingCart size={18} /> : 'Indisponible'}
        </button>
      </div>
    </div>
  );
}