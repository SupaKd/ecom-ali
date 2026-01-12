/**
 * Utilitaires de sanitization pour prévenir les attaques XSS
 */

/**
 * Nettoie une chaîne de caractères des balises HTML dangereuses
 * @param {string} input - Texte à nettoyer
 * @returns {string} - Texte nettoyé
 */
export function sanitizeHTML(input) {
  if (typeof input !== 'string') return input;

  // Supprimer les balises script
  let clean = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Supprimer les balises iframe
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  // Supprimer les balises object
  clean = clean.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');

  // Supprimer les balises embed
  clean = clean.replace(/<embed\b[^<]*>/gi, '');

  // Supprimer les attributs d'événements (onclick, onerror, etc.)
  clean = clean.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  clean = clean.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

  // Supprimer javascript: dans les liens
  clean = clean.replace(/javascript:/gi, '');

  return clean;
}

/**
 * Encode les caractères spéciaux HTML
 * @param {string} input - Texte à encoder
 * @returns {string} - Texte encodé
 */
export function escapeHTML(input) {
  if (typeof input !== 'string') return input;

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };

  return input.replace(/[&<>"'/]/g, char => map[char]);
}

/**
 * Nettoie un objet de formulaire
 * @param {Object} formData - Données du formulaire
 * @returns {Object} - Données nettoyées
 */
export function sanitizeFormData(formData) {
  const sanitized = {};

  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeHTML(value.trim());
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Valide et nettoie une URL
 * @param {string} url - URL à valider
 * @returns {string|null} - URL nettoyée ou null si invalide
 */
export function sanitizeURL(url) {
  if (!url || typeof url !== 'string') return null;

  try {
    const parsed = new URL(url);

    // Accepter seulement http et https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }

    return parsed.href;
  } catch {
    return null;
  }
}

/**
 * Limite la longueur d'une chaîne
 * @param {string} input - Texte à limiter
 * @param {number} maxLength - Longueur maximale
 * @returns {string} - Texte limité
 */
export function truncateString(input, maxLength) {
  if (typeof input !== 'string') return input;
  if (input.length <= maxLength) return input;

  return input.substring(0, maxLength);
}

/**
 * Supprime les caractères spéciaux dangereux
 * @param {string} input - Texte à nettoyer
 * @returns {string} - Texte nettoyé
 */
export function removeSpecialChars(input) {
  if (typeof input !== 'string') return input;

  // Garder seulement les caractères alphanumériques, espaces, et ponctuation basique
  return input.replace(/[^\w\sàâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ.,!?'-]/g, '');
}
