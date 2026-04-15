import { z } from 'zod';

export const CreateAnalysisDTO = z.object({
  teamId: z.string().uuid('ID de time inválido'),
  opponent: z.string().min(1).optional(),
  rawInput: z.string().max(2000, 'Texto de entrada muito longo').optional(),
  mode: z.enum(['CLUB', 'WORLD_CUP']).default('CLUB'),
  matchContext: z.object({
    competition: z.enum(['liginha', 'estadual', 'copaDoBrasil', 'libertadores', 'copaDoMundo', 'amistoso', 'outras']).default('liginha'),
    location: z.enum(['home', 'away', 'neutral']).default('home'),
    importance: z.enum(['low', 'medium', 'high']).default('medium'),
  }).optional(),
});

export type CreateAnalysisInput = z.infer<typeof CreateAnalysisDTO>;
