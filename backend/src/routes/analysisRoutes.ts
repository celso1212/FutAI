import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { createAnalysis, getAnalyses, getAnalysisById } from '../controllers/analysisController';

const router = Router();

router.use(authenticate);

// POST /api/analysis
router.post('/', createAnalysis);

// GET /api/analysis          — lista do usuário (query: ?mode=WORLD_CUP)
router.get('/', getAnalyses);

// GET /api/analysis/:id
router.get('/:id', getAnalysisById);

export default router;
