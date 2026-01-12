import * as orderRepo from '../repositories/orderRepository.js';
import * as productRepo from '../repositories/productRepository.js';
import { generateOrderNumber } from '../utils/orderNumber.js';
import { isValidEmail, isValidQuantity, sanitizeString } from '../utils/validation.js';

export async function getAllOrders() {
  return await orderRepo.findAllOrders();
}

export async function getOrderById(id) {
  const order = await orderRepo.findOrderById(id);
  
  if (!order) {
    throw new Error('Commande introuvable');
  }
  
  const items = await orderRepo.findOrderItems(id);
  
  return {
    ...order,
    items
  };
}

export async function getOrderByNumber(orderNumber) {
  const order = await orderRepo.findOrderByNumber(orderNumber);
  
  if (!order) {
    throw new Error('Commande introuvable');
  }
  
  const items = await orderRepo.findOrderItems(order.id);
  
  return {
    ...order,
    items
  };
}

export async function getOrdersByEmail(email) {
  return await orderRepo.findOrdersByEmail(email);
}

export async function createOrder(data) {
  const customerEmail = sanitizeString(data.customer_email);
  const customerName = sanitizeString(data.customer_name);
  
  if (!isValidEmail(customerEmail)) {
    throw new Error('Email invalide');
  }
  
  if (!customerName) {
    throw new Error('Nom requis');
  }
  
  if (!data.items || data.items.length === 0) {
    throw new Error('Panier vide');
  }
  
  let totalAmount = 0;
  const validatedItems = [];
  
  for (const item of data.items) {
    if (!isValidQuantity(item.quantity)) {
      throw new Error('Quantité invalide');
    }
    
    const product = await productRepo.findProductById(item.product_id);
    
    if (!product) {
      throw new Error(`Produit ${item.product_id} introuvable`);
    }
    
    if (product.stock_quantity < item.quantity) {
      throw new Error(`Stock insuffisant pour ${product.name}`);
    }
    
    const subtotal = product.price * item.quantity;
    totalAmount += subtotal;
    
    validatedItems.push({
      product_id: product.id,
      product_name: product.name,
      quantity: item.quantity,
      unit_price: product.price,
      subtotal
    });
  }
  
  const orderNumber = generateOrderNumber();
  
  const orderId = await orderRepo.createOrder({
    order_number: orderNumber,
    customer_email: customerEmail,
    customer_name: customerName,
    customer_phone: sanitizeString(data.customer_phone),
    shipping_address: sanitizeString(data.shipping_address),
    shipping_city: sanitizeString(data.shipping_city),
    shipping_postal_code: sanitizeString(data.shipping_postal_code),
    shipping_country: sanitizeString(data.shipping_country) || 'France',
    total_amount: totalAmount,
    payment_status: 'pending',
    order_status: 'pending'
  });
  
  for (const item of validatedItems) {
    await orderRepo.createOrderItem({
      order_id: orderId,
      ...item
    });
    
    const newStock = await productRepo.findProductById(item.product_id);
    await productRepo.updateProductStock(
      item.product_id,
      newStock.stock_quantity - item.quantity
    );
  }
  
  return await getOrderById(orderId);
}

export async function changeOrderStatus(id, status) {
  const order = await orderRepo.findOrderById(id);
  
  if (!order) {
    throw new Error('Commande introuvable');
  }
  
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(status)) {
    throw new Error('Statut invalide');
  }
  
  await orderRepo.updateOrderStatus(id, status);
  return await getOrderById(id);
}

export async function updatePaymentStatus(orderNumber, paymentId, status) {
  const order = await orderRepo.findOrderByNumber(orderNumber);
  
  if (!order) {
    throw new Error('Commande introuvable');
  }
  
  await orderRepo.updateOrderPaymentStatus(order.id, status, paymentId);
  
  if (status === 'paid') {
    await orderRepo.updateOrderStatus(order.id, 'processing');
  }
  
  return await getOrderById(order.id);
}