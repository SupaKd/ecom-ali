import { describe, it, expect } from '@jest/globals';
import {
  isValidEmail,
  isValidPrice,
  isValidStock,
  isValidQuantity,
  sanitizeString
} from '../utils/validation.js';

describe('Tests d\'Intégration Simples', () => {
  describe('Validation - isValidEmail', () => {
    it('devrait valider les emails corrects', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user+tag@domain.co.uk')).toBe(true);
    });

    it('devrait rejeter les emails invalides', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('Validation - isValidPrice', () => {
    it('devrait accepter les prix valides (>= 0)', () => {
      expect(isValidPrice(0)).toBe(true);
      expect(isValidPrice(10)).toBe(true);
      expect(isValidPrice('99.99')).toBe(true);
    });

    it('devrait rejeter les prix invalides', () => {
      expect(isValidPrice(-10)).toBe(false);
      expect(isValidPrice('abc')).toBe(false);
      expect(isValidPrice(undefined)).toBe(false);
    });
  });

  describe('Validation - isValidStock', () => {
    it('devrait accepter les stocks valides (entiers >= 0)', () => {
      expect(isValidStock(0)).toBe(true);
      expect(isValidStock(10)).toBe(true);
      expect(isValidStock('50')).toBe(true);
    });

    it('devrait rejeter les stocks invalides', () => {
      expect(isValidStock(-5)).toBe(false);
      expect(isValidStock(1.5)).toBe(false);
      expect(isValidStock('abc')).toBe(false);
    });
  });

  describe('Validation - isValidQuantity', () => {
    it('devrait accepter les quantités valides (entiers > 0)', () => {
      expect(isValidQuantity(1)).toBe(true);
      expect(isValidQuantity(10)).toBe(true);
      expect(isValidQuantity('5')).toBe(true);
    });

    it('devrait rejeter les quantités invalides', () => {
      expect(isValidQuantity(0)).toBe(false);
      expect(isValidQuantity(-5)).toBe(false);
      expect(isValidQuantity(1.5)).toBe(false);
    });
  });

  describe('Sanitization - sanitizeString', () => {
    it('devrait nettoyer les chaînes', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
      expect(sanitizeString('Hello World')).toBe('Hello World');
      expect(sanitizeString('')).toBe('');
    });

    it('devrait gérer null et undefined', () => {
      expect(sanitizeString(null)).toBe('');
      expect(sanitizeString(undefined)).toBe('');
    });
  });
});
