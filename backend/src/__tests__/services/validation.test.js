import { describe, it, expect } from '@jest/globals';
import {
  isValidEmail,
  isValidPrice,
  isValidStock,
  isValidQuantity,
  sanitizeString
} from '../../utils/validation.js';

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('devrait valider un email correct', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('test+tag@example.com')).toBe(true);
    });

    it('devrait rejeter un email invalide', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
    });
  });

  describe('isValidPrice', () => {
    it('devrait valider un prix correct', () => {
      expect(isValidPrice(10)).toBe(true);
      expect(isValidPrice('99.99')).toBe(true);
      expect(isValidPrice('0.01')).toBe(true);
      expect(isValidPrice(1000000)).toBe(true);
      expect(isValidPrice(0)).toBe(true);
    });

    it('devrait rejeter un prix invalide', () => {
      expect(isValidPrice(-10)).toBe(false);
      expect(isValidPrice('-5')).toBe(false);
      expect(isValidPrice('abc')).toBe(false);
      expect(isValidPrice(null)).toBe(false);
      expect(isValidPrice(undefined)).toBe(false);
    });
  });

  describe('isValidStock', () => {
    it('devrait valider un stock correct', () => {
      expect(isValidStock(0)).toBe(true);
      expect(isValidStock(10)).toBe(true);
      expect(isValidStock('50')).toBe(true);
      expect(isValidStock(1000000)).toBe(true);
    });

    it('devrait rejeter un stock invalide', () => {
      expect(isValidStock(-10)).toBe(false);
      expect(isValidStock('-5')).toBe(false);
      expect(isValidStock('abc')).toBe(false);
      expect(isValidStock(1.5)).toBe(false);
    });
  });

  describe('isValidQuantity', () => {
    it('devrait valider une quantité correcte', () => {
      expect(isValidQuantity(1)).toBe(true);
      expect(isValidQuantity(10)).toBe(true);
      expect(isValidQuantity('5')).toBe(true);
    });

    it('devrait rejeter une quantité invalide', () => {
      expect(isValidQuantity(0)).toBe(false);
      expect(isValidQuantity(-5)).toBe(false);
      expect(isValidQuantity('0')).toBe(false);
      expect(isValidQuantity('abc')).toBe(false);
      expect(isValidQuantity(null)).toBe(false);
      expect(isValidQuantity(1.5)).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    it('devrait nettoyer et trim une chaîne', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
      expect(sanitizeString('Hello World')).toBe('Hello World');
      expect(sanitizeString('')).toBe('');
    });

    it('devrait gérer les valeurs nulles ou undefined', () => {
      expect(sanitizeString(null)).toBe('');
      expect(sanitizeString(undefined)).toBe('');
    });

    it('devrait retourner la chaîne nettoyée', () => {
      const input = '<script>alert("XSS")</script>';
      const result = sanitizeString(input);
      expect(result).toBe('<script>alert("XSS")</script>');
    });
  });
});
