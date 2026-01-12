import transporter from '../config/email.js';
import dotenv from 'dotenv';

dotenv.config();

export async function sendOrderConfirmationToCustomer(order) {
  const itemsList = order.items.map(item => 
    `- ${item.product_name} x${item.quantity} = ${Number(item.subtotal).toFixed(2)}€`
  ).join('\n');
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: order.customer_email,
    subject: `Confirmation de commande ${order.order_number}`,
    text: `
Bonjour ${order.customer_name},

Votre commande ${order.order_number} a bien été validée et payée.

Détails de la commande:
${itemsList}

Total: ${Number(order.total_amount).toFixed(2)}€

Adresse de livraison:
${order.shipping_address}
${order.shipping_postal_code} ${order.shipping_city}
${order.shipping_country}

Merci pour votre confiance !

L'équipe E-commerce
    `
  };
  
  await transporter.sendMail(mailOptions);
}

export async function sendNewOrderNotificationToAdmin(order) {
  const itemsList = order.items.map(item => 
    `- ${item.product_name} x${item.quantity} = ${Number(item.subtotal).toFixed(2)}€`
  ).join('\n');
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_ORDER_EMAIL,
    subject: `Nouvelle commande ${order.order_number}`,
    text: `
Nouvelle commande reçue !

N° de commande: ${order.order_number}
Client: ${order.customer_name}
Email: ${order.customer_email}
Téléphone: ${order.customer_phone || 'Non renseigné'}

Produits:
${itemsList}

Total: ${Number(order.total_amount).toFixed(2)}€

Adresse de livraison:
${order.shipping_address}
${order.shipping_postal_code} ${order.shipping_city}
${order.shipping_country}

Statut paiement: ${order.payment_status}
Stripe ID: ${order.stripe_payment_id || 'En attente'}
    `
  };
  
  await transporter.sendMail(mailOptions);
}