import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import analysisRoutes from './routes/analysisRoutes';
import compareRoutes from './routes/compareRoutes';
import teamRoutes from './routes/teamRoutes';
import simulationRoutes from './routes/simulationRoutes';
import newsRoutes from './routes/newsRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'FutAI Backend', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/news', newsRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Erro interno do servidor', message: err.message });
});

const PORT = process.env.PORT ?? 3333;
app.listen(PORT, () => {
  console.log(`FutAI Backend running on port ${PORT}`);
});

export default app;
