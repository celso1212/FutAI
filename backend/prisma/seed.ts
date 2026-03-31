import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const clubs = [
  // ── Brasileirão Série A ──────────────────────────────────────────────────────
  { name: 'Flamengo', country: 'Brasil', league: 'Brasileirão Série A' },
  { name: 'Palmeiras', country: 'Brasil', league: 'Brasileirão Série A' },
  { name: 'Corinthians', country: 'Brasil', league: 'Brasileirão Série A' },
  { name: 'São Paulo', country: 'Brasil', league: 'Brasileirão Série A' },
  { name: 'Grêmio', country: 'Brasil', league: 'Brasileirão Série A' },
  { name: 'Internacional', country: 'Brasil', league: 'Brasileirão Série A' },
  { name: 'Atlético Mineiro', country: 'Brasil', league: 'Brasileirão Série A' },
  { name: 'Fluminense', country: 'Brasil', league: 'Brasileirão Série A' },
  { name: 'Santos', country: 'Brasil', league: 'Brasileirão Série A' },
  { name: 'Vasco da Gama', country: 'Brasil', league: 'Brasileirão Série A' },
  { name: 'Botafogo', country: 'Brasil', league: 'Brasileirão Série A' },
  { name: 'Cruzeiro', country: 'Brasil', league: 'Brasileirão Série A' },
  { name: 'Bahia', country: 'Brasil', league: 'Brasileirão Série A' },
  { name: 'Fortaleza', country: 'Brasil', league: 'Brasileirão Série A' },
  { name: 'Athletico Paranaense', country: 'Brasil', league: 'Brasileirão Série A' },
  { name: 'Bragantino', country: 'Brasil', league: 'Brasileirão Série A' },
  { name: 'Cuiabá', country: 'Brasil', league: 'Brasileirão Série A' },
  { name: 'Criciúma', country: 'Brasil', league: 'Brasileirão Série A' },
  { name: 'Atlético Goianiense', country: 'Brasil', league: 'Brasileirão Série A' },
  { name: 'Juventude', country: 'Brasil', league: 'Brasileirão Série A' },

  // ── Brasileirão Série B ──────────────────────────────────────────────────────
  { name: 'América Mineiro', country: 'Brasil', league: 'Brasileirão Série B' },
  { name: 'Avaí', country: 'Brasil', league: 'Brasileirão Série B' },
  { name: 'CRB', country: 'Brasil', league: 'Brasileirão Série B' },
  { name: 'Guarani', country: 'Brasil', league: 'Brasileirão Série B' },
  { name: 'Botafogo-SP', country: 'Brasil', league: 'Brasileirão Série B' },
  { name: 'Chapecoense', country: 'Brasil', league: 'Brasileirão Série B' },
  { name: 'Novorizontino', country: 'Brasil', league: 'Brasileirão Série B' },
  { name: 'Paysandu', country: 'Brasil', league: 'Brasileirão Série B' },
  { name: 'Coritiba', country: 'Brasil', league: 'Brasileirão Série B' },
  { name: 'Ponte Preta', country: 'Brasil', league: 'Brasileirão Série B' },
  { name: 'Mirassol', country: 'Brasil', league: 'Brasileirão Série B' },
  { name: 'Ituano', country: 'Brasil', league: 'Brasileirão Série B' },
  { name: 'Sport', country: 'Brasil', league: 'Brasileirão Série B' },
  { name: 'Vila Nova', country: 'Brasil', league: 'Brasileirão Série B' },
  { name: 'Operário', country: 'Brasil', league: 'Brasileirão Série B' },
  { name: 'Sampaio Corrêa', country: 'Brasil', league: 'Brasileirão Série B' },
  { name: 'Brusque', country: 'Brasil', league: 'Brasileirão Série B' },
  { name: 'ABC', country: 'Brasil', league: 'Brasileirão Série B' },
  { name: 'Náutico', country: 'Brasil', league: 'Brasileirão Série B' },
  { name: 'Goiás', country: 'Brasil', league: 'Brasileirão Série B' },

  // ── Brasileirão Série C ──────────────────────────────────────────────────────
  { name: 'Remo', country: 'Brasil', league: 'Brasileirão Série C' },
  { name: 'Figueirense', country: 'Brasil', league: 'Brasileirão Série C' },
  { name: 'CSA', country: 'Brasil', league: 'Brasileirão Série C' },
  { name: 'Botafogo-PB', country: 'Brasil', league: 'Brasileirão Série C' },
  { name: 'Volta Redonda', country: 'Brasil', league: 'Brasileirão Série C' },
  { name: 'Ferroviária', country: 'Brasil', league: 'Brasileirão Série C' },
  { name: 'Confiança', country: 'Brasil', league: 'Brasileirão Série C' },
  { name: 'Aparecidense', country: 'Brasil', league: 'Brasileirão Série C' },
  { name: 'Ypiranga', country: 'Brasil', league: 'Brasileirão Série C' },
  { name: 'Floresta', country: 'Brasil', league: 'Brasileirão Série C' },
  { name: 'Maringá FC', country: 'Brasil', league: 'Brasileirão Série C' },
  { name: 'Caxias', country: 'Brasil', league: 'Brasileirão Série C' },
  { name: 'Tombense', country: 'Brasil', league: 'Brasileirão Série C' },
  { name: 'Pouso Alegre', country: 'Brasil', league: 'Brasileirão Série C' },
  { name: 'Altos', country: 'Brasil', league: 'Brasileirão Série C' },
  { name: 'Caldense', country: 'Brasil', league: 'Brasileirão Série C' },
  { name: 'São Bernardo FC', country: 'Brasil', league: 'Brasileirão Série C' },
  { name: 'Campinense', country: 'Brasil', league: 'Brasileirão Série C' },
  { name: 'Athletic Club', country: 'Brasil', league: 'Brasileirão Série C' },
  { name: 'Amazonas FC', country: 'Brasil', league: 'Brasileirão Série C' },

  // ── Brasileirão Série D ──────────────────────────────────────────────────────
  { name: 'Manaus FC', country: 'Brasil', league: 'Brasileirão Série D' },
  { name: 'Cascavel CR', country: 'Brasil', league: 'Brasileirão Série D' },
  { name: 'Francana', country: 'Brasil', league: 'Brasileirão Série D' },
  { name: 'Sergipe', country: 'Brasil', league: 'Brasileirão Série D' },
  { name: 'Globo FC', country: 'Brasil', league: 'Brasileirão Série D' },
  { name: 'Porto Velho', country: 'Brasil', league: 'Brasileirão Série D' },
  { name: 'Rio Branco AC', country: 'Brasil', league: 'Brasileirão Série D' },
  { name: 'Trem', country: 'Brasil', league: 'Brasileirão Série D' },
  { name: 'Galvez', country: 'Brasil', league: 'Brasileirão Série D' },
  { name: 'Real Noroeste', country: 'Brasil', league: 'Brasileirão Série D' },
  { name: 'Tocantinópolis', country: 'Brasil', league: 'Brasileirão Série D' },
  { name: 'Dom Bosco', country: 'Brasil', league: 'Brasileirão Série D' },

  // ── Premier League ───────────────────────────────────────────────────────────
  { name: 'Manchester City', country: 'Inglaterra', league: 'Premier League' },
  { name: 'Liverpool', country: 'Inglaterra', league: 'Premier League' },
  { name: 'Arsenal', country: 'Inglaterra', league: 'Premier League' },
  { name: 'Chelsea', country: 'Inglaterra', league: 'Premier League' },
  { name: 'Manchester United', country: 'Inglaterra', league: 'Premier League' },
  { name: 'Tottenham Hotspur', country: 'Inglaterra', league: 'Premier League' },
  { name: 'Newcastle United', country: 'Inglaterra', league: 'Premier League' },
  { name: 'Aston Villa', country: 'Inglaterra', league: 'Premier League' },
  { name: 'Brighton', country: 'Inglaterra', league: 'Premier League' },
  { name: 'West Ham', country: 'Inglaterra', league: 'Premier League' },
  { name: 'Brentford', country: 'Inglaterra', league: 'Premier League' },
  { name: 'Crystal Palace', country: 'Inglaterra', league: 'Premier League' },
  { name: 'Fulham', country: 'Inglaterra', league: 'Premier League' },
  { name: 'Wolverhampton', country: 'Inglaterra', league: 'Premier League' },
  { name: 'Everton', country: 'Inglaterra', league: 'Premier League' },
  { name: 'Bournemouth', country: 'Inglaterra', league: 'Premier League' },
  { name: 'Nottingham Forest', country: 'Inglaterra', league: 'Premier League' },
  { name: 'Luton Town', country: 'Inglaterra', league: 'Premier League' },
  { name: 'Sheffield United', country: 'Inglaterra', league: 'Premier League' },
  { name: 'Burnley', country: 'Inglaterra', league: 'Premier League' },

  // ── La Liga ──────────────────────────────────────────────────────────────────
  { name: 'Real Madrid', country: 'Espanha', league: 'La Liga' },
  { name: 'Barcelona', country: 'Espanha', league: 'La Liga' },
  { name: 'Atlético de Madrid', country: 'Espanha', league: 'La Liga' },
  { name: 'Real Sociedad', country: 'Espanha', league: 'La Liga' },
  { name: 'Athletic Club', country: 'Espanha', league: 'La Liga' },
  { name: 'Villarreal', country: 'Espanha', league: 'La Liga' },
  { name: 'Real Betis', country: 'Espanha', league: 'La Liga' },
  { name: 'Valencia', country: 'Espanha', league: 'La Liga' },
  { name: 'Sevilla', country: 'Espanha', league: 'La Liga' },
  { name: 'Osasuna', country: 'Espanha', league: 'La Liga' },
  { name: 'Celta Vigo', country: 'Espanha', league: 'La Liga' },
  { name: 'Getafe', country: 'Espanha', league: 'La Liga' },
  { name: 'Rayo Vallecano', country: 'Espanha', league: 'La Liga' },
  { name: 'Mallorca', country: 'Espanha', league: 'La Liga' },
  { name: 'Las Palmas', country: 'Espanha', league: 'La Liga' },
  { name: 'Girona', country: 'Espanha', league: 'La Liga' },
  { name: 'Deportivo Alavés', country: 'Espanha', league: 'La Liga' },
  { name: 'Cádiz', country: 'Espanha', league: 'La Liga' },
  { name: 'Granada', country: 'Espanha', league: 'La Liga' },
  { name: 'Almería', country: 'Espanha', league: 'La Liga' },

  // ── Serie A (Itália) ─────────────────────────────────────────────────────────
  { name: 'Juventus', country: 'Itália', league: 'Serie A' },
  { name: 'Milan', country: 'Itália', league: 'Serie A' },
  { name: 'Inter de Milão', country: 'Itália', league: 'Serie A' },
  { name: 'Napoli', country: 'Itália', league: 'Serie A' },
  { name: 'Roma', country: 'Itália', league: 'Serie A' },
  { name: 'Lazio', country: 'Itália', league: 'Serie A' },
  { name: 'Atalanta', country: 'Itália', league: 'Serie A' },
  { name: 'Fiorentina', country: 'Itália', league: 'Serie A' },
  { name: 'Torino', country: 'Itália', league: 'Serie A' },
  { name: 'Bologna', country: 'Itália', league: 'Serie A' },
  { name: 'Udinese', country: 'Itália', league: 'Serie A' },
  { name: 'Verona', country: 'Itália', league: 'Serie A' },
  { name: 'Sassuolo', country: 'Itália', league: 'Serie A' },
  { name: 'Lecce', country: 'Itália', league: 'Serie A' },
  { name: 'Empoli', country: 'Itália', league: 'Serie A' },
  { name: 'Salernitana', country: 'Itália', league: 'Serie A' },
  { name: 'Genoa', country: 'Itália', league: 'Serie A' },
  { name: 'Frosinone', country: 'Itália', league: 'Serie A' },
  { name: 'Cagliari', country: 'Itália', league: 'Serie A' },
  { name: 'Monza', country: 'Itália', league: 'Serie A' },

  // ── Bundesliga ───────────────────────────────────────────────────────────────
  { name: 'Bayern de Munique', country: 'Alemanha', league: 'Bundesliga' },
  { name: 'Borussia Dortmund', country: 'Alemanha', league: 'Bundesliga' },
  { name: 'Bayer Leverkusen', country: 'Alemanha', league: 'Bundesliga' },
  { name: 'RB Leipzig', country: 'Alemanha', league: 'Bundesliga' },
  { name: 'Eintracht Frankfurt', country: 'Alemanha', league: 'Bundesliga' },
  { name: 'Union Berlin', country: 'Alemanha', league: 'Bundesliga' },
  { name: 'SC Freiburg', country: 'Alemanha', league: 'Bundesliga' },
  { name: 'Wolfsburg', country: 'Alemanha', league: 'Bundesliga' },
  { name: 'Mainz 05', country: 'Alemanha', league: 'Bundesliga' },
  { name: 'Borussia Mönchengladbach', country: 'Alemanha', league: 'Bundesliga' },
  { name: 'Hoffenheim', country: 'Alemanha', league: 'Bundesliga' },
  { name: 'Augsburg', country: 'Alemanha', league: 'Bundesliga' },
  { name: 'Werder Bremen', country: 'Alemanha', league: 'Bundesliga' },
  { name: 'Colônia', country: 'Alemanha', league: 'Bundesliga' },
  { name: 'Bochum', country: 'Alemanha', league: 'Bundesliga' },
  { name: 'Stuttgart', country: 'Alemanha', league: 'Bundesliga' },
  { name: 'Darmstadt', country: 'Alemanha', league: 'Bundesliga' },
  { name: 'Heidenheim', country: 'Alemanha', league: 'Bundesliga' },

  // ── Ligue 1 ──────────────────────────────────────────────────────────────────
  { name: 'Paris Saint-Germain', country: 'França', league: 'Ligue 1' },
  { name: 'Olympique de Marseille', country: 'França', league: 'Ligue 1' },
  { name: 'Monaco', country: 'França', league: 'Ligue 1' },
  { name: 'Lyon', country: 'França', league: 'Ligue 1' },
  { name: 'Lens', country: 'França', league: 'Ligue 1' },
  { name: 'Lille', country: 'França', league: 'Ligue 1' },
  { name: 'Rennes', country: 'França', league: 'Ligue 1' },
  { name: 'Nice', country: 'França', league: 'Ligue 1' },
  { name: 'Strasbourg', country: 'França', league: 'Ligue 1' },
  { name: 'Montpellier', country: 'França', league: 'Ligue 1' },
  { name: 'Nantes', country: 'França', league: 'Ligue 1' },
  { name: 'Clermont', country: 'França', league: 'Ligue 1' },
  { name: 'Lorient', country: 'França', league: 'Ligue 1' },
  { name: 'Reims', country: 'França', league: 'Ligue 1' },
  { name: 'Toulouse', country: 'França', league: 'Ligue 1' },
  { name: 'Metz', country: 'França', league: 'Ligue 1' },
  { name: 'Le Havre', country: 'França', league: 'Ligue 1' },
  { name: 'Brest', country: 'França', league: 'Ligue 1' },
];

const nationalTeams = [
  // Copa do Mundo 2026 — 48 seleções classificadas
  { name: 'Brasil', country: 'Brasil' },
  { name: 'Argentina', country: 'Argentina' },
  { name: 'França', country: 'França' },
  { name: 'Alemanha', country: 'Alemanha' },
  { name: 'Espanha', country: 'Espanha' },
  { name: 'Inglaterra', country: 'Inglaterra' },
  { name: 'Portugal', country: 'Portugal' },
  { name: 'Países Baixos', country: 'Países Baixos' },
  { name: 'Bélgica', country: 'Bélgica' },
  { name: 'Itália', country: 'Itália' },
  { name: 'Uruguai', country: 'Uruguai' },
  { name: 'Colômbia', country: 'Colômbia' },
  { name: 'México', country: 'México' },
  { name: 'Estados Unidos', country: 'Estados Unidos' },
  { name: 'Canadá', country: 'Canadá' },
  { name: 'Japão', country: 'Japão' },
  { name: 'Coreia do Sul', country: 'Coreia do Sul' },
  { name: 'Marrocos', country: 'Marrocos' },
  { name: 'Senegal', country: 'Senegal' },
  { name: 'Nigéria', country: 'Nigéria' },
  { name: 'Egito', country: 'Egito' },
  { name: 'Austrália', country: 'Austrália' },
  { name: 'Croácia', country: 'Croácia' },
  { name: 'Sérvia', country: 'Sérvia' },
  { name: 'Suíça', country: 'Suíça' },
  { name: 'Dinamarca', country: 'Dinamarca' },
  { name: 'Polônia', country: 'Polônia' },
  { name: 'Equador', country: 'Equador' },
  { name: 'Chile', country: 'Chile' },
  { name: 'Peru', country: 'Peru' },
  { name: 'Irã', country: 'Irã' },
  { name: 'Arábia Saudita', country: 'Arábia Saudita' },
  { name: 'Costa Rica', country: 'Costa Rica' },
  { name: 'Panamá', country: 'Panamá' },
  { name: 'Jamaica', country: 'Jamaica' },
  { name: 'Venezuela', country: 'Venezuela' },
  { name: 'Paraguai', country: 'Paraguai' },
  { name: 'Bolívia', country: 'Bolívia' },
  { name: 'Camarões', country: 'Camarões' },
  { name: 'Costa do Marfim', country: 'Costa do Marfim' },
  { name: 'Gana', country: 'Gana' },
  { name: 'Tunísia', country: 'Tunísia' },
  { name: 'Mali', country: 'Mali' },
  { name: 'Qatar', country: 'Qatar' },
  { name: 'Arábia Saudita', country: 'Arábia Saudita' },
  { name: 'Áustria', country: 'Áustria' },
  { name: 'Escócia', country: 'Escócia' },
  { name: 'Turquia', country: 'Turquia' },
];

// Grupos Copa do Mundo 2026 (simulado)
const worldCupGroups: Record<string, string[]> = {
  A: ['Brasil', 'Alemanha', 'México', 'Marrocos'],
  B: ['França', 'Argentina', 'Japão', 'Senegal'],
  C: ['Espanha', 'Portugal', 'Colômbia', 'Estados Unidos'],
  D: ['Inglaterra', 'Países Baixos', 'Uruguai', 'Canadá'],
  E: ['Bélgica', 'Itália', 'Coreia do Sul', 'Nigéria'],
  F: ['Croácia', 'Dinamarca', 'Peru', 'Austrália'],
  G: ['Suíça', 'Polônia', 'Equador', 'Irã'],
  H: ['Sérvia', 'Chile', 'Egito', 'Arábia Saudita'],
  I: ['Costa Rica', 'Panamá', 'Tunísia', 'Gana'],
  J: ['Venezuela', 'Paraguai', 'Camarões', 'Qatar'],
  K: ['Costa do Marfim', 'Escócia', 'Turquia', 'Bolívia'],
  L: ['Jamaica', 'Áustria', 'Mali', 'Japão'],
};

async function main() {
  console.log('🌱 Iniciando seed...');

  // Clubs
  for (const club of clubs) {
    await prisma.team.upsert({
      where: { name: club.name },
      update: { league: club.league, country: club.country },
      create: { ...club, type: 'club' },
    });
  }
  console.log(`✅ ${clubs.length} clubes inseridos`);

  // National teams
  const uniqueNationals = nationalTeams.filter(
    (t, i, arr) => arr.findIndex((x) => x.name === t.name) === i
  );
  for (const nt of uniqueNationals) {
    await prisma.team.upsert({
      where: { name: nt.name },
      update: { country: nt.country },
      create: { ...nt, type: 'national' },
    });
  }
  console.log(`✅ ${uniqueNationals.length} seleções inseridas`);

  console.log('🌍 Seed concluído com sucesso!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
