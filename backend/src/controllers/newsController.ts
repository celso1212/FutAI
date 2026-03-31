import { Request, Response, NextFunction } from 'express';
import { fetchNews } from '../services/newsService';

export async function getNews(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = (req.query.q as string) || 'futebol';
    const limit = Math.min(Number(req.query.limit) || 8, 20);
    const articles = await fetchNews(query, limit);
    res.json(articles);
  } catch (err) {
    next(err);
  }
}
