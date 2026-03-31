import { z } from 'zod';

export const CompareTeamsDTO = z.object({
  myTeamId: z.string().uuid('ID do meu time inválido'),
  opponentId: z.string().uuid('ID do adversário inválido'),
  mode: z.enum(['CLUB', 'WORLD_CUP']).default('CLUB'),
});

export type CompareTeamsInput = z.infer<typeof CompareTeamsDTO>;
