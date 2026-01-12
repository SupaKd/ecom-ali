import { useState, useEffect, useCallback } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchCategories } from '../services/categoryService';
import { fetchProducts } from '../services/productService';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';

const heroSlides = [
  {
    id: 1,
    title: "Bienvenue dans notre boutique",
    subtitle: "Découvrez nos produits de qualité",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600",
    cta: "Découvrir",
    link: "/category"
  },
  {
    id: 2,
    title: "Nouvelles Collections",
    subtitle: "Les dernières tendances sont arrivées",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600",
    cta: "Voir plus",
    link: "/category"
  },
  {
    id: 3,
    title: "Offres Spéciales",
    subtitle: "Jusqu'à -50% sur une sélection d'articles",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600",
    cta: "En profiter",
    link: "/category"
  }
];

export default function Home() {
  const { openCart } = useOutletContext();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [productsSliderElement, setProductsSliderElement] = useState(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  const scrollProducts = (direction) => {
    if (productsSliderElement) {
      const scrollAmount = 350;
      productsSliderElement.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      
      try {
        const [categoriesData, productsData] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ]);
        
        setCategories(categoriesData);
        setProducts(productsData.slice(0, 6));
        
      } catch (error) {
        setError(error.message);
        
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (isLoading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home">
      <section className="hero-slider">
        <div 
          className="slides-container"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroSlides.map((slide) => (
            <div 
              key={slide.id} 
              className="slide"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="slide-overlay"></div>
              <div className="slide-content">
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                <Link to={slide.link} className="cta-button">
                  {slide.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <button className="slider-btn prev" onClick={prevSlide} aria-label="Slide précédent">
          <ChevronLeft size={32} />
        </button>
        <button className="slider-btn next" onClick={nextSlide} aria-label="Slide suivant">
          <ChevronRight size={32} />
        </button>

        <div className="slider-dots">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="categories-section">
        <h2>Nos Catégories</h2>
        <div className="categories-grid">
          {categories.map(category => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              slug={category.slug}
              image_url={category.image_url}
            />
          ))}
        </div>
      </section>

      <section className="products-section">
        <div className="products-header">
          <h2>Produits Vedettes</h2>
        
        </div>
        <div className="products-slider" ref={setProductsSliderElement}>
          {products.map(product => (
            <ProductCard
              key={product.id}
              {...product}
              onAddToCart={openCart}
            />
          ))}
        </div>
        <div className="products-nav-buttons">
            <button
              className="products-nav-btn prev"
              onClick={() => scrollProducts('prev')}
              aria-label="Produit précédent"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="products-nav-btn next"
              onClick={() => scrollProducts('next')}
              aria-label="Produit suivant"
            >
              <ChevronRight size={24} />
            </button>
          </div>
      </section>
    </div>
  );
}