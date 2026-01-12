import pool from '../config/database.js';

export async function findAllProducts() {
  const [rows] = await pool.query(`
    SELECT p.*, c.name as category_name, b.name as brand_name, pi.image_url
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE p.is_active = TRUE
    ORDER BY p.created_at DESC
  `);
  return rows;
}

export async function findProductById(id) {
  const [rows] = await pool.query(`
    SELECT p.*, c.name as category_name, b.name as brand_name, pi.image_url
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE p.id = ?
  `, [id]);
  return rows[0] || null;
}

export async function findProductBySlug(slug) {
  const [rows] = await pool.query(`
    SELECT p.*, c.name as category_name, b.name as brand_name, pi.image_url
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE p.slug = ?
  `, [slug]);
  return rows[0] || null;
}

export async function findProductsByCategory(categoryId) {
  const [rows] = await pool.query(`
    SELECT p.*, c.name as category_name, b.name as brand_name, pi.image_url
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE p.category_id = ? AND p.is_active = TRUE
    ORDER BY p.created_at DESC
  `, [categoryId]);
  return rows;
}

export async function findProductsByBrand(brandId, excludeId = null) {
  let query = `
    SELECT p.*, c.name as category_name, b.name as brand_name, pi.image_url
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE p.brand_id = ? AND p.is_active = TRUE
  `;
  
  const params = [brandId];
  
  if (excludeId) {
    query += ' AND p.id != ?';
    params.push(excludeId);
  }
  
  query += ' LIMIT 4';
  
  const [rows] = await pool.query(query, params);
  return rows;
}

export async function createProduct(data) {
  const [result] = await pool.query(`
    INSERT INTO products 
    (category_id, brand_id, name, slug, description, price, stock_quantity, sku) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    data.category_id,
    data.brand_id,
    data.name,
    data.slug,
    data.description || null,
    data.price,
    data.stock_quantity || 0,
    data.sku || null
  ]);
  return result.insertId;
}

export async function updateProduct(id, data) {
  const [result] = await pool.query(`
    UPDATE products 
    SET category_id = ?, brand_id = ?, name = ?, slug = ?, 
        description = ?, price = ?, stock_quantity = ?, sku = ?
    WHERE id = ?
  `, [
    data.category_id,
    data.brand_id,
    data.name,
    data.slug,
    data.description,
    data.price,
    data.stock_quantity,
    data.sku,
    id
  ]);
  return result.affectedRows > 0;
}

export async function updateProductStock(id, quantity) {
  const [result] = await pool.query(
    'UPDATE products SET stock_quantity = ? WHERE id = ?',
    [quantity, id]
  );
  return result.affectedRows > 0;
}

export async function deleteProduct(id) {
  const [result] = await pool.query(
    'UPDATE products SET is_active = FALSE WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
}

export async function createProductImage(productId, imageUrl, altText) {
  const [result] = await pool.query(
    'INSERT INTO product_images (product_id, image_url, alt_text) VALUES (?, ?, ?)',
    [productId, imageUrl, altText]
  );
  return result.insertId;
}

export async function updateProductImage(productId, imageUrl, altText) {
  const [result] = await pool.query(
    'UPDATE product_images SET image_url = ?, alt_text = ? WHERE product_id = ?',
    [imageUrl, altText, productId]
  );
  return result.affectedRows > 0;
}

export async function deleteProductImage(productId) {
  const [result] = await pool.query(
    'DELETE FROM product_images WHERE product_id = ?',
    [productId]
  );
  return result.affectedRows > 0;
}