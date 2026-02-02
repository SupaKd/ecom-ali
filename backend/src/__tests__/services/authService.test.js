import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import bcrypt from 'bcrypt';
import { loginAdmin } from '../../services/authService.js';
import * as adminRepository from '../../repositories/adminRepository.js';
import * as jwt from '../../utils/jwt.js';
import { mockAdmin } from '../helpers/mockData.js';

jest.mock('../../repositories/adminRepository.js');
jest.mock('../../utils/jwt.js');
jest.mock('bcrypt');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginAdmin', () => {
    const validEmail = 'admin@test.com';
    const validPassword = 'password123';
    const mockToken = 'mock-jwt-token';

    it('devrait connecter un admin avec des identifiants valides', async () => {
      adminRepository.findAdminByEmail.mockResolvedValue(mockAdmin);
      bcrypt.compare.mockResolvedValue(true);
      adminRepository.updateLastLogin.mockResolvedValue(true);
      jwt.generateToken.mockReturnValue(mockToken);

      const result = await loginAdmin(validEmail, validPassword);

      expect(adminRepository.findAdminByEmail).toHaveBeenCalledWith(validEmail);
      expect(bcrypt.compare).toHaveBeenCalledWith(validPassword, mockAdmin.password_hash);
      expect(adminRepository.updateLastLogin).toHaveBeenCalledWith(mockAdmin.id);
      expect(jwt.generateToken).toHaveBeenCalledWith({
        id: mockAdmin.id,
        email: mockAdmin.email,
        role: mockAdmin.role
      });

      expect(result).toEqual({
        token: mockToken,
        admin: {
          id: mockAdmin.id,
          email: mockAdmin.email,
          name: mockAdmin.name,
          role: mockAdmin.role
        }
      });
    });

    it('devrait rejeter si l\'email n\'existe pas', async () => {
      adminRepository.findAdminByEmail.mockResolvedValue(null);

      await expect(loginAdmin(validEmail, validPassword))
        .rejects.toThrow('Email ou mot de passe incorrect');

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(adminRepository.updateLastLogin).not.toHaveBeenCalled();
      expect(jwt.generateToken).not.toHaveBeenCalled();
    });

    it('devrait rejeter si le mot de passe est incorrect', async () => {
      adminRepository.findAdminByEmail.mockResolvedValue(mockAdmin);
      bcrypt.compare.mockResolvedValue(false);

      await expect(loginAdmin(validEmail, 'wrongpassword'))
        .rejects.toThrow('Email ou mot de passe incorrect');

      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', mockAdmin.password_hash);
      expect(adminRepository.updateLastLogin).not.toHaveBeenCalled();
      expect(jwt.generateToken).not.toHaveBeenCalled();
    });

    it('devrait propager les erreurs de la base de données', async () => {
      const dbError = new Error('Database connection failed');
      adminRepository.findAdminByEmail.mockRejectedValue(dbError);

      await expect(loginAdmin(validEmail, validPassword))
        .rejects.toThrow('Database connection failed');
    });
  });
});
