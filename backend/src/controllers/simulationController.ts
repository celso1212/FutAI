import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { SimulationDTO } from '../dtos/simulation.dto';
import * as simulationService from '../services/simulationService';

export async function simulate(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = SimulationDTO.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Dados inválidos', details: parsed.error.flatten() });
    return;
  }

  try {
    const simulation = await simulationService.simulate(
      parsed.data.teamAId,
      parsed.data.teamBId
    );
    res.status(201).json(simulation);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao simular partida';
    const status = message.includes('não encontrado') ? 404 : 500;
    res.status(status).json({ error: message });
  }
}

export async function getSimulations(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const simulations = await simulationService.getSimulations(limit);
    res.json(simulations);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao buscar simulações';
    res.status(500).json({ error: message });
  }
}

export async function getSimulationById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const simulation = await simulationService.getSimulationById(req.params.id);
    res.json(simulation);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao buscar simulação';
    res.status(404).json({ error: message });
  }
}
