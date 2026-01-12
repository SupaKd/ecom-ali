import { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { fetchCategoryBySlug } from '../services/categoryService';
import { fetchProductsByCategory } from '../services/productService';
import ProductCard from '../components/ProductCard';

export default function CategoryPage() {
  const { slug } = useParams();
  const { openCart } = useOutletContext();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCategoryAndProducts() {
      setIsLoading(true);
      setError(null);
      
      try {
        const categoryData = await fetchCategoryBySlug(slug);
        setCategory(categoryData);
        
        const productsData = await fetchProductsByCategory(categoryData.id);
        setProducts(productsData);
        
      } catch (error) {
        setError(error.message);
        
      } finally {
        setIsLoading(false);
      }
    }
    
    loadCategoryAndProducts();
  }, [slug]);

  if (isLoading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!category) {
    return <div className="error">Catégorie introuvable</div>;
  }

  return (
    <div className="category-page">
      <h1>{category.name}</h1>
      
      {products.length === 0 ? (
        <p>Aucun produit disponible dans cette catégorie</p>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard
              key={product.id}
              {...product}
              onAddToCart={openCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}