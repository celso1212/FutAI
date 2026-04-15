import prisma from '../config/database';
import { AnalysisMode, TacticalAnalysis, MatchContext } from '../types';

export async function createAnalysis(data: {
  userId: string;
  teamId: string;
  opponent?: string;
  rawInput?: string;
  mode: AnalysisMode;
  content: TacticalAnalysis;
  matchContext?: MatchContext;
}) {
  return prisma.analysis.create({
    data: { 
      ...data, 
      content: data.content as object,
      matchContext: data.matchContext ? (data.matchContext as object) : null,
    },
    include: { team: true },
  });
}

export async function findAnalysesByUser(userId: string, mode?: AnalysisMode) {
  return prisma.analysis.findMany({
    where: { userId, ...(mode ? { mode } : {}) },
    include: { team: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
}

export async function findAnalysisByIdAndUser(id: string, userId: string) {
  return prisma.analysis.findFirst({
    where: { id, userId },
    include: { team: true },
  });
}
