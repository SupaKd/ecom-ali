import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingBag,
  ChevronDown,
  Home,
  Mail,
  Package,
} from "lucide-react";
import useCart from "../hooks/useCart";
import { fetchCategories } from "../services/categoryService";

export default function Navbar({ onCartClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    <nav className={`navbar-modern ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-modern-container">
        {/* Logo Section */}
        <Link to="/" className="navbar-modern-logo" onClick={closeMenu}>
          <Package className="logo-icon" size={28} />
          <span className="logo-text">
            <span className="logo-primary">E</span>-Commerce
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="navbar-modern-menu desktop">
          <li className="categories-dropdown-modern">
            <button
              className="nav-link categories-trigger"
              onClick={toggleCategories}
            >
              <Package size={18} />
              <span>Catégories</span>
              <ChevronDown
                size={16}
                className={`dropdown-chevron ${
                  isCategoriesOpen ? "rotate" : ""
                }`}
              />
            </button>
            {categories.length > 0 && (
              <div
                className={`categories-dropdown-menu ${
                  isCategoriesOpen ? "open" : ""
                }`}
              >
                <div className="categories-grid">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="category-item"
                      onClick={() => setIsCategoriesOpen(false)}
                    >
                      <span className="category-name">{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </li>

          <li>
            <Link to="/contact" className="nav-link">
              <Mail size={18} />
              <span>Contact</span>
            </Link>
          </li>
        </ul>

        {/* Cart Button */}
        <div className="navbar_right">
          <button
            onClick={() => {
              onCartClick();
              closeMenu();
            }}
            className="cart-button-modern"
          >
            <div className="cart-icon-wrapper">
              <ShoppingBag size={26} />
              {cartCount > 0 && (
                <span className="cart-badge-modern">{cartCount}</span>
              )}
            </div>
            <span className="cart-text">Panier</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
          <ul className="mobile-menu-list">
            <li className="mobile-categories">
              <button
                className="mobile-nav-link categories-trigger"
                onClick={toggleCategories}
              >
                <Package size={20} />
                <span>Catégories</span>
                <ChevronDown
                  size={18}
                  className={`dropdown-chevron ${
                    isCategoriesOpen ? "rotate" : ""
                  }`}
                />
              </button>
              {categories.length > 0 && isCategoriesOpen && (
                <ul className="mobile-categories-list">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        to={`/category/${category.slug}`}
                        className="mobile-category-link"
                        onClick={closeMenu}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li>
              <Link
                to="/contact"
                className="mobile-nav-link"
                onClick={closeMenu}
              >
                <Mail size={20} />
                <span>Contact</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu}></div>
      )}
    </nav>
  );
}
