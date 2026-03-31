import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import * as teamService from '../services/teamService';

export async function getTeams(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const teams = await teamService.listTeams(req.query.type as string | undefined);
    res.json(teams);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao buscar times';
    res.status(500).json({ error: message });
  }
}

export async function getFavoriteTeams(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const favorites = await teamService.getFavorites(req.userId!);
    res.json(favorites);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao buscar favoritos';
    res.status(500).json({ error: message });
  }
}

export async function toggleFavoriteTeam(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const result = await teamService.toggleFavorite(req.userId!, req.params.teamId);
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao atualizar favorito';
    const status = message.includes('não encontrado') ? 404 : 500;
    res.status(status).json({ error: message });
  }
}
