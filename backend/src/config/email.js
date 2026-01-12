import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export async function testEmailConnection() {
  try {
    await transporter.verify();
    console.log('✅ Connexion Email réussie');
    return true;
  } catch (error) {
    console.error('❌ Erreur connexion Email:', error.message);
    return false;
  }
}

export default transporter;