import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { compare } from '../controllers/compareController';

const router = Router();

router.use(authenticate);

// POST /api/compare
router.post('/', compare);

export default router;
