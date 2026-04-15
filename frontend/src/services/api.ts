import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Inject token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('futai_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('futai_token');
      localStorage.removeItem('futai_user');
      window.location.href = '/auth';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { email: string; password: string; name?: string }) =>
    api.post('/auth/register', data).then((r) => r.data),
  login: (data: { email: string; password: string }) =>
    api.post<{ token: string; user: { id: string; email: string; name?: string } }>('/auth/login', data).then((r) => r.data),
};

// ─── Teams ───────────────────────────────────────────────────────────────────
export const teamsApi = {
  list: (type?: 'club' | 'national') =>
    api.get('/teams', { params: type ? { type } : {} }).then((r) => r.data),
  favorites: () => api.get('/teams/favorites').then((r) => r.data),
  toggleFavorite: (teamId: string) => api.post(`/teams/${teamId}/favorite`).then((r) => r.data),
};

// ─── Analysis ────────────────────────────────────────────────────────────────
export const analysisApi = {
  create: (data: { teamId: string; opponent?: string; rawInput?: string; mode?: string; matchContext?: any }) =>
    api.post('/analysis', data).then((r) => r.data),
  list: (mode?: string) =>
    api.get('/analysis', { params: mode ? { mode } : {} }).then((r) => r.data),
  getById: (id: string) => api.get(`/analysis/${id}`).then((r) => r.data),
};

// ─── Compare ─────────────────────────────────────────────────────────────────
export const compareApi = {
  compare: (data: { myTeamId: string; opponentId: string; mode?: string }) =>
    api.post('/compare', data).then((r) => r.data),
};

// ─── News ─────────────────────────────────────────────────────────────────────
export const newsApi = {
  list: (query?: string, limit?: number) =>
    api.get('/news', { params: { ...(query ? { q: query } : {}), ...(limit ? { limit } : {}) } }).then((r) => r.data),
};

// ─── Simulations ─────────────────────────────────────────────────────────────
export const simulationsApi = {
  simulate: (data: { teamAId: string; teamBId: string }) =>
    api.post('/simulations', data).then((r) => r.data),
  list: (limit?: number) =>
    api.get('/simulations', { params: limit ? { limit } : {} }).then((r) => r.data),
};

export default api;
