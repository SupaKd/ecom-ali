import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

export default function CategoryCard({ id, name, slug, image_url }) {
  const cleanImageUrl = image_url?.trim();

  return (
    <Link to={`/category/${slug}`} className="category-card">
      {cleanImageUrl && (
        <img
          src={`${API_URL}${cleanImageUrl}`}
          alt={name}
          className="category-card-image"
        />
      )}
      <div className="category-card-content">
        <h3>{name}</h3>
        <span className="category-card-arrow">
          <ArrowRight size={20} />
        </span>
      </div>
    </Link>
  );
}