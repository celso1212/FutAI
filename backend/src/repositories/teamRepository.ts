import prisma from '../config/database';
import { TeamType } from '../types';

export async function findTeamById(id: string) {
  return prisma.team.findUnique({ where: { id } });
}

export async function findTeamsByType(type?: TeamType) {
  return prisma.team.findMany({
    where: type ? { type } : {},
    orderBy: { name: 'asc' },
  });
}

export async function findManyTeamsByIds(ids: string[]) {
  return prisma.team.findMany({ where: { id: { in: ids } } });
}
