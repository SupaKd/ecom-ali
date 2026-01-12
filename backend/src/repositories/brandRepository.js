import pool from '../config/database.js';

export async function findAllBrands() {
  const [rows] = await pool.query(
    'SELECT * FROM brands WHERE is_active = TRUE ORDER BY name ASC'
  );
  return rows;
}

export async function findBrandById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM brands WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

export async function findBrandBySlug(slug) {
  const [rows] = await pool.query(
    'SELECT * FROM brands WHERE slug = ?',
    [slug]
  );
  return rows[0] || null;
}

export async function createBrand(data) {
  const [result] = await pool.query(
    'INSERT INTO brands (name, slug, description) VALUES (?, ?, ?)',
    [data.name, data.slug, data.description || null]
  );
  return result.insertId;
}

export async function updateBrand(id, data) {
  const [result] = await pool.query(
    'UPDATE brands SET name = ?, slug = ?, description = ? WHERE id = ?',
    [data.name, data.slug, data.description, id]
  );
  return result.affectedRows > 0;
}

export async function deleteBrand(id) {
  const [result] = await pool.query(
    'UPDATE brands SET is_active = FALSE WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
}