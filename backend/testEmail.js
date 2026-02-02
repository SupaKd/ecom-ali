import transporter, { testEmailConnection } from './src/config/email.js';
import { sendOrderConfirmationToCustomer, sendNewOrderNotificationToAdmin } from './src/services/emailService.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('\n🧪 Test de configuration Email\n');
console.log('================================\n');

// Fonction pour tester la connexion
async function testConnection() {
  console.log('1️⃣ Test de connexion SMTP...\n');
  console.log('Configuration:');
  console.log(`   Host: ${process.env.EMAIL_HOST}`);
  console.log(`   Port: ${process.env.EMAIL_PORT}`);
  console.log(`   User: ${process.env.EMAIL_USER}`);
  console.log(`   From: ${process.env.EMAIL_FROM}`);
  console.log(`   Admin Email: ${process.env.ADMIN_ORDER_EMAIL}\n`);

  const isConnected = await testEmailConnection();

  if (!isConnected) {
    console.log('\n❌ Échec de la connexion. Vérifiez vos variables d\'environnement:\n');
    console.log('   - EMAIL_HOST');
    console.log('   - EMAIL_PORT');
    console.log('   - EMAIL_USER');
    console.log('   - EMAIL_PASSWORD (mot de passe d\'application Gmail)\n');
    process.exit(1);
  }

  return isConnected;
}

// Fonction pour envoyer un email de test simple
async function sendSimpleTestEmail() {
  console.log('\n2️⃣ Envoi d\'un email de test simple...\n');

  const testEmail = process.env.EMAIL_USER; // Envoie à vous-même

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: testEmail,
      subject: '🧪 Test Email - Configuration OK',
      text: `
Ceci est un email de test de votre configuration Nodemailer.

Si vous recevez cet email, votre configuration est correcte ! ✅

Configuration utilisée:
- Host: ${process.env.EMAIL_HOST}
- Port: ${process.env.EMAIL_PORT}
- From: ${process.env.EMAIL_FROM}

Date du test: ${new Date().toLocaleString('fr-FR')}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4CAF50;">✅ Test Email - Configuration OK</h2>
          <p>Ceci est un email de test de votre configuration Nodemailer.</p>
          <p><strong>Si vous recevez cet email, votre configuration est correcte !</strong></p>

          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Configuration utilisée:</h3>
            <ul>
              <li><strong>Host:</strong> ${process.env.EMAIL_HOST}</li>
              <li><strong>Port:</strong> ${process.env.EMAIL_PORT}</li>
              <li><strong>From:</strong> ${process.env.EMAIL_FROM}</li>
            </ul>
          </div>

          <p style="color: #666; font-size: 12px;">Date du test: ${new Date().toLocaleString('fr-FR')}</p>
        </div>
      `
    });

    console.log(`✅ Email de test envoyé avec succès à ${testEmail}\n`);
    console.log('   Vérifiez votre boîte de réception (et les spams)\n');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi:', error.message);
    return false;
  }
}

// Fonction pour tester l'email de confirmation de commande
async function testOrderConfirmationEmail() {
  console.log('\n3️⃣ Test de l\'email de confirmation de commande...\n');

  const testEmail = process.env.EMAIL_USER; // Envoie à vous-même

  const mockOrder = {
    order_number: 'TEST-' + Date.now(),
    customer_email: testEmail,
    customer_name: 'Client Test',
    customer_phone: '+33 6 12 34 56 78',
    total_amount: 149.99,
    payment_status: 'paid',
    stripe_payment_id: 'pi_test_123456789',
    shipping_address: '123 Rue de Test',
    shipping_city: 'Paris',
    shipping_postal_code: '75001',
    shipping_country: 'France',
    items: [
      {
        product_name: 'Produit Test 1',
        quantity: 2,
        unit_price: 49.99,
        subtotal: 99.98
      },
      {
        product_name: 'Produit Test 2',
        quantity: 1,
        unit_price: 50.01,
        subtotal: 50.01
      }
    ]
  };

  try {
    await sendOrderConfirmationToCustomer(mockOrder);
    console.log(`✅ Email de confirmation client envoyé à ${testEmail}\n`);
    return true;
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return false;
  }
}

// Fonction pour tester l'email de notification admin
async function testAdminNotificationEmail() {
  console.log('\n4️⃣ Test de l\'email de notification admin...\n');

  const adminEmail = process.env.ADMIN_ORDER_EMAIL;

  const mockOrder = {
    order_number: 'TEST-' + Date.now(),
    customer_email: 'client@example.com',
    customer_name: 'Client Test',
    customer_phone: '+33 6 12 34 56 78',
    total_amount: 149.99,
    payment_status: 'paid',
    stripe_payment_id: 'pi_test_123456789',
    shipping_address: '123 Rue de Test',
    shipping_city: 'Paris',
    shipping_postal_code: '75001',
    shipping_country: 'France',
    items: [
      {
        product_name: 'Produit Test 1',
        quantity: 2,
        unit_price: 49.99,
        subtotal: 99.98
      },
      {
        product_name: 'Produit Test 2',
        quantity: 1,
        unit_price: 50.01,
        subtotal: 50.01
      }
    ]
  };

  try {
    await sendNewOrderNotificationToAdmin(mockOrder);
    console.log(`✅ Email de notification admin envoyé à ${adminEmail}\n`);
    return true;
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return false;
  }
}

// Fonction principale
async function runAllTests() {
  try {
    // Test 1: Connexion
    const connected = await testConnection();
    if (!connected) return;

    // Test 2: Email simple
    const simpleEmailSent = await sendSimpleTestEmail();
    if (!simpleEmailSent) {
      console.log('\n⚠️ Arrêt des tests suite à l\'échec de l\'email simple\n');
      return;
    }

    // Attendre un peu entre les envois
    console.log('⏳ Attente de 2 secondes...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 3: Email confirmation commande
    await testOrderConfirmationEmail();

    // Attendre un peu entre les envois
    console.log('⏳ Attente de 2 secondes...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 4: Email notification admin
    await testAdminNotificationEmail();

    console.log('\n================================\n');
    console.log('✅ Tous les tests sont terminés !\n');
    console.log('Vérifiez votre boîte de réception pour:');
    console.log(`   - ${process.env.EMAIL_USER} (3 emails)`);
    console.log(`   - ${process.env.ADMIN_ORDER_EMAIL} (1 email)\n`);

  } catch (error) {
    console.error('\n❌ Erreur lors des tests:', error.message);
    process.exit(1);
  }
}

// Lancement des tests
runAllTests();
