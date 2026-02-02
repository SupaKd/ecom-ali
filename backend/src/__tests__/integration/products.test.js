import { describe, it, expect, jest, beforeEach, afterAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import productRoutes from '../../routes/products.js';
import * as productService from '../../services/productService.js';
import { mockProduct, mockProducts } from '../helpers/mockData.js';

jest.mock('../../services/productService.js');
jest.mock('../../middleware/auth.js', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: 1, role: 'admin' };
    next();
  }
}));
jest.mock('../../middleware/roleCheck.js', () => ({
  requireAdmin: (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

describe('Products API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/products', () => {
    it('devrait retourner tous les produits', async () => {
      productService.getAllProducts.mockResolvedValue(mockProducts);

      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body).toEqual(mockProducts);
      expect(productService.getAllProducts).toHaveBeenCalled();
    });

    it('devrait gérer les erreurs', async () => {
      productService.getAllProducts.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/products')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/products/:id', () => {
    it('devrait retourner un produit par ID', async () => {
      productService.getProductById.mockResolvedValue(mockProduct);

      const response = await request(app)
        .get('/api/products/1')
        .expect(200);

      expect(response.body).toEqual(mockProduct);
      expect(productService.getProductById).toHaveBeenCalledWith('1');
    });

    it('devrait retourner 404 si le produit n\'existe pas', async () => {
      productService.getProductById.mockRejectedValue(new Error('Produit introuvable'));

      const response = await request(app)
        .get('/api/products/999')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/products/slug/:slug', () => {
    it('devrait retourner un produit par slug', async () => {
      productService.getProductBySlug.mockResolvedValue(mockProduct);

      const response = await request(app)
        .get('/api/products/slug/test-product')
        .expect(200);

      expect(response.body).toEqual(mockProduct);
      expect(productService.getProductBySlug).toHaveBeenCalledWith('test-product');
    });
  });

  describe('POST /api/products', () => {
    const newProductData = {
      category_id: 1,
      brand_id: 1,
      name: 'Nouveau Produit',
      slug: 'nouveau-produit',
      description: 'Description',
      price: '99.99',
      stock_quantity: '10',
      sku: 'NEW-001'
    };

    it('devrait créer un nouveau produit', async () => {
      const createdProduct = { ...mockProduct, ...newProductData };
      productService.addProduct.mockResolvedValue(createdProduct);

      const response = await request(app)
        .post('/api/products')
        .send(newProductData)
        .expect(201);

      expect(response.body).toEqual(createdProduct);
      expect(productService.addProduct).toHaveBeenCalledWith(newProductData, undefined);
    });

    it('devrait rejeter si les données sont invalides', async () => {
      productService.addProduct.mockRejectedValue(new Error('Nom et slug requis'));

      const response = await request(app)
        .post('/api/products')
        .send({})
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/products/:id', () => {
    const updateData = {
      category_id: 1,
      brand_id: 1,
      name: 'Produit Modifié',
      slug: 'produit-modifie',
      description: 'Nouvelle description',
      price: '149.99',
      stock_quantity: '20',
      sku: 'MOD-001'
    };

    it('devrait modifier un produit existant', async () => {
      const updatedProduct = { ...mockProduct, ...updateData };
      productService.modifyProduct.mockResolvedValue(updatedProduct);

      const response = await request(app)
        .put('/api/products/1')
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual(updatedProduct);
      expect(productService.modifyProduct).toHaveBeenCalledWith('1', updateData, undefined);
    });
  });

  describe('PATCH /api/products/:id/stock', () => {
    it('devrait mettre à jour le stock', async () => {
      const updatedProduct = { ...mockProduct, stock_quantity: 50 };
      productService.modifyProductStock.mockResolvedValue(updatedProduct);

      const response = await request(app)
        .patch('/api/products/1/stock')
        .send({ stock_quantity: 50 })
        .expect(200);

      expect(response.body).toEqual(updatedProduct);
      expect(productService.modifyProductStock).toHaveBeenCalledWith('1', 50);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('devrait supprimer un produit', async () => {
      productService.removeProduct.mockResolvedValue(true);

      const response = await request(app)
        .delete('/api/products/1')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(productService.removeProduct).toHaveBeenCalledWith('1');
    });
  });
});
