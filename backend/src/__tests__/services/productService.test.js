import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import * as productService from '../../services/productService.js';
import * as productRepo from '../../repositories/productRepository.js';
import { mockProduct, mockProducts } from '../helpers/mockData.js';
import { createMockFile } from '../helpers/testUtils.js';

jest.mock('../../repositories/productRepository.js');

describe('ProductService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('devrait retourner tous les produits', async () => {
      productRepo.findAllProducts.mockResolvedValue(mockProducts);

      const result = await productService.getAllProducts();

      expect(productRepo.findAllProducts).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });

    it('devrait retourner un tableau vide si aucun produit', async () => {
      productRepo.findAllProducts.mockResolvedValue([]);

      const result = await productService.getAllProducts();

      expect(result).toEqual([]);
    });
  });

  describe('getProductById', () => {
    it('devrait retourner un produit par son ID', async () => {
      productRepo.findProductById.mockResolvedValue(mockProduct);

      const result = await productService.getProductById(1);

      expect(productRepo.findProductById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });

    it('devrait lever une erreur si le produit n\'existe pas', async () => {
      productRepo.findProductById.mockResolvedValue(null);

      await expect(productService.getProductById(999))
        .rejects.toThrow('Produit introuvable');
    });
  });

  describe('getProductBySlug', () => {
    it('devrait retourner un produit par son slug', async () => {
      productRepo.findProductBySlug.mockResolvedValue(mockProduct);

      const result = await productService.getProductBySlug('test-product');

      expect(productRepo.findProductBySlug).toHaveBeenCalledWith('test-product');
      expect(result).toEqual(mockProduct);
    });

    it('devrait lever une erreur si le slug n\'existe pas', async () => {
      productRepo.findProductBySlug.mockResolvedValue(null);

      await expect(productService.getProductBySlug('non-existent'))
        .rejects.toThrow('Produit introuvable');
    });
  });

  describe('addProduct', () => {
    const validProductData = {
      category_id: 1,
      brand_id: 1,
      name: 'Nouveau Produit',
      slug: 'nouveau-produit',
      description: 'Description',
      price: '99.99',
      stock_quantity: '10',
      sku: 'NEW-001'
    };

    it('devrait créer un produit sans image', async () => {
      productRepo.createProduct.mockResolvedValue(1);
      productRepo.findProductById.mockResolvedValue({ ...mockProduct, id: 1 });

      const result = await productService.addProduct(validProductData);

      expect(productRepo.createProduct).toHaveBeenCalledWith({
        category_id: validProductData.category_id,
        brand_id: validProductData.brand_id,
        name: validProductData.name,
        slug: validProductData.slug,
        description: validProductData.description,
        price: 99.99,
        stock_quantity: 10,
        sku: validProductData.sku
      });
      expect(result).toBeDefined();
    });

    it('devrait créer un produit avec image', async () => {
      const mockFile = createMockFile();
      productRepo.createProduct.mockResolvedValue(1);
      productRepo.createProductImage.mockResolvedValue(1);
      productRepo.findProductById.mockResolvedValue({ ...mockProduct, id: 1 });

      const result = await productService.addProduct(validProductData, mockFile);

      expect(productRepo.createProduct).toHaveBeenCalled();
      expect(productRepo.createProductImage).toHaveBeenCalledWith(
        1,
        `/images/products/${mockFile.filename}`,
        validProductData.name
      );
      expect(result).toBeDefined();
    });

    it('devrait rejeter si le nom est manquant', async () => {
      const invalidData = { ...validProductData, name: '' };

      await expect(productService.addProduct(invalidData))
        .rejects.toThrow('Nom et slug requis');
    });

    it('devrait rejeter si le prix est invalide', async () => {
      const invalidData = { ...validProductData, price: '-10' };

      await expect(productService.addProduct(invalidData))
        .rejects.toThrow('Prix invalide');
    });

    it('devrait rejeter si le stock est invalide', async () => {
      const invalidData = { ...validProductData, stock_quantity: '-5' };

      await expect(productService.addProduct(invalidData))
        .rejects.toThrow('Stock invalide');
    });
  });

  describe('modifyProduct', () => {
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
      productRepo.findProductById
        .mockResolvedValueOnce(mockProduct)
        .mockResolvedValueOnce({ ...mockProduct, ...updateData });
      productRepo.updateProduct.mockResolvedValue(true);

      const result = await productService.modifyProduct(1, updateData);

      expect(productRepo.updateProduct).toHaveBeenCalledWith(1, expect.objectContaining({
        name: updateData.name,
        slug: updateData.slug,
        price: 149.99,
        stock_quantity: 20
      }));
      expect(result).toBeDefined();
    });

    it('devrait rejeter si le produit n\'existe pas', async () => {
      productRepo.findProductById.mockResolvedValue(null);

      await expect(productService.modifyProduct(999, updateData))
        .rejects.toThrow('Produit introuvable');
    });
  });

  describe('modifyProductStock', () => {
    it('devrait mettre à jour le stock d\'un produit', async () => {
      productRepo.findProductById
        .mockResolvedValueOnce(mockProduct)
        .mockResolvedValueOnce({ ...mockProduct, stock_quantity: 50 });
      productRepo.updateProductStock.mockResolvedValue(true);

      const result = await productService.modifyProductStock(1, 50);

      expect(productRepo.updateProductStock).toHaveBeenCalledWith(1, 50);
      expect(result).toBeDefined();
    });

    it('devrait rejeter si la quantité est invalide', async () => {
      productRepo.findProductById.mockResolvedValue(mockProduct);

      await expect(productService.modifyProductStock(1, -10))
        .rejects.toThrow('Stock invalide');
    });
  });

  describe('removeProduct', () => {
    it('devrait supprimer un produit existant', async () => {
      productRepo.findProductById.mockResolvedValue(mockProduct);
      productRepo.deleteProduct.mockResolvedValue(true);

      const result = await productService.removeProduct(1);

      expect(productRepo.deleteProduct).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('devrait rejeter si le produit n\'existe pas', async () => {
      productRepo.findProductById.mockResolvedValue(null);

      await expect(productService.removeProduct(999))
        .rejects.toThrow('Produit introuvable');
    });
  });
});
