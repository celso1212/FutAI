import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { getNews } from '../controllers/newsController';

const router = Router();

router.get('/', authenticate, getNews);

export default router;
