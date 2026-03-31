import axios from 'axios';
import { TeamData, TacticalAnalysis, ComparisonResult, SimulationResult } from '../types';
import { fetchNews } from './newsService';

// ─────────────────────────────────────────────────────────────────────────────
// AI Service
// Se OPENAI_API_KEY estiver configurado, usa GPT com notícias reais como contexto.
// Caso contrário, usa análise mock enriquecida com notícias recentes buscadas da web.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Tactical templates (fallback) ───────────────────────────────────────────

interface TacticalTemplate {
  formacao: string;
  estiloDeJogo: string;
  pontosFortes: string[];
  pontosFracos: string[];
  jogadoresChave: string[];
}

const TEMPLATES: Record<string, TacticalTemplate> = {
  brasil: {
    formacao: '4-3-3',
    estiloDeJogo: 'Futebol ofensivo com habilidade individual e trocas de passes curtos nas linhas',
    pontosFortes: ['Velocidade nas alas', 'Dribles e criatividade', 'Pressão alta', 'Transição rápida'],
    pontosFracos: ['Vulnerabilidade nas bolas paradas defensivas', 'Dependência de jogadores individuais'],
    jogadoresChave: ['Vini Jr', 'Rodrygo', 'Casemiro'],
  },
  franca: {
    formacao: '4-2-3-1',
    estiloDeJogo: 'Bloco defensivo compacto com contra-ataques letais e posse física dominante',
    pontosFortes: ['Força física', 'Contra-ataque em velocidade', 'Profundidade no elenco'],
    pontosFracos: ['Dependência de Mbappé', 'Dificuldade contra times que fecham em dois blocos'],
    jogadoresChave: ['Mbappé', 'Griezmann', 'Kanté'],
  },
  argentina: {
    formacao: '4-3-3',
    estiloDeJogo: 'Posse com inteligência posicional, Messi como pivô entre linhas',
    pontosFortes: ['Messi como coringa ofensivo', 'Experiência em grandes finais', 'Solidez defensiva'],
    pontosFracos: ['Envelhecimento de parte do elenco', 'Pressão extrema por resultados'],
    jogadoresChave: ['Messi', 'Di María', 'Otamendi'],
  },
  alemanha: {
    formacao: '4-2-3-1',
    estiloDeJogo: 'Gegenpress intenso, recuperação imediata e jogo vertical direto',
    pontosFortes: ['Organização coletiva', 'Pressing alto', 'Qualidade em bolas paradas ofensivas'],
    pontosFracos: ['Transição defensiva lenta', 'Criatividade individual abaixo de rivais top'],
    jogadoresChave: ['Müller', 'Gnabry', 'Neuer'],
  },
  espanha: {
    formacao: '4-3-3',
    estiloDeJogo: 'Tiki-taka evoluído: posse posicional com pressing intenso ao perder a bola',
    pontosFortes: ['Controle de posse', 'Pressing alto coordenado', 'Saída de bola limpa'],
    pontosFracos: ['Falta de centroavante clássico', 'Baixa produção em contra-ataques'],
    jogadoresChave: ['Pedri', 'Yamal', 'Morata'],
  },
  inglaterra: {
    formacao: '4-3-3',
    estiloDeJogo: 'Intensidade física alta, combinações diretas e exploração de flancos',
    pontosFortes: ['Qualidade nos flancos', 'Poder ofensivo variado', 'Bolas paradas ofensivas'],
    pontosFracos: ['Nervosismo em fases decisivas', 'Inconsistência no meio-campo'],
    jogadoresChave: ['Bellingham', 'Saka', 'Kane'],
  },
  portugal: {
    formacao: '4-2-3-1',
    estiloDeJogo: 'Construção lenta com explosão ofensiva nas costas de defesas adiantadas',
    pontosFortes: ['Talento ofensivo individual', 'Qualidade nos flancos', 'Bolas paradas'],
    pontosFracos: ['Dependência histórica de Ronaldo', 'Fragilidade defensiva em jogos abertos'],
    jogadoresChave: ['Ronaldo', 'Bernardo Silva', 'Rúben Dias'],
  },
  flamengo: {
    formacao: '4-2-3-1',
    estiloDeJogo: 'Futebol vertical com transições rápidas e pressão alta no campo adversário',
    pontosFortes: ['Elenco profundo', 'Força ofensiva nas transições', 'Torcida como 12º jogador'],
    pontosFracos: ['Erros individuais sob pressão', 'Gestão de resultados adversos'],
    jogadoresChave: ['Gabigol', 'Arrascaeta', 'Gerson'],
  },
  palmeiras: {
    formacao: '4-3-3',
    estiloDeJogo: 'Organização defensiva sólida com construção a partir da defesa',
    pontosFortes: ['Compactação defensiva', 'Eficiência em bolas paradas', 'Regularidade'],
    pontosFracos: ['Dificuldade em criar jogadas em espaços reduzidos', 'Dependência de sistemas'],
    jogadoresChave: ['Endrick', 'Veiga', 'Weverton'],
  },
  'real madrid': {
    formacao: '4-3-3',
    estiloDeJogo: 'Mentalidade vencedora, capacidade de virar jogos nos minutos finais',
    pontosFortes: ['Experiência em grandes jogos', 'Qualidade individual absurda', 'Resiliência'],
    pontosFracos: ['Dependência de Bellingham/Vini Jr', 'Dificuldade sem posse de bola organizada'],
    jogadoresChave: ['Vini Jr', 'Bellingham', 'Courtois'],
  },
  barcelona: {
    formacao: '4-3-3',
    estiloDeJogo: 'Posse e pressing posicional herdados do legado do clube',
    pontosFortes: ['Sistema de jogo definido', 'Formação de jogadores jovens', 'Identidade tática'],
    pontosFracos: ['Fragilidade financeira', 'Inconsistência defensiva em viagens'],
    jogadoresChave: ['Pedri', 'Yamal', 'Lewandowski'],
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalize(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function findTemplate(teamName: string): TacticalTemplate | undefined {
  const key = normalize(teamName);
  const entry = Object.entries(TEMPLATES).find(([k]) => key.includes(k));
  return entry?.[1];
}

function buildTacticalAnalysis(team: TeamData, rawInput?: string): TacticalAnalysis {
  const template = findTemplate(team.name);
  const isNational = team.type === 'national';

  return {
    formacao: template?.formacao ?? (isNational ? '4-3-3' : '4-4-2'),
    estiloDeJogo:
      template?.estiloDeJogo ??
      `${team.name} adota um estilo equilibrado, priorizando organização coletiva ${
        isNational ? 'e representatividade da seleção nacional' : 'e solidez defensiva'
      }.`,
    pontosFortes: template?.pontosFortes ?? [
      'Organização defensiva sólida',
      'Compactação no meio-campo',
      'Qualidade em bolas paradas ofensivas',
    ],
    pontosFracos: template?.pontosFracos ?? [
      'Criatividade limitada em jogadas construídas',
      'Velocidade abaixo da média nas alas',
    ],
    estrategia: buildEstrategia(team, template, isNational, rawInput),
    chavesParaVitoria: [
      `Neutralizar as transições ofensivas de ${team.name}`,
      'Aproveitar os espaços nas costas da linha defensiva',
      'Explorar o cansaço físico no segundo tempo',
    ],
    jogadoresChave: template?.jogadoresChave ?? [
      isNational ? 'Capitão da seleção' : 'Capitão do clube',
      'Meia-armador',
      'Centroavante referência',
    ],
  };
}

function buildEstrategia(
  team: TeamData,
  template: TacticalTemplate | undefined,
  isNational: boolean,
  rawInput?: string
): string {
  let base = template
    ? `Com a formação ${template.formacao}, ${team.name} deve ${template.estiloDeJogo.toLowerCase()}.`
    : `${team.name} deve manter posse no terço médio, explorar os flancos e pressionar a saída de bola adversária.`;

  if (isNational) base += ' Em competições de seleções, a preparação coletiva e o moral do grupo são fatores determinantes.';
  if (rawInput) base += ` Contexto considerado: "${rawInput.slice(0, 200)}"`;

  return base;
}

function deterministicGoals(seed: number, max: number): number {
  return seed % (max + 1);
}

function simulateScore(teamA: TeamData, teamB: TeamData): { golsA: number; golsB: number } {
  const seedA = normalize(teamA.name).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const seedB = normalize(teamB.name).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return {
    golsA: deterministicGoals(seedA, 3),
    golsB: deterministicGoals(seedB + teamA.name.length, 2),
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── OpenAI integration (optional) ───────────────────────────────────────────

async function callOpenAI(prompt: string): Promise<TacticalAnalysis | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const { data } = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      },
      {
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        timeout: 15000,
      }
    );

    const content = data.choices[0].message.content;
    return JSON.parse(content) as TacticalAnalysis;
  } catch (err) {
    console.error('[aiService] OpenAI error:', err);
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function analyzeTeam(team: TeamData, rawInput?: string): Promise<TacticalAnalysis> {
  // Fetch recent news for context
  const newsQuery = `${team.name} futebol`;
  const recentNews = await fetchNews(newsQuery, 5).catch(() => []);
  const newsContext = recentNews
    .slice(0, 5)
    .map((n, i) => `${i + 1}. ${n.title} (${n.source})`)
    .join('\n');

  // Try OpenAI if key is set
  if (process.env.OPENAI_API_KEY) {
    const prompt = `Você é um analista tático de futebol especialista. Analise ${team.name} (${team.country ?? ''}, tipo: ${team.type}).

Notícias recentes sobre o time:
${newsContext || 'Sem notícias recentes disponíveis.'}

${rawInput ? `Contexto adicional: ${rawInput}` : ''}

Retorne APENAS um JSON válido com esta estrutura exata:
{
  "formacao": "4-3-3",
  "estiloDeJogo": "descrição detalhada do estilo",
  "pontosFortes": ["ponto 1", "ponto 2", "ponto 3", "ponto 4"],
  "pontosFracos": ["fraqueza 1", "fraqueza 2", "fraqueza 3"],
  "estrategia": "estratégia recomendada detalhada",
  "chavesParaVitoria": ["chave 1", "chave 2", "chave 3"],
  "jogadoresChave": ["jogador 1", "jogador 2", "jogador 3"]
}`;

    const aiResult = await callOpenAI(prompt);
    if (aiResult) return aiResult;
  }

  // Fallback: mock analysis
  await delay(400);
  const analysis = buildTacticalAnalysis(team, rawInput);

  // Enrich with recent news if available
  if (recentNews.length > 0) {
    const recentTitle = recentNews[0].title;
    analysis.estrategia += ` Contexto recente: "${recentTitle}".`;
  }

  return analysis;
}

export async function compareTeams(myTeam: TeamData, opponent: TeamData): Promise<ComparisonResult> {
  await delay(600);

  const myAnalysis = buildTacticalAnalysis(myTeam);
  const opponentAnalysis = buildTacticalAnalysis(opponent);
  const isWorldCup = myTeam.type === 'national' || opponent.type === 'national';
  const contexto = isWorldCup ? ' em contexto de Copa do Mundo' : '';

  return {
    myTeam: myAnalysis,
    opponent: opponentAnalysis,
    comoGanhar: [
      `Explorar a fraqueza de ${opponent.name}: ${opponentAnalysis.pontosFracos[0]}`,
      `Usar ${myAnalysis.pontosFortes[0]} para romper a organização adversária`,
      `Dominar o meio-campo${contexto} para ditar o ritmo`,
    ],
    riscos: [
      `${opponent.name} é perigoso em: ${opponentAnalysis.pontosFortes[0]}`,
      'Evitar erros individuais em bolas paradas defensivas',
      'Não abrir espaços para contra-ataques rápidos',
    ],
    estrategiasRecomendadas: [
      `Usar formação ${myAnalysis.formacao} para bloquear a linha de passe central de ${opponent.name}`,
      'Pressionar a saída de bola adversária nos primeiros 15 minutos',
      'Explorar os espaços nas costas da defesa adversária',
    ],
    placarProvavel: (() => {
      const { golsA, golsB } = simulateScore(myTeam, opponent);
      return `${golsA} x ${golsB}`;
    })(),
    justificativaTatica: `${myTeam.name} tem vantagem na ${myAnalysis.pontosFortes[0].toLowerCase()}, enquanto ${opponent.name} apresenta solidez em ${opponentAnalysis.pontosFortes[0].toLowerCase()}. O jogo deve ser decidido no meio-campo${contexto}.`,
  };
}

export async function simulateMatch(teamA: TeamData, teamB: TeamData): Promise<SimulationResult> {
  await delay(300);

  const { golsA, golsB } = simulateScore(teamA, teamB);
  const analysisA = buildTacticalAnalysis(teamA);
  const analysisB = buildTacticalAnalysis(teamB);
  const isWorldCup = teamA.type === 'national' || teamB.type === 'national';

  const winner = golsA > golsB ? teamA.name : golsB > golsA ? teamB.name : null;
  const resultDesc = winner ? `${winner} vence por ${Math.abs(golsA - golsB)} gol(s)` : 'Empate';

  return {
    placar: `${golsA} x ${golsB}`,
    golsTeamA: golsA,
    golsTeamB: golsB,
    justificativa: `Simulação ${isWorldCup ? '[Copa do Mundo] ' : ''}baseada em padrões táticos: ${resultDesc}. ${teamA.name} (${analysisA.formacao}) vs ${teamB.name} (${analysisB.formacao}). O fator decisivo foi ${analysisA.pontosFortes[0].toLowerCase()} de ${teamA.name} frente à fragilidade de ${analysisB.pontosFracos[0].toLowerCase()} de ${teamB.name}.`,
    destaques: [
      `${teamA.name} jogou com ${analysisA.formacao}, explorando ${analysisA.pontosFortes[0].toLowerCase()}`,
      `${teamB.name} apostou em ${analysisB.estiloDeJogo.split(',')[0].toLowerCase()}`,
      winner ? `Fator decisivo: ${analysisA.pontosFortes[0]}` : 'Equilíbrio tático resultou no empate',
    ],
  };
}
