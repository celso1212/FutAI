import * as teamRepo from '../repositories/teamRepository';
import { compareTeams as aiCompare } from './aiService';
import { AnalysisMode } from '../types';

export async function compareTeams(
  myTeamId: string,
  opponentId: string,
  mode: AnalysisMode
) {
  const [myTeam, opponent] = await Promise.all([
    teamRepo.findTeamById(myTeamId),
    teamRepo.findTeamById(opponentId),
  ]);

  if (!myTeam) throw new Error('Seu time não foi encontrado');
  if (!opponent) throw new Error('Time adversário não encontrado');

  // World Cup mode: enforce national teams only
  if (mode === 'WORLD_CUP') {
    if (myTeam.type !== 'national') throw new Error(`${myTeam.name} não é uma seleção nacional`);
    if (opponent.type !== 'national') throw new Error(`${opponent.name} não é uma seleção nacional`);
  }

  const result = await aiCompare(
    { id: myTeam.id, name: myTeam.name, type: myTeam.type, country: myTeam.country },
    { id: opponent.id, name: opponent.name, type: opponent.type, country: opponent.country }
  );

  return {
    myTeam: { id: myTeam.id, name: myTeam.name, type: myTeam.type },
    opponent: { id: opponent.id, name: opponent.name, type: opponent.type },
    mode,
    analysis: result,
  };
}
