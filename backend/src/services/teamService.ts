import * as teamRepo from '../repositories/teamRepository';
import * as userRepo from '../repositories/userRepository';
import { TeamType } from '../types';

export async function listTeams(type?: string) {
  const validType = type === 'club' || type === 'national' ? (type as TeamType) : undefined;
  return teamRepo.findTeamsByType(validType);
}

export async function getFavorites(userId: string) {
  const user = await userRepo.findUserWithFavorites(userId);
  return user?.favoriteTeams ?? [];
}

export async function toggleFavorite(userId: string, teamId: string) {
  const team = await teamRepo.findTeamById(teamId);
  if (!team) throw new Error('Time não encontrado');

  const user = await userRepo.findUserWithFavorites(userId);
  if (!user) throw new Error('Usuário não encontrado');

  // Check if already in favorites by inspecting the fetched list
  const isFavorite = user.favoriteTeams.some((t) => t.id === teamId);

  if (isFavorite) {
    await userRepo.disconnectFavoriteTeam(userId, teamId);
  } else {
    await userRepo.connectFavoriteTeam(userId, teamId);
  }

  return { teamId, favorited: !isFavorite };
}
