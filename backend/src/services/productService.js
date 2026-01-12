import * as productRepo from '../repositories/productRepository.js';
import { isValidPrice, isValidStock, sanitizeString } from '../utils/validation.js';

export async function getAllProducts() {
  return await productRepo.findAllProducts();
}

export async function getProductById(id) {
  const product = await productRepo.findProductById(id);
  
  if (!product) {
    throw new Error('Produit introuvable');
  }
  
  return product;
}

export async function getProductBySlug(slug) {
  const product = await productRepo.findProductBySlug(slug);
  
  if (!product) {
    throw new Error('Produit introuvable');
  }
  
  return product;
}

export async function getProductsByCategory(categoryId) {
  return await productRepo.findProductsByCategory(categoryId);
}

export async function getSimilarProducts(brandId, productId) {
  return await productRepo.findProductsByBrand(brandId, productId);
}

export async function addProduct(data, imageFile) {
  const name = sanitizeString(data.name);
  const slug = sanitizeString(data.slug);
  
  if (!name || !slug) {
    throw new Error('Nom et slug requis');
  }
  
  if (!isValidPrice(data.price)) {
    throw new Error('Prix invalide');
  }
  
  if (!isValidStock(data.stock_quantity)) {
    throw new Error('Stock invalide');
  }
  
  const productId = await productRepo.createProduct({
    category_id: data.category_id,
    brand_id: data.brand_id,
    name,
    slug,
    description: sanitizeString(data.description),
    price: Number(data.price),
    stock_quantity: Number(data.stock_quantity),
    sku: sanitizeString(data.sku)
  });
  
  if (imageFile) {
    const imageUrl = `/images/products/${imageFile.filename}`;
    await productRepo.createProductImage(productId, imageUrl, name);
  }
  
  return await productRepo.findProductById(productId);
}

export async function modifyProduct(id, data, imageFile) {
  const product = await productRepo.findProductById(id);
  
  if (!product) {
    throw new Error('Produit introuvable');
  }
  
  const name = sanitizeString(data.name);
  const slug = sanitizeString(data.slug);
  
  if (!name || !slug) {
    throw new Error('Nom et slug requis');
  }
  
  if (!isValidPrice(data.price)) {
    throw new Error('Prix invalide');
  }
  
  if (!isValidStock(data.stock_quantity)) {
    throw new Error('Stock invalide');
  }
  
  await productRepo.updateProduct(id, {
    category_id: data.category_id,
    brand_id: data.brand_id,
    name,
    slug,
    description: sanitizeString(data.description),
    price: Number(data.price),
    stock_quantity: Number(data.stock_quantity),
    sku: sanitizeString(data.sku)
  });
  
  if (imageFile) {
    const imageUrl = `/images/products/${imageFile.filename}`;
    await productRepo.updateProductImage(id, imageUrl, name);
  }
  
  return await productRepo.findProductById(id);
}

export async function modifyProductStock(id, quantity) {
  const product = await productRepo.findProductById(id);
  
  if (!product) {
    throw new Error('Produit introuvable');
  }
  
  if (!isValidStock(quantity)) {
    throw new Error('Stock invalide');
  }
  
  await productRepo.updateProductStock(id, Number(quantity));
  return await productRepo.findProductById(id);
}

export async function removeProduct(id) {
  const product = await productRepo.findProductById(id);
  
  if (!product) {
    throw new Error('Produit introuvable');
  }
  
  return await productRepo.deleteProduct(id);
}