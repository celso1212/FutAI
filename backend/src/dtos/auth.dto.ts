import { z } from 'zod';

export const RegisterDTO = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').optional(),
});

export const LoginDTO = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});

export type RegisterInput = z.infer<typeof RegisterDTO>;
export type LoginInput = z.infer<typeof LoginDTO>;
