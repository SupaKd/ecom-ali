import stripe from '../config/stripe.js';
import * as paymentService from '../services/paymentService.js';
import * as orderService from '../services/orderService.js';
import * as emailService from '../services/emailService.js';

export async function createCheckout(req, res, next) {
  try {
    const order = await orderService.createOrder(req.body);
    
    const session = await paymentService.createCheckoutSession({
      ...order,
      items: order.items
    });
    
    res.json({ 
      sessionId: session.id,
      url: session.url,
      order_number: order.order_number
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyPayment(req, res, next) {
  try {
    const { sessionId } = req.params;
    
    const paymentInfo = await paymentService.verifyPayment(sessionId);
    
    if (paymentInfo.payment_status === 'paid') {
      const order = await orderService.updatePaymentStatus(
        paymentInfo.order_number,
        paymentInfo.payment_id,
        'paid'
      );
      
      // ❌ PAS D'EMAILS ICI - géré par le webhook uniquement
      
      res.json({ 
        success: true, 
        order 
      });
    } else {
      res.json({ 
        success: false, 
        message: 'Paiement non confirmé' 
      });
    }
  } catch (error) {
    console.error('Erreur vérification paiement:', error);
    next(error);
  }
}

export async function handleWebhook(req, res, next) {
  try {
    const sig = req.headers['stripe-signature'];
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      try {
        const order = await orderService.updatePaymentStatus(
          session.metadata.order_number,
          session.payment_intent,
          'paid'
        );
        
        // ✅ EMAILS UNIQUEMENT ICI (webhook)
        await emailService.sendOrderConfirmationToCustomer(order);
        await emailService.sendNewOrderNotificationToAdmin(order);
        
        console.log(`✅ Emails envoyés pour commande ${order.order_number}`);
      } catch (error) {
        console.error('Erreur traitement webhook:', error.message);
      }
    }
    
    res.json({ received: true });
  } catch (error) {
    next(error);
  }
}