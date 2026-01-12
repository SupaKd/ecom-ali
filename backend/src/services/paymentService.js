import stripe from '../config/stripe.js';

export async function createCheckoutSession(orderData) {
  const lineItems = orderData.items.map(item => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.product_name,
      },
      unit_amount: Math.round(item.unit_price * 100),
    },
    quantity: item.quantity,
  }));
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    customer_email: orderData.customer_email,
    metadata: {
      order_number: orderData.order_number
    }
  });
  
  return session;
}

export async function verifyPayment(sessionId) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  
  return {
    payment_status: session.payment_status,
    order_number: session.metadata.order_number,
    payment_id: session.payment_intent
  };
}