import prisma from '../config/database';

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(data: { email: string; password: string; name?: string }) {
  return prisma.user.create({
    data,
    select: { id: true, email: true, name: true, createdAt: true },
  });
}

export async function findUserWithFavorites(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { favoriteTeams: true },
  });
}

export async function connectFavoriteTeam(userId: string, teamId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { favoriteTeams: { connect: { id: teamId } } },
  });
}

export async function disconnectFavoriteTeam(userId: string, teamId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { favoriteTeams: { disconnect: { id: teamId } } },
  });
}
