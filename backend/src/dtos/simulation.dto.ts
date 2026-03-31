import { z } from 'zod';

export const SimulationDTO = z.object({
  teamAId: z.string().uuid('ID do time A inválido'),
  teamBId: z.string().uuid('ID do time B inválido'),
}).refine((data) => data.teamAId !== data.teamBId, {
  message: 'Os dois times devem ser diferentes',
  path: ['teamBId'],
});

export type SimulationInput = z.infer<typeof SimulationDTO>;
