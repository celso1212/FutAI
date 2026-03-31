import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { CompareTeamsDTO } from '../dtos/compareTeams.dto';
import * as compareService from '../services/compareService';

export async function compare(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = CompareTeamsDTO.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Dados inválidos', details: parsed.error.flatten() });
    return;
  }

  try {
    const result = await compareService.compareTeams(
      parsed.data.myTeamId,
      parsed.data.opponentId,
      parsed.data.mode
    );
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao comparar times';
    const status = message.includes('não encontrado') || message.includes('não é uma seleção') ? 404 : 500;
    res.status(status).json({ error: message });
  }
}
