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
  try {
    const [result] = await pool.query(
      'INSERT INTO categories (name, slug, image_url, display_order) VALUES (?, ?, ?, ?)',
      [data.name, data.slug, data.image_url || null, data.display_order || 0]
    );
    return result.insertId;
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      const err = new Error();
      err.status = 400;
      if (error.message.includes('name')) {
        err.message = 'Une catégorie avec ce nom existe déjà';
      } else if (error.message.includes('slug')) {
        err.message = 'Une catégorie avec ce slug existe déjà';
      } else {
        err.message = 'Cette catégorie existe déjà';
      }
      throw err;
    }
    throw error;
  }
}

export async function updateCategory(id, data) {
  try {
    const [result] = await pool.query(
      'UPDATE categories SET name = ?, slug = ?, image_url = ?, display_order = ? WHERE id = ?',
      [data.name, data.slug, data.image_url, data.display_order, id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      const err = new Error();
      err.status = 400;
      if (error.message.includes('name')) {
        err.message = 'Une catégorie avec ce nom existe déjà';
      } else if (error.message.includes('slug')) {
        err.message = 'Une catégorie avec ce slug existe déjà';
      } else {
        err.message = 'Cette catégorie existe déjà';
      }
      throw err;
    }
    throw error;
  }
}

export async function deleteCategory(id) {
  // Suppression définitive de la base de données
  const [result] = await pool.query(
    'DELETE FROM categories WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
}