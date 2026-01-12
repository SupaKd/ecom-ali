import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import useCart from "../hooks/useCart";
import { fetchCategories } from "../services/categoryService";

export default function Navbar({ onCartClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  useEffect(() => {
    async function loadCategories() {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
      }
    }

    loadCategories();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsCategoriesOpen(false);
  };

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsCategoriesOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          E-Commerce
        </Link>

        <button
          className="burger-menu"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          
          <li>
            <Link to="/" onClick={closeMenu}>
              Acceuil
            </Link>
          </li>

          <li className="categories-dropdown">
            <span
              className={`categories-title ${isCategoriesOpen ? "open" : ""}`}
              onClick={toggleCategories}
            >
              Catégories
              <ChevronDown size={16} className="dropdown-icon" />
            </span>
            {categories.length > 0 && (
              <ul
                className={`categories-list ${isCategoriesOpen ? "open" : ""}`}
              >
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link to={`/category/${category.slug}`} onClick={closeMenu}>
                      {category.name}
                    </Link>
                  </li>
                ))}
               
              </ul>
            )}
          </li>
          <li>
                  <Link>
                  Contact
                  </Link>
                </li>
        </ul>
        <button
          onClick={() => {
            onCartClick();
            closeMenu();
          }}
          className="cart-link"
        >
          <ShoppingCart size={20} />
          <span>Panier</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
}
