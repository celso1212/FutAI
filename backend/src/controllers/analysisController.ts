import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { CreateAnalysisDTO } from '../dtos/createAnalysis.dto';
import * as analysisService from '../services/analysisService';

export async function createAnalysis(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = CreateAnalysisDTO.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Dados inválidos', details: parsed.error.flatten() });
    return;
  }

  try {
    const analysis = await analysisService.createAnalysis({
      userId: req.userId!,
      ...parsed.data,
    });
    res.status(201).json(analysis);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao criar análise';
    const status = message.includes('não encontrado') ? 404 : 400;
    res.status(status).json({ error: message });
  }
}

export async function getAnalyses(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const analyses = await analysisService.getAnalyses(
      req.userId!,
      req.query.mode as string | undefined
    );
    res.json(analyses);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao buscar análises';
    res.status(500).json({ error: message });
  }
}

export async function getAnalysisById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const analysis = await analysisService.getAnalysisById(req.params.id, req.userId!);
    res.json(analysis);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao buscar análise';
    res.status(404).json({ error: message });
  }
}
