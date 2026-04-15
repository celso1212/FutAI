/**
 * AI service — typed wrappers over the raw api.ts calls.
 * Components import from here, not from api.ts directly, to keep
 * the AI-specific payload shape in one place.
 */

import { analysisApi, compareApi, simulationsApi } from '@/services/api';
import { Analysis, ComparisonResult, Simulation, MatchContext } from '@/types';

// ─── Analyze a single team ────────────────────────────────────────────────────

interface AnalyzeTeamOptions {
  opponent?: string;
  rawInput?: string;
  mode?: 'CLUB' | 'WORLD_CUP';
  matchContext?: MatchContext;
}

export function analyzeTeam(teamId: string, opts: AnalyzeTeamOptions = {}): Promise<Analysis> {
  return analysisApi.create({
    teamId,
    opponent: opts.opponent,
    rawInput: opts.rawInput,
    mode: opts.mode,
    matchContext: opts.matchContext,
  });
}

// ─── Compare two teams ────────────────────────────────────────────────────────

interface CompareTeamsOptions {
  mode?: 'CLUB' | 'WORLD_CUP';
}

export function compareTeams(
  myTeamId: string,
  opponentId: string,
  opts: CompareTeamsOptions = {}
): Promise<ComparisonResult> {
  return compareApi.compare({ myTeamId, opponentId, mode: opts.mode });
}

// ─── Simulate a match ─────────────────────────────────────────────────────────

export function simulateMatch(teamAId: string, teamBId: string): Promise<Simulation> {
  return simulationsApi.simulate({ teamAId, teamBId });
}

// ─── List analysis history ────────────────────────────────────────────────────

export function listAnalyses(mode?: 'CLUB' | 'WORLD_CUP'): Promise<Analysis[]> {
  return analysisApi.list(mode);
}

// ─── List simulation history ──────────────────────────────────────────────────

export function listSimulations(limit?: number): Promise<Simulation[]> {
  return simulationsApi.list(limit);
}
