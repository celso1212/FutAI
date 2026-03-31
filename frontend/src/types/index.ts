export type TeamType = 'club' | 'national';
export type AnalysisMode = 'CLUB' | 'WORLD_CUP';

export interface Team {
  id: string;
  name: string;
  type: TeamType;
  country?: string;
  league?: string;
  logoUrl?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface TacticalAnalysis {
  pontosFortes: string[];
  pontosFracos: string[];
  estrategia: string;
  chavesParaVitoria: string[];
  formacao: string;
  estiloDeJogo: string;
  jogadoresChave: string[];
}

export interface Analysis {
  id: string;
  teamId: string;
  opponent?: string;
  mode: AnalysisMode;
  content: TacticalAnalysis;
  rawInput?: string;
  createdAt: string;
  team: Team;
}

export interface ComparisonResult {
  myTeam: { id: string; name: string; type: TeamType };
  opponent: { id: string; name: string; type: TeamType };
  mode: AnalysisMode;
  analysis: {
    myTeam: TacticalAnalysis;
    opponent: TacticalAnalysis;
    comoGanhar: string[];
    riscos: string[];
    estrategiasRecomendadas: string[];
    placarProvavel: string;
    justificativaTatica: string;
  };
}

export interface SimulationResult {
  placar: string;
  golsTeamA: number;
  golsTeamB: number;
  justificativa: string;
  destaques: string[];
}

export interface Simulation {
  id: string;
  teamAId: string;
  teamBId: string;
  result: SimulationResult;
  createdAt: string;
  teamA: Team;
  teamB: Team;
}

// World Cup Groups
export interface WorldCupGroup {
  name: string;
  teams: Team[];
}
