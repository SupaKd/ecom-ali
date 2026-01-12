import pool from '../config/database.js';

export async function findAdminByEmail(email) {
  const [rows] = await pool.query(
    'SELECT * FROM admins WHERE email = ? AND is_active = TRUE',
    [email]
  );
  return rows[0] || null;
}

export async function updateLastLogin(adminId) {
  await pool.query(
    'UPDATE admins SET last_login = NOW() WHERE id = ?',
    [adminId]
  );
}