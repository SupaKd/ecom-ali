# 🔒 Guide de Sécurité - Frontend E-commerce

## Mesures de Sécurité Implémentées

### 1. Content Security Policy (CSP)
✅ Implémenté dans [index.html](index.html)
- Protection contre les injections de scripts malveillants
- Restriction des sources de contenu (scripts, styles, images)
- Autorisation uniquement de Stripe pour les paiements
- Blocage des objets et embeds non autorisés

### 2. Protection XSS (Cross-Site Scripting)
✅ Utilitaires dans [src/utils/sanitize.js](src/utils/sanitize.js)
- Sanitization automatique des entrées utilisateur
- Suppression des balises dangereuses (`<script>`, `<iframe>`, `<object>`)
- Suppression des attributs d'événements (onclick, onerror, etc.)
- Nettoyage des URLs malveillantes
- Encodage HTML pour les caractères spéciaux

### 3. Stockage Sécurisé
✅ Implémenté dans [src/utils/secureStorage.js](src/utils/secureStorage.js)
- Token obfusqué dans localStorage (base64)
- Expiration automatique des tokens (24h)
- Nettoyage automatique en cas d'erreur
- Protection contre les attaques de timing

**⚠️ Note importante:** Le localStorage reste vulnérable aux attaques XSS. Pour une sécurité maximale en production, utiliser des **httpOnly cookies** côté backend.

### 4. Validation Côté Client
✅ Validations complètes dans [src/utils/validation.js](src/utils/validation.js)
- Validation email (format + longueur max 255)
- Validation téléphone (10 chiffres)
- Validation code postal (5 chiffres)
- Validation noms (lettres + accents uniquement)
- Validation adresses (longueur 5-500)
- Validation mots de passe (6-100 caractères)
- Validation quantités (1-1000)

### 5. Gestion des Erreurs API
✅ Intercepteurs Axios dans [src/services/api.js](src/services/api.js)
- Timeout de 10 secondes sur toutes les requêtes
- Déconnexion automatique sur 401/403
- Gestion du rate limiting (429)
- Messages d'erreur sécurisés
- Redirection automatique vers login si non authentifié

### 6. Headers de Sécurité
✅ Configurés dans [index.html](index.html)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`

### 7. Protection des Variables d'Environnement
✅ Configuration
- Fichier `.env` ignoré par Git
- Template `.env.example` fourni
- Clés API Stripe jamais exposées dans le code

### 8. Routing Sécurisé
✅ Protection dans [src/App.jsx](src/App.jsx)
- Routes admin protégées par authentification
- Contrôle d'accès basé sur les rôles
- Utilisation de `<Outlet />` pour éviter la duplication de routes
- Redirection automatique si non autorisé

## 🔍 Vulnérabilités Résiduelles

### 1. LocalStorage et XSS
**Problème:** Si un attaquant injecte du JavaScript malveillant (XSS), il peut accéder au localStorage et voler le token.

**Solution recommandée pour la production:**
```javascript
// Backend: Utiliser httpOnly cookies au lieu de localStorage
res.cookie('token', token, {
  httpOnly: true,  // Inaccessible via JavaScript
  secure: true,    // Uniquement HTTPS
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000
});
```

### 2. HTTPS Obligatoire
Le site DOIT être servi en HTTPS en production pour:
- Protéger les tokens en transit
- Activer les fonctionnalités sécurisées des navigateurs
- Éviter les attaques Man-in-the-Middle

## ⚠️ Actions Critiques Avant Production

### 1. Configurer HTTPS
```bash
# Obtenir un certificat SSL/TLS avec Let's Encrypt
sudo certbot --nginx -d votredomaine.com
```

### 2. Mettre à jour le CSP
Dans [index.html](index.html), remplacer:
```html
img-src 'self' data: https: http://localhost:3001;
connect-src 'self' http://localhost:3001 https://api.stripe.com;
```
Par:
```html
img-src 'self' data: https://votredomaine.com;
connect-src 'self' https://api.votredomaine.com https://api.stripe.com;
```

### 3. Configurer les Variables d'Environnement
Mettre à jour `.env` avec les URLs de production:
```env
VITE_API_URL=https://api.votredomaine.com/api
VITE_STRIPE_PUBLIC_KEY=pk_live_votre_cle_production
```

### 4. Build de Production
```bash
npm run build
```
Le build optimisera et minifiera le code.

### 5. Servir avec un Serveur Sécurisé
Ne PAS utiliser `vite preview` en production. Utiliser Nginx ou Apache:

**Nginx:**
```nginx
server {
    listen 443 ssl http2;
    server_name votredomaine.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /path/to/dist;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Headers de sécurité supplémentaires
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

## 🛡️ Bonnes Pratiques Supplémentaires

### 1. Authentification à Deux Facteurs (2FA)
Pour les comptes admin, implémenter la 2FA avec TOTP ou SMS.

### 2. Audit des Dépendances
```bash
# Vérifier les vulnérabilités
npm audit

# Corriger automatiquement
npm audit fix

# Mettre à jour les dépendances
npm update
```

### 3. Monitoring
- Utiliser Sentry ou LogRocket pour détecter les erreurs
- Monitorer les tentatives d'accès non autorisées
- Alertes sur les patterns d'attaque

### 4. Tests de Sécurité
- Tests de pénétration réguliers
- Analyse statique du code (ESLint Security Plugin)
- Révision de code par des pairs

### 5. Limiter les Informations Exposées
```javascript
// ❌ Mauvais - Expose trop d'infos
console.log('User data:', userData);

// ✅ Bon - Log minimal en production
if (process.env.NODE_ENV === 'development') {
  console.log('Debug:', data);
}
```

## 📋 Checklist de Déploiement

- [ ] HTTPS configuré et fonctionnel
- [ ] CSP mis à jour avec les domaines de production
- [ ] Variables d'environnement de production configurées
- [ ] Build de production créé et testé
- [ ] Fichier .env exclu de Git
- [ ] Headers de sécurité vérifiés
- [ ] Tests de sécurité effectués
- [ ] Monitoring configuré
- [ ] Backups configurés
- [ ] Plan de réponse aux incidents en place

## 🔧 Utilisation des Utilitaires de Sécurité

### Sanitization
```javascript
import { sanitizeHTML, sanitizeFormData } from './utils/sanitize';

// Nettoyer une entrée simple
const clean = sanitizeHTML(userInput);

// Nettoyer un formulaire complet
const cleanData = sanitizeFormData(formData);
```

### Stockage Sécurisé
```javascript
import { secureStorage } from './utils/secureStorage';

// Sauvegarder
secureStorage.setToken(token);
secureStorage.setItem('key', value);

// Récupérer
const token = secureStorage.getToken();
const value = secureStorage.getItem('key');

// Nettoyer
secureStorage.clear();
```

### Validation
```javascript
import { isValidEmail, isValidName } from './utils/validation';

if (!isValidEmail(email)) {
  setError('Email invalide');
}

if (!isValidName(name)) {
  setError('Nom invalide');
}
```

## 🚨 En Cas d'Incident

1. **Détection**
   - Surveiller les logs d'erreur
   - Alertes sur comportements anormaux

2. **Réaction**
   - Invalider tous les tokens actifs
   - Forcer la reconnexion de tous les utilisateurs
   - Analyser l'étendue de la compromission

3. **Correction**
   - Patcher la vulnérabilité
   - Déployer le correctif
   - Tester la correction

4. **Communication**
   - Notifier les utilisateurs affectés
   - Documenter l'incident
   - Améliorer les procédures

## 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://react.dev/learn/security)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Web.dev Security](https://web.dev/secure/)

## 🎯 Résumé

Le frontend implémente maintenant:
- ✅ Protection XSS avec sanitization
- ✅ Stockage obfusqué des tokens
- ✅ Validation complète des entrées
- ✅ Content Security Policy
- ✅ Gestion des erreurs API
- ✅ Headers de sécurité
- ✅ Timeout sur les requêtes
- ✅ Routing sécurisé

**Pour une sécurité maximale en production**, pensez à:
1. Utiliser HTTPS obligatoirement
2. Implémenter des httpOnly cookies
3. Configurer un WAF (Web Application Firewall)
4. Effectuer des audits de sécurité réguliers
