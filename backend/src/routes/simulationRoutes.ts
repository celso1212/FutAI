import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { simulate, getSimulations, getSimulationById } from '../controllers/simulationController';

const router = Router();

router.use(authenticate);

// POST /api/simulations        — criar simulação
router.post('/', simulate);

// GET  /api/simulations        — listar simulações (query: ?limit=N)
router.get('/', getSimulations);

// GET  /api/simulations/:id    — detalhe
router.get('/:id', getSimulationById);

export default router;
