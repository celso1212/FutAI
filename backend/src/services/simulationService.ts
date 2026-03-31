import * as teamRepo from '../repositories/teamRepository';
import * as simulationRepo from '../repositories/simulationRepository';
import { simulateMatch as aiSimulate } from './aiService';

export async function simulate(teamAId: string, teamBId: string) {
  const [teamA, teamB] = await Promise.all([
    teamRepo.findTeamById(teamAId),
    teamRepo.findTeamById(teamBId),
  ]);

  if (!teamA) throw new Error('Time A não encontrado');
  if (!teamB) throw new Error('Time B não encontrado');

  const result = await aiSimulate(
    { id: teamA.id, name: teamA.name, type: teamA.type, country: teamA.country },
    { id: teamB.id, name: teamB.name, type: teamB.type, country: teamB.country }
  );

  const saved = await simulationRepo.createSimulation({ teamAId, teamBId, result });

  return saved;
}

export async function getSimulations(limit?: number) {
  return simulationRepo.findSimulations(limit);
}

export async function getSimulationById(id: string) {
  const sim = await simulationRepo.findSimulationById(id);
  if (!sim) throw new Error('Simulação não encontrada');
  return sim;
}
