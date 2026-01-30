import { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import {
  fetchProductBySlug,
  fetchSimilarProducts,
} from "../services/productService";
import { formatPrice } from "../utils/formatPrice";
import useCart from "../hooks/useCart";
import ProductCard from "../components/ProductCard";

export default function ProductPage() {
  const { slug } = useParams();
  const { openCart } = useOutletContext();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      setError(null);

      try {
        const productData = await fetchProductBySlug(slug);
        setProduct(productData);

        if (productData.brand_id) {
          const similar = await fetchSimilarProducts(
            productData.brand_id,
            productData.id
          );
          setSimilarProducts(similar);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  function handleAddToCart() {
    if (!product || product.stock_quantity <= 0) {
      return;
    }

    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        brand_name: product.brand_name,
      },
      quantity
    );

    openCart();
    setQuantity(1);
  }

  if (isLoading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!product) {
    return <div className="error">Produit introuvable</div>;
  }

  return (
    <div className="product-page">
      <div className="product-detail">
        {product.image_url && (
          <img
            src={`http://localhost:3001${product.image_url}`}
            alt={product.name}
            className="product-detail-image"
          />
        )}

        <div className="product-detail-info">
          <p className="product-detail-brand">{product.brand_name}</p>
          <h1>{product.name}</h1>
          <p className="product-detail-price">{formatPrice(product.price)}</p>

          {product.description && (
            <p className="product-detail-description">{product.description}</p>
          )}

          <p className="product-detail-stock">
            {product.stock_quantity > 0 ? "En stock" : "Rupture de stock"}
          </p>

          {product.stock_quantity > 0 && (
            <div className="product-detail-actions">
              <div className="quantity-selector">
                <label>Quantité :</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock_quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="quantity-input"
                />
              </div>

              <button onClick={handleAddToCart} className="add-to-cart-button">
                Ajouter au panier
              </button>
            </div>
          )}
        </div>
      </div>

      {similarProducts.length > 0 && (
        <section className="similar-products">
          <h2>Autres parfums {product.brand_name}</h2>
          <div className="products-grid">
            {similarProducts.map((similar) => (
              <ProductCard
                key={similar.id}
                {...similar}
                onAddToCart={openCart}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
