import pool from '../config/database.js';

export async function findAllCategories() {
  const [rows] = await pool.query(
    'SELECT * FROM categories WHERE is_active = TRUE ORDER BY display_order ASC'
  );
  return rows;
}

export async function findCategoryById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM categories WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

export async function findCategoryBySlug(slug) {
  const [rows] = await pool.query(
    'SELECT * FROM categories WHERE slug = ?',
    [slug]
  );
  return rows[0] || null;
}

export async function createCategory(data) {
  const [result] = await pool.query(
    'INSERT INTO categories (name, slug, image_url, display_order) VALUES (?, ?, ?, ?)',
    [data.name, data.slug, data.image_url || null, data.display_order || 0]
  );
  return result.insertId;
}

export async function updateCategory(id, data) {
  const [result] = await pool.query(
    'UPDATE categories SET name = ?, slug = ?, image_url = ?, display_order = ? WHERE id = ?',
    [data.name, data.slug, data.image_url, data.display_order, id]
  );
  return result.affectedRows > 0;
}

export async function deleteCategory(id) {
  const [result] = await pool.query(
    'UPDATE categories SET is_active = FALSE WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
}