import { describe, it, expect, jest, beforeEach, afterAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import orderRoutes from '../../routes/orders.js';
import * as orderService from '../../services/orderService.js';
import { mockOrder, mockOrderWithItems, mockCreateOrderData } from '../helpers/mockData.js';

jest.mock('../../services/orderService.js');
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
app.use('/api/orders', orderRoutes);

describe('Orders API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/orders', () => {
    it('devrait retourner toutes les commandes', async () => {
      const mockOrders = [mockOrder];
      orderService.getAllOrders.mockResolvedValue(mockOrders);

      const response = await request(app)
        .get('/api/orders')
        .expect(200);

      expect(response.body).toEqual(mockOrders);
      expect(orderService.getAllOrders).toHaveBeenCalled();
    });
  });

  describe('GET /api/orders/:id', () => {
    it('devrait retourner une commande par ID', async () => {
      orderService.getOrderById.mockResolvedValue(mockOrderWithItems);

      const response = await request(app)
        .get('/api/orders/1')
        .expect(200);

      expect(response.body).toEqual(mockOrderWithItems);
      expect(orderService.getOrderById).toHaveBeenCalledWith('1');
    });

    it('devrait retourner une erreur si la commande n\'existe pas', async () => {
      orderService.getOrderById.mockRejectedValue(new Error('Commande introuvable'));

      const response = await request(app)
        .get('/api/orders/999')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/orders/number/:orderNumber', () => {
    it('devrait retourner une commande par numéro', async () => {
      orderService.getOrderByNumber.mockResolvedValue(mockOrderWithItems);

      const response = await request(app)
        .get('/api/orders/number/ORD-20260130-001')
        .expect(200);

      expect(response.body).toEqual(mockOrderWithItems);
      expect(orderService.getOrderByNumber).toHaveBeenCalledWith('ORD-20260130-001');
    });
  });

  describe('POST /api/orders', () => {
    it('devrait créer une nouvelle commande', async () => {
      orderService.createOrder.mockResolvedValue(mockOrderWithItems);

      const response = await request(app)
        .post('/api/orders')
        .send(mockCreateOrderData)
        .expect(201);

      expect(response.body).toEqual(mockOrderWithItems);
      expect(orderService.createOrder).toHaveBeenCalledWith(mockCreateOrderData);
    });

    it('devrait rejeter si les données sont invalides', async () => {
      orderService.createOrder.mockRejectedValue(new Error('Email invalide'));

      const response = await request(app)
        .post('/api/orders')
        .send({ ...mockCreateOrderData, customer_email: 'invalid' })
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });

    it('devrait rejeter si le panier est vide', async () => {
      orderService.createOrder.mockRejectedValue(new Error('Panier vide'));

      const response = await request(app)
        .post('/api/orders')
        .send({ ...mockCreateOrderData, items: [] })
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PATCH /api/orders/:id/status', () => {
    it('devrait mettre à jour le statut d\'une commande', async () => {
      const updatedOrder = { ...mockOrderWithItems, order_status: 'processing' };
      orderService.changeOrderStatus.mockResolvedValue(updatedOrder);

      const response = await request(app)
        .patch('/api/orders/1/status')
        .send({ status: 'processing' })
        .expect(200);

      expect(response.body).toEqual(updatedOrder);
      expect(orderService.changeOrderStatus).toHaveBeenCalledWith('1', 'processing');
    });

    it('devrait rejeter si le statut est invalide', async () => {
      orderService.changeOrderStatus.mockRejectedValue(new Error('Statut invalide'));

      const response = await request(app)
        .patch('/api/orders/1/status')
        .send({ status: 'invalid-status' })
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/orders/customer/:email', () => {
    it('devrait retourner les commandes d\'un client', async () => {
      const mockOrders = [mockOrder];
      orderService.getOrdersByEmail.mockResolvedValue(mockOrders);

      const response = await request(app)
        .get('/api/orders/customer/customer@test.com')
        .expect(200);

      expect(response.body).toEqual(mockOrders);
      expect(orderService.getOrdersByEmail).toHaveBeenCalledWith('customer@test.com');
    });

    it('devrait retourner un tableau vide si aucune commande', async () => {
      orderService.getOrdersByEmail.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/orders/customer/unknown@test.com')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });
});
