import axios from 'axios';

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
}

// Simple in-memory cache
const cache: Map<string, { data: NewsArticle[]; expiresAt: number }> = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

function getCached(key: string): NewsArticle[] | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { cache.delete(key); return null; }
  return entry.data;
}

function setCache(key: string, data: NewsArticle[]): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL });
}

// ─── NewsAPI (https://newsapi.org — free tier: 100 req/day) ──────────────────

async function fetchFromNewsApi(query: string, limit: number): Promise<NewsArticle[]> {
  const key = process.env.NEWS_API_KEY;
  if (!key) return [];

  const url = 'https://newsapi.org/v2/everything';
  const { data } = await axios.get(url, {
    params: {
      q: query,
      language: 'pt',
      sortBy: 'publishedAt',
      pageSize: limit,
      apiKey: key,
    },
    timeout: 5000,
  });

  return (data.articles ?? []).map((a: Record<string, string>) => ({
    title: a.title,
    description: a.description ?? '',
    url: a.url,
    source: a.source?.name ?? 'NewsAPI',
    publishedAt: a.publishedAt,
    imageUrl: a.urlToImage,
  }));
}

// ─── GNews API (https://gnews.io — free tier: 100 req/day) ──────────────────

async function fetchFromGNews(query: string, limit: number): Promise<NewsArticle[]> {
  const key = process.env.GNEWS_API_KEY;
  if (!key) return [];

  const { data } = await axios.get('https://gnews.io/api/v4/search', {
    params: {
      q: query,
      lang: 'pt',
      max: limit,
      token: key,
    },
    timeout: 5000,
  });

  return (data.articles ?? []).map((a: Record<string, string>) => ({
    title: a.title,
    description: a.description ?? '',
    url: a.url,
    source: a.source?.name ?? 'GNews',
    publishedAt: a.publishedAt,
    imageUrl: a.image,
  }));
}

// ─── Fallback mock ────────────────────────────────────────────────────────────

function getMockNews(query: string): NewsArticle[] {
  const now = new Date();
  const fmt = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();

  const teamSlug = query.toLowerCase().split(' ')[0];

  return [
    {
      title: `${query}: análise tática pré-rodada`,
      description: `Confira a análise completa do desempenho de ${query} e as expectativas para os próximos jogos.`,
      url: `https://ge.globo.com/futebol`,
      source: 'ge.globo.com',
      publishedAt: fmt(2),
    },
    {
      title: `Treinador de ${query} fala sobre estratégia`,
      description: `O comandante da equipe revelou os planos táticos para os próximos confrontos da temporada.`,
      url: `https://www.espn.com.br/futebol`,
      source: 'ESPN Brasil',
      publishedAt: fmt(6),
    },
    {
      title: `${query} se prepara para rodada decisiva`,
      description: `Equipe treina forte e tem novidades no elenco para os próximos compromissos.`,
      url: `https://www.lance.com.br/futebol/${teamSlug}`,
      source: 'Lance!',
      publishedAt: fmt(14),
    },
    {
      title: `Confira as últimas transferências de ${query}`,
      description: `O mercado da bola movimentou o clube com chegadas e saídas relevantes para a temporada.`,
      url: `https://ge.globo.com/futebol`,
      source: 'ge.globo.com',
      publishedAt: fmt(24),
    },
    {
      title: `Jogadores de ${query} em destaque na temporada`,
      description: `Os principais atletas do elenco têm se sobressaído nos últimos jogos com atuações decisivas.`,
      url: `https://www.uol.com.br/esporte/futebol`,
      source: 'UOL Esporte',
      publishedAt: fmt(36),
    },
  ];
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function fetchNews(query = 'futebol', limit = 8): Promise<NewsArticle[]> {
  const cacheKey = `${query}:${limit}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  let articles: NewsArticle[] = [];

  try {
    articles = await fetchFromNewsApi(query, limit);
  } catch (_) {
    // NewsAPI failed, try GNews
  }

  if (!articles.length) {
    try {
      articles = await fetchFromGNews(query, limit);
    } catch (_) {
      // GNews failed too
    }
  }

  if (!articles.length) {
    articles = getMockNews(query);
  }

  setCache(cacheKey, articles);
  return articles;
}
