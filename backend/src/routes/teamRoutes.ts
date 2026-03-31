import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { getTeams, getFavoriteTeams, toggleFavoriteTeam } from '../controllers/teamController';

const router = Router();

// GET /api/teams              — público (query: ?type=club | ?type=national)
router.get('/', getTeams);

// Rotas autenticadas
router.use(authenticate);

// GET /api/teams/favorites
router.get('/favorites', getFavoriteTeams);

// POST /api/teams/:teamId/favorite  — toggle
router.post('/:teamId/favorite', toggleFavoriteTeam);

export default router;
