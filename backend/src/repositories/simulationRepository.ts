import prisma from '../config/database';
import { SimulationResult } from '../types';

export async function createSimulation(data: {
  teamAId: string;
  teamBId: string;
  result: SimulationResult;
}) {
  return prisma.simulation.create({
    data: { ...data, result: data.result as object },
    include: { teamA: true, teamB: true },
  });
}

export async function findSimulations(limit = 20) {
  return prisma.simulation.findMany({
    include: { teamA: true, teamB: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function findSimulationById(id: string) {
  return prisma.simulation.findUnique({
    where: { id },
    include: { teamA: true, teamB: true },
  });
}
