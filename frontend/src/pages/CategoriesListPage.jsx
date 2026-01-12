import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../services/categoryService';

export default function CategoriesListPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCategories() {
      setIsLoading(true);
      setError(null);

      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, []);

  if (isLoading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="categories-list-page">
      <h1>Toutes les catégories</h1>

      {categories.length === 0 ? (
        <p>Aucune catégorie disponible</p>
      ) : (
        <div className="categories-grid">
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="category-card"
            >
              <h2>{category.name}</h2>
              {category.description && <p>{category.description}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
