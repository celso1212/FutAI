import { Request, Response } from 'express';
import { RegisterDTO, LoginDTO } from '../dtos/auth.dto';
import * as authService from '../services/authService';

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = RegisterDTO.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Dados inválidos', details: parsed.error.flatten() });
    return;
  }

  try {
    const user = await authService.register(
      parsed.data.email,
      parsed.data.password,
      parsed.data.name
    );
    res.status(201).json({ message: 'Usuário criado com sucesso', user });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao criar usuário';
    res.status(409).json({ error: message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = LoginDTO.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Dados inválidos', details: parsed.error.flatten() });
    return;
  }

  try {
    const result = await authService.login(parsed.data.email, parsed.data.password);
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao fazer login';
    res.status(401).json({ error: message });
  }
}
