import { Request } from 'express';

// ─── Express ──────────────────────────────────────────────────────────────────

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

// ─── Domain primitives ────────────────────────────────────────────────────────

export type TeamType = 'club' | 'national';
export type AnalysisMode = 'CLUB' | 'WORLD_CUP';

/** Minimal team data passed into the AI layer */
export interface TeamData {
  id: string;
  name: string;
  type: TeamType;
  country?: string | null;
}

// ─── AI output contracts ─────────────────────────────────────────────────────

export interface TacticalAnalysis {
  pontosFortes: string[];
  pontosFracos: string[];
  estrategia: string;
  chavesParaVitoria: string[];
  formacao: string;
  estiloDeJogo: string;
  jogadoresChave: string[];
}

export interface ComparisonResult {
  myTeam: TacticalAnalysis;
  opponent: TacticalAnalysis;
  comoGanhar: string[];
  riscos: string[];
  estrategiasRecomendadas: string[];
  placarProvavel: string;
  justificativaTatica: string;
}

export interface SimulationResult {
  placar: string;
  golsTeamA: number;
  golsTeamB: number;
  justificativa: string;
  destaques: string[];
}
