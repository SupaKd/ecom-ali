import bcrypt from 'bcrypt';
import { findAdminByEmail, updateLastLogin } from '../repositories/adminRepository.js';
import { generateToken } from '../utils/jwt.js';

export async function loginAdmin(email, password) {
  const admin = await findAdminByEmail(email);
  
  if (!admin) {
    throw new Error('Email ou mot de passe incorrect');
  }
  
  const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
  
  if (!isPasswordValid) {
    throw new Error('Email ou mot de passe incorrect');
  }
  
  await updateLastLogin(admin.id);
  
  const token = generateToken({
    id: admin.id,
    email: admin.email,
    role: admin.role
  });
  
  return {
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    }
  };
}