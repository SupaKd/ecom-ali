import transporter from '../config/email.js';
import dotenv from 'dotenv';

dotenv.config();

export async function sendOrderConfirmationToCustomer(order) {
  const itemsListText = order.items.map(item =>
    `- ${item.product_name} x${item.quantity} = ${Number(item.subtotal).toFixed(2)}€`
  ).join('\n');

  const itemsListHtml = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <strong>${item.product_name}</strong>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
        x${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
        ${Number(item.subtotal).toFixed(2)}€
      </td>
    </tr>
  `).join('');

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: order.customer_email,
    subject: `✅ Confirmation de commande ${order.order_number}`,
    text: `
Bonjour ${order.customer_name},

Votre commande ${order.order_number} a bien été validée et payée.

Détails de la commande:
${itemsListText}

Total: ${Number(order.total_amount).toFixed(2)}€

Adresse de livraison:
${order.shipping_address}
${order.shipping_postal_code} ${order.shipping_city}
${order.shipping_country}

Merci pour votre confiance !

L'équipe E-commerce
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4;">
    <tr>
      <td style="padding: 40px 20px;">
        <!-- Container -->
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                ✅ Commande confirmée
              </h1>
              <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                Merci pour votre achat !
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">

              <!-- Greeting -->
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333; line-height: 1.6;">
                Bonjour <strong>${order.customer_name}</strong>,
              </p>

              <p style="margin: 0 0 30px 0; font-size: 16px; color: #666666; line-height: 1.6;">
                Nous avons bien reçu votre paiement. Votre commande <strong style="color: #667eea;">${order.order_number}</strong> est confirmée et sera traitée dans les plus brefs délais.
              </p>

              <!-- Order Details Box -->
              <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #333333;">
                  📦 Détails de votre commande
                </h2>
                <p style="margin: 0; font-size: 14px; color: #666666;">
                  Numéro de commande : <strong>${order.order_number}</strong>
                </p>
              </div>

              <!-- Items Table -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                  <tr style="background-color: #f8f9fa;">
                    <th style="padding: 12px; text-align: left; font-size: 14px; color: #666666; font-weight: 600;">
                      Produit
                    </th>
                    <th style="padding: 12px; text-align: center; font-size: 14px; color: #666666; font-weight: 600;">
                      Quantité
                    </th>
                    <th style="padding: 12px; text-align: right; font-size: 14px; color: #666666; font-weight: 600;">
                      Prix
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsListHtml}
                  <tr>
                    <td colspan="2" style="padding: 20px 12px 12px 12px; text-align: right; font-size: 18px; font-weight: 600; color: #333333;">
                      Total TTC
                    </td>
                    <td style="padding: 20px 12px 12px 12px; text-align: right; font-size: 20px; font-weight: 700; color: #667eea;">
                      ${Number(order.total_amount).toFixed(2)}€
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Shipping Address -->
              <div style="background-color: #f8f9fa; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #333333;">
                  🚚 Adresse de livraison
                </h3>
                <p style="margin: 0; font-size: 15px; color: #666666; line-height: 1.6;">
                  ${order.shipping_address}<br>
                  ${order.shipping_postal_code} ${order.shipping_city}<br>
                  ${order.shipping_country}
                </p>
              </div>

              <!-- Thank You Message -->
              <p style="margin: 0 0 10px 0; font-size: 16px; color: #333333; line-height: 1.6;">
                Merci pour votre confiance ! 🙏
              </p>
              <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.6;">
                Vous recevrez un email de confirmation d'expédition dès que votre colis sera en route.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                Des questions ? Nous sommes là pour vous aider.
              </p>
              <p style="margin: 0; font-size: 14px; color: #667eea;">
                <a href="mailto:${process.env.EMAIL_FROM}" style="color: #667eea; text-decoration: none;">
                  ${process.env.EMAIL_FROM}
                </a>
              </p>
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <p style="margin: 0; font-size: 12px; color: #999999;">
                  © ${new Date().getFullYear()} E-commerce Ali - Tous droits réservés
                </p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  };

  await transporter.sendMail(mailOptions);
}

export async function sendNewOrderNotificationToAdmin(order) {
  const itemsListText = order.items.map(item =>
    `- ${item.product_name} x${item.quantity} = ${Number(item.subtotal).toFixed(2)}€`
  ).join('\n');

  const itemsListHtml = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <strong>${item.product_name}</strong>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
        x${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
        ${Number(item.unit_price).toFixed(2)}€
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">
        ${Number(item.subtotal).toFixed(2)}€
      </td>
    </tr>
  `).join('');

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_ORDER_EMAIL,
    subject: `🛒 Nouvelle commande ${order.order_number} - ${Number(order.total_amount).toFixed(2)}€`,
    text: `
Nouvelle commande reçue !

N° de commande: ${order.order_number}
Client: ${order.customer_name}
Email: ${order.customer_email}
Téléphone: ${order.customer_phone || 'Non renseigné'}

Produits:
${itemsListText}

Total: ${Number(order.total_amount).toFixed(2)}€

Adresse de livraison:
${order.shipping_address}
${order.shipping_postal_code} ${order.shipping_city}
${order.shipping_country}

Statut paiement: ${order.payment_status}
Stripe ID: ${order.stripe_payment_id || 'En attente'}
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4;">
    <tr>
      <td style="padding: 40px 20px;">
        <!-- Container -->
        <table role="presentation" style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                🛒 Nouvelle commande !
              </h1>
              <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 18px; font-weight: 600;">
                ${Number(order.total_amount).toFixed(2)}€
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">

              <!-- Order Number -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; margin-bottom: 30px; border-radius: 8px; text-align: center;">
                <p style="margin: 0; font-size: 14px; opacity: 0.9;">Numéro de commande</p>
                <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: 700; letter-spacing: 1px;">
                  ${order.order_number}
                </p>
              </div>

              <!-- Customer Info -->
              <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #333333;">
                  👤 Informations client
                </h2>
                <table role="presentation" style="width: 100%; font-size: 15px; color: #666666;">
                  <tr>
                    <td style="padding: 5px 0;"><strong>Nom :</strong></td>
                    <td style="padding: 5px 0;">${order.customer_name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0;"><strong>Email :</strong></td>
                    <td style="padding: 5px 0;">
                      <a href="mailto:${order.customer_email}" style="color: #667eea; text-decoration: none;">
                        ${order.customer_email}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0;"><strong>Téléphone :</strong></td>
                    <td style="padding: 5px 0;">
                      ${order.customer_phone ? `<a href="tel:${order.customer_phone}" style="color: #667eea; text-decoration: none;">${order.customer_phone}</a>` : '<em>Non renseigné</em>'}
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Products Table -->
              <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #333333;">
                📦 Produits commandés
              </h3>
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                  <tr style="background-color: #f8f9fa;">
                    <th style="padding: 12px; text-align: left; font-size: 14px; color: #666666; font-weight: 600;">
                      Produit
                    </th>
                    <th style="padding: 12px; text-align: center; font-size: 14px; color: #666666; font-weight: 600;">
                      Qté
                    </th>
                    <th style="padding: 12px; text-align: right; font-size: 14px; color: #666666; font-weight: 600;">
                      P.U.
                    </th>
                    <th style="padding: 12px; text-align: right; font-size: 14px; color: #666666; font-weight: 600;">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsListHtml}
                  <tr>
                    <td colspan="3" style="padding: 20px 12px 12px 12px; text-align: right; font-size: 18px; font-weight: 600; color: #333333;">
                      Total TTC
                    </td>
                    <td style="padding: 20px 12px 12px 12px; text-align: right; font-size: 20px; font-weight: 700; color: #f5576c;">
                      ${Number(order.total_amount).toFixed(2)}€
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Shipping Address -->
              <div style="background-color: #f8f9fa; border-left: 4px solid #4caf50; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #333333;">
                  🚚 Adresse de livraison
                </h3>
                <p style="margin: 0; font-size: 15px; color: #666666; line-height: 1.6;">
                  ${order.shipping_address}<br>
                  ${order.shipping_postal_code} ${order.shipping_city}<br>
                  ${order.shipping_country}
                </p>
              </div>

              <!-- Payment Info -->
              <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; border-radius: 4px;">
                <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #333333;">
                  💳 Informations de paiement
                </h3>
                <table role="presentation" style="width: 100%; font-size: 15px; color: #666666;">
                  <tr>
                    <td style="padding: 5px 0;"><strong>Statut :</strong></td>
                    <td style="padding: 5px 0;">
                      <span style="background-color: #4caf50; color: white; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 600;">
                        ${order.payment_status === 'paid' ? '✓ PAYÉ' : order.payment_status}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0;"><strong>Stripe ID :</strong></td>
                    <td style="padding: 5px 0; font-family: monospace; font-size: 13px;">
                      ${order.stripe_payment_id || '<em>En attente</em>'}
                    </td>
                  </tr>
                </table>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; font-size: 14px; color: #666666;">
                ⏰ Commande reçue le ${new Date().toLocaleString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <p style="margin: 0; font-size: 12px; color: #999999;">
                  © ${new Date().getFullYear()} E-commerce Ali - Notification automatique
                </p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  };

  await transporter.sendMail(mailOptions);
}