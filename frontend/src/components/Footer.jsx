import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>À Propos</h3>
              <p>Votre boutique en ligne de confiance pour des produits de qualité à prix compétitifs.</p>
              <div className="footer-social">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter size={20} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            <div className="footer-section">
              <h3>Service Client</h3>
              <ul>
                <li><a href="/contact">Contactez-nous</a></li>
                <li><a href="/faq">FAQ</a></li>
                <li><a href="/shipping">Livraison</a></li>
                <li><a href="/returns">Retours & Échanges</a></li>
                <li><a href="/track-order">Suivre ma commande</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>Informations</h3>
              <ul>
                <li><a href="/about">Qui sommes-nous</a></li>
                <li><a href="/terms">Conditions générales</a></li>
                <li><a href="/privacy">Politique de confidentialité</a></li>
                <li><a href="/legal">Mentions légales</a></li>
                <li><a href="/admin/login">Espace Admin</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>Newsletter</h3>
              <p>Inscrivez-vous pour recevoir nos offres exclusives</p>
              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Votre email"
                  required
                  aria-label="Email pour newsletter"
                />
                <button type="submit">S'inscrire</button>
              </form>
            
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 E-Commerce. Tous droits réservés.</p>
            <p>Développé avec passion</p>
          </div>
        </div>
      </footer>
    );
  }