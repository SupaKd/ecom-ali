/**
 * Validation email avec limites de longueur
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 255) return false; // Limite standard

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validation téléphone français
 */
export function isValidPhone(phone) {
  if (!phone) return true; // Optionnel
  if (typeof phone !== 'string') return false;

  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.length > 20) return false; // Limite raisonnable

  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Validation code postal français
 */
export function isValidPostalCode(postalCode) {
  if (!postalCode || typeof postalCode !== 'string') return false;

  const postalRegex = /^[0-9]{5}$/;
  return postalRegex.test(postalCode);
}

/**
 * Validation longueur de chaîne
 */
export function isValidLength(str, minLength, maxLength) {
  if (typeof str !== 'string') return false;
  const length = str.trim().length;
  return length >= minLength && length <= maxLength;
}

/**
 * Validation nom (lettres, espaces, tirets)
 */
export function isValidName(name) {
  if (!name || typeof name !== 'string') return false;
  if (!isValidLength(name, 2, 100)) return false;

  const nameRegex = /^[a-zA-ZàâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ\s'-]+$/;
  return nameRegex.test(name);
}

/**
 * Validation adresse
 */
export function isValidAddress(address) {
  if (!address || typeof address !== 'string') return false;
  return isValidLength(address, 5, 500);
}

/**
 * Validation ville
 */
export function isValidCity(city) {
  if (!city || typeof city !== 'string') return false;
  return isValidLength(city, 2, 100);
}

/**
 * Validation mot de passe
 */
export function isValidPassword(password) {
  if (!password || typeof password !== 'string') return false;
  return isValidLength(password, 6, 100);
}

/**
 * Validation nombre positif
 */
export function isPositiveNumber(value) {
  const num = Number(value);
  return !isNaN(num) && num > 0;
}

/**
 * Validation quantité
 */
export function isValidQuantity(quantity) {
  const num = Number(quantity);
  return Number.isInteger(num) && num > 0 && num <= 1000;
}