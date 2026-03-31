import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userRepo from '../repositories/userRepository';

const SALT_ROUNDS = 10;

export async function register(email: string, password: string, name?: string) {
  const existing = await userRepo.findUserByEmail(email);
  if (existing) throw new Error('Email já cadastrado');

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return userRepo.createUser({ email, password: hashedPassword, name });
}

export async function login(email: string, password: string) {
  const user = await userRepo.findUserByEmail(email);
  if (!user) throw new Error('Credenciais inválidas');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Credenciais inválidas');

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('Configuração de autenticação inválida');

  const token = jwt.sign({ userId: user.id }, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) ?? '7d',
  });

  return { token, user: { id: user.id, email: user.email, name: user.name } };
}
