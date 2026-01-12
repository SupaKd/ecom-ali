import * as productService from '../services/productService.js';

export async function getProducts(req, res, next) {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function getProductBySlug(req, res, next) {
  try {
    const product = await productService.getProductBySlug(req.params.slug);
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function getProductsByCategory(req, res, next) {
  try {
    const products = await productService.getProductsByCategory(req.params.categoryId);
    res.json(products);
  } catch (error) {
    next(error);
  }
}

export async function getSimilarProducts(req, res, next) {
  try {
    const { brandId, productId } = req.params;
    const products = await productService.getSimilarProducts(brandId, productId);
    res.json(products);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const product = await productService.addProduct(req.body, req.file);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await productService.modifyProduct(req.params.id, req.body, req.file);
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function updateProductStock(req, res, next) {
  try {
    const { stock_quantity } = req.body;
    const product = await productService.modifyProductStock(req.params.id, stock_quantity);
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    await productService.removeProduct(req.params.id);
    res.json({ message: 'Produit supprimé' });
  } catch (error) {
    next(error);
  }
}