import * as teamRepo from '../repositories/teamRepository';
import * as analysisRepo from '../repositories/analysisRepository';
import { analyzeTeam } from './aiService';
import { AnalysisMode } from '../types';

export async function createAnalysis(data: {
  userId: string;
  teamId: string;
  opponent?: string;
  rawInput?: string;
  mode: AnalysisMode;
}) {
  const team = await teamRepo.findTeamById(data.teamId);
  if (!team) throw new Error('Time não encontrado');

  // World Cup mode: only national teams allowed
  if (data.mode === 'WORLD_CUP' && team.type !== 'national') {
    throw new Error('Modo Copa do Mundo permite apenas seleções nacionais');
  }

  const content = await analyzeTeam(
    { id: team.id, name: team.name, type: team.type, country: team.country },
    data.rawInput
  );

  return analysisRepo.createAnalysis({ ...data, content });
}

export async function getAnalyses(userId: string, mode?: string) {
  const validMode = mode === 'WORLD_CUP' || mode === 'CLUB' ? (mode as AnalysisMode) : undefined;
  return analysisRepo.findAnalysesByUser(userId, validMode);
}

export async function getAnalysisById(id: string, userId: string) {
  const analysis = await analysisRepo.findAnalysisByIdAndUser(id, userId);
  if (!analysis) throw new Error('Análise não encontrada');
  return analysis;
}
