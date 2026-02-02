import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import * as orderService from '../../services/orderService.js';
import * as orderRepo from '../../repositories/orderRepository.js';
import * as productRepo from '../../repositories/productRepository.js';
import { mockOrder, mockOrderItems, mockOrderWithItems, mockCreateOrderData, mockProduct } from '../helpers/mockData.js';

jest.mock('../../repositories/orderRepository.js');
jest.mock('../../repositories/productRepository.js');
jest.mock('../../utils/orderNumber.js', () => ({
  generateOrderNumber: jest.fn(() => 'ORD-20260130-001')
}));

describe('OrderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllOrders', () => {
    it('devrait retourner toutes les commandes', async () => {
      const mockOrders = [mockOrder];
      orderRepo.findAllOrders.mockResolvedValue(mockOrders);

      const result = await orderService.getAllOrders();

      expect(orderRepo.findAllOrders).toHaveBeenCalled();
      expect(result).toEqual(mockOrders);
    });
  });

  describe('getOrderById', () => {
    it('devrait retourner une commande avec ses articles', async () => {
      orderRepo.findOrderById.mockResolvedValue(mockOrder);
      orderRepo.findOrderItems.mockResolvedValue(mockOrderItems);

      const result = await orderService.getOrderById(1);

      expect(orderRepo.findOrderById).toHaveBeenCalledWith(1);
      expect(orderRepo.findOrderItems).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockOrderWithItems);
    });

    it('devrait lever une erreur si la commande n\'existe pas', async () => {
      orderRepo.findOrderById.mockResolvedValue(null);

      await expect(orderService.getOrderById(999))
        .rejects.toThrow('Commande introuvable');
    });
  });

  describe('getOrderByNumber', () => {
    it('devrait retourner une commande par son numéro', async () => {
      orderRepo.findOrderByNumber.mockResolvedValue(mockOrder);
      orderRepo.findOrderItems.mockResolvedValue(mockOrderItems);

      const result = await orderService.getOrderByNumber('ORD-20260130-001');

      expect(orderRepo.findOrderByNumber).toHaveBeenCalledWith('ORD-20260130-001');
      expect(result).toEqual(mockOrderWithItems);
    });

    it('devrait lever une erreur si le numéro n\'existe pas', async () => {
      orderRepo.findOrderByNumber.mockResolvedValue(null);

      await expect(orderService.getOrderByNumber('INVALID'))
        .rejects.toThrow('Commande introuvable');
    });
  });

  describe('getOrdersByEmail', () => {
    it('devrait retourner les commandes d\'un client', async () => {
      const mockOrders = [mockOrder];
      orderRepo.findOrdersByEmail.mockResolvedValue(mockOrders);

      const result = await orderService.getOrdersByEmail('customer@test.com');

      expect(orderRepo.findOrdersByEmail).toHaveBeenCalledWith('customer@test.com');
      expect(result).toEqual(mockOrders);
    });
  });

  describe('createOrder', () => {
    it('devrait créer une commande valide', async () => {
      productRepo.findProductById.mockResolvedValue(mockProduct);
      orderRepo.createOrder.mockResolvedValue(1);
      orderRepo.createOrderItem.mockResolvedValue(1);
      productRepo.updateProductStock.mockResolvedValue(true);
      orderRepo.findOrderById.mockResolvedValue(mockOrder);
      orderRepo.findOrderItems.mockResolvedValue(mockOrderItems);

      const result = await orderService.createOrder(mockCreateOrderData);

      expect(productRepo.findProductById).toHaveBeenCalledWith(1);
      expect(orderRepo.createOrder).toHaveBeenCalledWith(expect.objectContaining({
        customer_email: mockCreateOrderData.customer_email,
        customer_name: mockCreateOrderData.customer_name,
        total_amount: 199.98,
        payment_status: 'pending',
        order_status: 'pending'
      }));
      expect(orderRepo.createOrderItem).toHaveBeenCalled();
      expect(productRepo.updateProductStock).toHaveBeenCalledWith(1, 8);
      expect(result).toEqual(mockOrderWithItems);
    });

    it('devrait rejeter si l\'email est invalide', async () => {
      const invalidData = { ...mockCreateOrderData, customer_email: 'invalid-email' };

      await expect(orderService.createOrder(invalidData))
        .rejects.toThrow('Email invalide');
    });

    it('devrait rejeter si le nom est manquant', async () => {
      const invalidData = { ...mockCreateOrderData, customer_name: '' };

      await expect(orderService.createOrder(invalidData))
        .rejects.toThrow('Nom requis');
    });

    it('devrait rejeter si le panier est vide', async () => {
      const invalidData = { ...mockCreateOrderData, items: [] };

      await expect(orderService.createOrder(invalidData))
        .rejects.toThrow('Panier vide');
    });

    it('devrait rejeter si un produit n\'existe pas', async () => {
      productRepo.findProductById.mockResolvedValue(null);

      await expect(orderService.createOrder(mockCreateOrderData))
        .rejects.toThrow('Produit 1 introuvable');
    });

    it('devrait rejeter si le stock est insuffisant', async () => {
      productRepo.findProductById.mockResolvedValue({
        ...mockProduct,
        stock_quantity: 1
      });

      await expect(orderService.createOrder(mockCreateOrderData))
        .rejects.toThrow('Stock insuffisant pour Test Product');
    });

    it('devrait rejeter si la quantité est invalide', async () => {
      const invalidData = {
        ...mockCreateOrderData,
        items: [{ product_id: 1, quantity: -5 }]
      };

      await expect(orderService.createOrder(invalidData))
        .rejects.toThrow('Quantité invalide');
    });
  });

  describe('changeOrderStatus', () => {
    it('devrait modifier le statut d\'une commande', async () => {
      orderRepo.findOrderById
        .mockResolvedValueOnce(mockOrder)
        .mockResolvedValueOnce({ ...mockOrder, order_status: 'processing' });
      orderRepo.updateOrderStatus.mockResolvedValue(true);
      orderRepo.findOrderItems.mockResolvedValue(mockOrderItems);

      const result = await orderService.changeOrderStatus(1, 'processing');

      expect(orderRepo.updateOrderStatus).toHaveBeenCalledWith(1, 'processing');
      expect(result.order_status).toBe('processing');
    });

    it('devrait rejeter si la commande n\'existe pas', async () => {
      orderRepo.findOrderById.mockResolvedValue(null);

      await expect(orderService.changeOrderStatus(999, 'processing'))
        .rejects.toThrow('Commande introuvable');
    });

    it('devrait rejeter si le statut est invalide', async () => {
      orderRepo.findOrderById.mockResolvedValue(mockOrder);

      await expect(orderService.changeOrderStatus(1, 'invalid-status'))
        .rejects.toThrow('Statut invalide');
    });
  });

  describe('updatePaymentStatus', () => {
    it('devrait mettre à jour le statut de paiement', async () => {
      orderRepo.findOrderByNumber.mockResolvedValue(mockOrder);
      orderRepo.updateOrderPaymentStatus.mockResolvedValue(true);
      orderRepo.updateOrderStatus.mockResolvedValue(true);
      orderRepo.findOrderById.mockResolvedValue({
        ...mockOrder,
        payment_status: 'paid',
        order_status: 'processing'
      });
      orderRepo.findOrderItems.mockResolvedValue(mockOrderItems);

      const result = await orderService.updatePaymentStatus(
        'ORD-20260130-001',
        'pi_test123',
        'paid'
      );

      expect(orderRepo.updateOrderPaymentStatus).toHaveBeenCalledWith(
        mockOrder.id,
        'paid',
        'pi_test123'
      );
      expect(orderRepo.updateOrderStatus).toHaveBeenCalledWith(mockOrder.id, 'processing');
    });

    it('devrait rejeter si la commande n\'existe pas', async () => {
      orderRepo.findOrderByNumber.mockResolvedValue(null);

      await expect(orderService.updatePaymentStatus('INVALID', 'pi_test', 'paid'))
        .rejects.toThrow('Commande introuvable');
    });
  });
});
