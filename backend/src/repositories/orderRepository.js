import pool from '../config/database.js';

export async function findAllOrders() {
  const [rows] = await pool.query(`
    SELECT o.*, 
           COUNT(oi.id) as items_count
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `);
  return rows;
}

export async function findOrderById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM orders WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

export async function findOrderByNumber(orderNumber) {
  const [rows] = await pool.query(
    'SELECT * FROM orders WHERE order_number = ?',
    [orderNumber]
  );
  return rows[0] || null;
}

export async function findOrdersByEmail(email) {
  const [rows] = await pool.query(
    'SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC',
    [email]
  );
  return rows;
}

export async function findOrdersByStatus(status) {
  const [rows] = await pool.query(
    'SELECT * FROM orders WHERE order_status = ? ORDER BY created_at DESC',
    [status]
  );
  return rows;
}

export async function createOrder(data) {
  const [result] = await pool.query(`
    INSERT INTO orders 
    (order_number, customer_email, customer_name, customer_phone, 
     shipping_address, shipping_city, shipping_postal_code, shipping_country, 
     total_amount, stripe_payment_id, payment_status, order_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    data.order_number,
    data.customer_email,
    data.customer_name,
    data.customer_phone || null,
    data.shipping_address,
    data.shipping_city,
    data.shipping_postal_code,
    data.shipping_country || 'France',
    data.total_amount,
    data.stripe_payment_id || null,
    data.payment_status || 'pending',
    data.order_status || 'pending'
  ]);
  return result.insertId;
}

export async function updateOrderStatus(id, status) {
  const [result] = await pool.query(
    'UPDATE orders SET order_status = ? WHERE id = ?',
    [status, id]
  );
  return result.affectedRows > 0;
}

export async function updateOrderPaymentStatus(id, status, paymentId = null) {
  const [result] = await pool.query(
    'UPDATE orders SET payment_status = ?, stripe_payment_id = ? WHERE id = ?',
    [status, paymentId, id]
  );
  return result.affectedRows > 0;
}

export async function findOrderItems(orderId) {
  const [rows] = await pool.query(
    'SELECT * FROM order_items WHERE order_id = ?',
    [orderId]
  );
  return rows;
}

export async function createOrderItem(data) {
  const [result] = await pool.query(`
    INSERT INTO order_items 
    (order_id, product_id, product_name, quantity, unit_price, subtotal)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    data.order_id,
    data.product_id,
    data.product_name,
    data.quantity,
    data.unit_price,
    data.subtotal
  ]);
  return result.insertId;
}