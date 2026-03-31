import { z } from 'zod';

export const CreateAnalysisDTO = z.object({
  teamId: z.string().uuid('ID de time inválido'),
  opponent: z.string().min(1).optional(),
  rawInput: z.string().max(2000, 'Texto de entrada muito longo').optional(),
  mode: z.enum(['CLUB', 'WORLD_CUP']).default('CLUB'),
});

export type CreateAnalysisInput = z.infer<typeof CreateAnalysisDTO>;
