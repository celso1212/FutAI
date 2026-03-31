# ⚽ FutAI — Plataforma de Análise Tática de Futebol com IA

FutAI é uma plataforma full-stack de análise tática de futebol alimentada por Inteligência Artificial. Explore times, gere análises táticas detalhadas, compare equipes, simule partidas e acompanhe a Copa do Mundo 2026 — tudo em um só lugar.

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Cadastro e login com email/senha
- Sessão segura via JWT (7 dias)
- Proteção de rotas autenticadas

### ⚽ Times
- Catálogo com **+200 times** de 9 ligas/divisões
- **Clubes**: Brasileirão Série A/B/C/D, Premier League, La Liga, Serie A (Itália), Bundesliga, Ligue 1
- **Seleções**: 48 seleções da Copa do Mundo 2026 agrupadas por confederação (CONMEBOL, UEFA, CONCACAF, CAF, AFC, OFC)
- Emblemas de times via logo ou bandeira do país (seleções)
- Logo das ligas no cabeçalho de cada grupo
- Badge de confederação para grupos de seleções
- **Collapse/expand** por liga — esconde ou exibe os times de cada grupo
- Sistema de **times favoritos** para acesso rápido

### 🧠 Análise Tática com IA
- Geração de análise tática completa de qualquer time
- Retorna: formação, estilo de jogo, pontos fortes/fracos, jogadores-chave, estratégia e chaves para a vitória
- Suporte a modo **Clubes** e **Copa do Mundo**
- Histórico de análises salvo por usuário

### ⚔️ Comparação de Times
- Compare qualquer dois times entre si
- A IA retorna análise tática dos dois lados, como ganhar, riscos, estratégias recomendadas, placar provável e justificativa tática

### 🎯 Simulação de Partidas
- Simule o resultado de qualquer confronto
- Retorna placar, gols de cada time, destaques e justificativa detalhada
- Histórico de simulações salvo

### 📰 Notícias
- Feed de notícias de futebol em tempo real via NewsAPI / GNews
- Fallback com notícias de demonstração caso as APIs não estejam configuradas

### 🏆 Copa do Mundo 2026
- Modo Copa do Mundo com tema visual especial (dourado)
- Visualização dos grupos da Copa
- Simulação de chaveamento eliminatório (bracket)
- Botão de acesso rápido na interface

---

## 🛠️ Stack Tecnológica

### Backend
| Tecnologia | Uso |
|---|---|
| Node.js + TypeScript | Runtime e linguagem |
| Express | Framework HTTP |
| Prisma ORM | Acesso ao banco de dados |
| PostgreSQL | Banco de dados relacional |
| OpenAI SDK | Análises geradas por IA |
| JWT + bcryptjs | Autenticação e senha |
| Zod | Validação de DTOs |
| Axios | Consumo de APIs externas (notícias) |

### Frontend
| Tecnologia | Uso |
|---|---|
| React 18 + TypeScript | Interface |
| Vite | Build tool |
| Tailwind CSS | Estilização |
| React Router v6 | Roteamento SPA |
| TanStack Query v5 | Cache e estado de servidor |
| Lucide React | Ícones |

---

## 📁 Estrutura do Projeto

```
FutAI/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Modelos do banco
│   │   ├── seed.ts             # Dados iniciais (times)
│   │   └── migrations/
│   └── src/
│       ├── app.ts              # Entry point
│       ├── controllers/        # Handlers HTTP
│       ├── services/           # Lógica de negócio + IA
│       ├── repositories/       # Acesso ao banco via Prisma
│       ├── routes/             # Definição de rotas
│       ├── middlewares/        # Auth middleware
│       ├── dtos/               # Schemas de validação (Zod)
│       └── types/              # Tipos TypeScript
└── frontend/
    └── src/
        ├── pages/              # TeamsPage, AnalysisPage, ComparePage...
        ├── components/         # UI reutilizável + layout
        ├── services/           # Chamadas à API
        ├── contexts/           # Auth, Theme, App state
        ├── hooks/
        └── types/
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- PostgreSQL rodando localmente

### 1. Clone o repositório
```bash
git clone https://github.com/celso1212/FutAI.git
cd FutAI
```

### 2. Configure o backend
```bash
cd backend
cp .env.example .env   # edite com suas credenciais
npm install
npx prisma migrate dev
npx prisma db seed     # popula o banco com os times
npm run dev            # porta 3333
```

### 3. Configure o frontend
```bash
cd frontend
npm install
npm run dev            # porta 5173
```

### 4. Acesse
Abra [http://localhost:5173](http://localhost:5173) no navegador.

---

## ⚙️ Variáveis de Ambiente (backend/.env)

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/futai_db"
JWT_SECRET="sua-chave-secreta"
JWT_EXPIRES_IN="7d"
PORT=3333
NODE_ENV="development"

# Opcional — IA real para análises
OPENAI_API_KEY=""

# Opcional — notícias em tempo real
NEWS_API_KEY=""    # https://newsapi.org
GNEWS_API_KEY=""   # https://gnews.io
```

> As análises funcionam com ou sem a chave da OpenAI — sem ela, é retornada uma análise de demonstração.

---

## 🗺️ API Endpoints

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Cadastro |
| POST | `/api/auth/login` | Login |
| GET | `/api/teams` | Listar times |
| GET | `/api/teams/favorites` | Times favoritos |
| POST | `/api/teams/:id/favorite` | Toggle favorito |
| POST | `/api/analysis` | Gerar análise tática |
| GET | `/api/analysis` | Histórico de análises |
| POST | `/api/compare` | Comparar dois times |
| POST | `/api/simulations` | Simular partida |
| GET | `/api/simulations` | Histórico de simulações |
| GET | `/api/news` | Feed de notícias |
| GET | `/health` | Health check |

---

## 📄 Licença

MIT
