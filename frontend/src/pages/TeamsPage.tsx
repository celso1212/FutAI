import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Heart, Shield, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { teamsApi } from '@/services/api';
import { useTheme } from '@/contexts/ThemeContext';
import { Team } from '@/types';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';

// ─── Country → ISO 2-letter flag codes (flagcdn.com) ─────────────────────────
const COUNTRY_FLAG: Record<string, string> = {
  Brasil: 'br', Argentina: 'ar', Uruguai: 'uy', Colômbia: 'co',
  Equador: 'ec', Chile: 'cl', Peru: 'pe', Venezuela: 've',
  Paraguai: 'py', Bolívia: 'bo', França: 'fr', Alemanha: 'de',
  Espanha: 'es', Inglaterra: 'gb-eng', Portugal: 'pt',
  'Países Baixos': 'nl', Bélgica: 'be', Itália: 'it', Croácia: 'hr',
  Sérvia: 'rs', Suíça: 'ch', Dinamarca: 'dk', Polônia: 'pl',
  Suécia: 'se', Noruega: 'no', Escócia: 'gb-sct', Áustria: 'at',
  Ucrânia: 'ua', 'República Tcheca': 'cz', Hungria: 'hu',
  México: 'mx', 'Estados Unidos': 'us', Canadá: 'ca',
  'Costa Rica': 'cr', Panamá: 'pa', Jamaica: 'jm', Honduras: 'hn',
  Marrocos: 'ma', Senegal: 'sn', Nigéria: 'ng', Egito: 'eg',
  Camarões: 'cm', 'Costa do Marfim': 'ci', Gana: 'gh',
  Tunísia: 'tn', Mali: 'ml', Japão: 'jp', 'Coreia do Sul': 'kr',
  Irã: 'ir', 'Arábia Saudita': 'sa', Austrália: 'au',
  Qatar: 'qa', China: 'cn',
};

// ─── League logos (ESPN CDN – com fallback de texto) ──────────────────────────
const LEAGUE_LOGO: Record<string, string> = {
  'Brasileirão Série A': 'https://a.espncdn.com/i/leaguelogos/soccer/500/85.png',
  'Brasileirão Série B': 'https://a.espncdn.com/i/leaguelogos/soccer/500/86.png',
  'Brasileirão Série C': 'https://a.espncdn.com/i/leaguelogos/soccer/500/87.png',
  'Premier League':      'https://a.espncdn.com/i/leaguelogos/soccer/500/23.png',
  'La Liga':             'https://a.espncdn.com/i/leaguelogos/soccer/500/15.png',
  'Serie A':             'https://a.espncdn.com/i/leaguelogos/soccer/500/12.png',
  'Bundesliga':          'https://a.espncdn.com/i/leaguelogos/soccer/500/10.png',
  'Ligue 1':             'https://a.espncdn.com/i/leaguelogos/soccer/500/9.png',
};

// ─── Confederation badge styling (for nationals headings) ─────────────────────
const CONFEDERATION: Record<string, { abbrev: string; cls: string; logo: string }> = {
  'América do Sul': {
    abbrev: 'CONMEBOL',
    cls: 'bg-blue-950 text-blue-300 border-blue-700/50',
    logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/conmebol.png',
  },
  'Europa': {
    abbrev: 'UEFA',
    cls: 'bg-indigo-950 text-indigo-300 border-indigo-700/50',
    logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/uefa.png',
  },
  'América do Norte': {
    abbrev: 'CONCACAF',
    cls: 'bg-red-950 text-red-300 border-red-700/50',
    logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/concacaf.png',
  },
  'África': {
    abbrev: 'CAF',
    cls: 'bg-orange-950 text-orange-300 border-orange-700/50',
    logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/caf.png',
  },
  'Ásia': {
    abbrev: 'AFC',
    cls: 'bg-teal-950 text-teal-300 border-teal-700/50',
    logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/afc.png',
  },
  'Oceania': {
    abbrev: 'OFC',
    cls: 'bg-cyan-950 text-cyan-300 border-cyan-700/50',
    logo: 'https://a.espncdn.com/i/leaguelogos/soccer/500/ofc.png',
  },
};

// ─── Continent mapping for national teams ─────────────────────────────────────
const CONTINENT_MAP: Record<string, string> = {
  Brasil: 'América do Sul', Argentina: 'América do Sul', Uruguai: 'América do Sul',
  Colômbia: 'América do Sul', Equador: 'América do Sul', Chile: 'América do Sul',
  Peru: 'América do Sul', Venezuela: 'América do Sul', Paraguai: 'América do Sul',
  Bolívia: 'América do Sul', França: 'Europa', Alemanha: 'Europa',
  Espanha: 'Europa', Inglaterra: 'Europa', Portugal: 'Europa',
  'Países Baixos': 'Europa', Bélgica: 'Europa', Itália: 'Europa',
  Croácia: 'Europa', Sérvia: 'Europa', Suíça: 'Europa', Dinamarca: 'Europa',
  Polônia: 'Europa', Suécia: 'Europa', Noruega: 'Europa', Escócia: 'Europa',
  Áustria: 'Europa', Ucrânia: 'Europa', 'República Tcheca': 'Europa',
  Hungria: 'Europa', México: 'América do Norte', 'Estados Unidos': 'América do Norte',
  Canadá: 'América do Norte', 'Costa Rica': 'América do Norte',
  Panamá: 'América do Norte', Jamaica: 'América do Norte',
  Honduras: 'América do Norte', Marrocos: 'África', Senegal: 'África',
  Nigéria: 'África', Egito: 'África', Camarões: 'África',
  'Costa do Marfim': 'África', Gana: 'África', Tunísia: 'África',
  Mali: 'África', Japão: 'Ásia', 'Coreia do Sul': 'Ásia', Irã: 'Ásia',
  'Arábia Saudita': 'Ásia', Austrália: 'Oceania', Qatar: 'Ásia', China: 'Ásia',
};

const CONTINENT_ORDER = [
  'América do Sul', 'Europa', 'América do Norte', 'África', 'Ásia', 'Oceania',
];

const LEAGUE_ORDER = [
  'Brasileirão Série A',
  'Brasileirão Série B',
  'Brasileirão Série C',
  'Brasileirão Série D',
  'Premier League',
  'La Liga',
  'Serie A',
  'Bundesliga',
  'Ligue 1',
];

type TabId = 'clubs' | 'nationals';

export default function TeamsPage() {
  const { isWorldCup, accent, accentBg } = useTheme();
  const [tab, setTab] = useState<TabId>(isWorldCup ? 'nationals' : 'clubs');

  const { data: clubs = [], isLoading: loadingClubs } = useQuery<Team[]>({
    queryKey: ['teams', 'club'],
    queryFn: () => teamsApi.list('club'),
  });

  const { data: nationals = [], isLoading: loadingNationals } = useQuery<Team[]>({
    queryKey: ['teams', 'national'],
    queryFn: () => teamsApi.list('national'),
  });

  const { data: favorites = [] } = useQuery<Team[]>({
    queryKey: ['favorites'],
    queryFn: teamsApi.favorites,
  });

  const favoriteIds = new Set(favorites.map((f) => f.id));

  // Group clubs by league
  const clubsByLeague = LEAGUE_ORDER.reduce<Record<string, Team[]>>((acc, league) => {
    const filtered = clubs.filter((t) => t.league === league);
    if (filtered.length) acc[league] = filtered;
    return acc;
  }, {});

  // Group nationals by continent
  const nationalsByContinent = CONTINENT_ORDER.reduce<Record<string, Team[]>>((acc, continent) => {
    const filtered = nationals.filter((t) => CONTINENT_MAP[t.country ?? ''] === continent);
    if (filtered.length) acc[continent] = filtered;
    return acc;
  }, {});

  const isLoading = tab === 'clubs' ? loadingClubs : loadingNationals;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className={`text-2xl font-bold ${accent}`}>
            <Users size={22} className="inline mr-2" />
            Times
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Explore clubes e seleções — adicione favoritos para acesso rápido
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-slate-800/60 p-1 rounded-xl w-fit border border-slate-700/50">
          <TabButton
            active={tab === 'clubs'}
            onClick={() => setTab('clubs')}
            icon={<Shield size={15} />}
            label="Clubes"
            isWorldCup={isWorldCup}
          />
          <TabButton
            active={tab === 'nationals'}
            onClick={() => setTab('nationals')}
            icon={<Trophy size={15} />}
            label="Seleções"
            isWorldCup={isWorldCup}
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <Loader label="Carregando times..." />
        ) : tab === 'clubs' ? (
          <div className="space-y-8">
            {Object.entries(clubsByLeague).map(([league, teams]) => (
              <TeamGroup
                key={league}
                title={league}
                teams={teams}
                favoriteIds={favoriteIds}
                accentBg={accentBg}
                accent={accent}
                isNational={false}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(nationalsByContinent).map(([continent, teams]) => (
              <TeamGroup
                key={continent}
                title={continent}
                teams={teams}
                favoriteIds={favoriteIds}
                accentBg={accentBg}
                accent={accent}
                isNational={true}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

// ─── TeamGroup ────────────────────────────────────────────────────────────────

function TeamGroup({
  title,
  teams,
  favoriteIds,
  accentBg,
  accent,
  isNational = false,
}: {
  title: string;
  teams: Team[];
  favoriteIds: Set<string>;
  accentBg: string;
  accent: string;
  isNational?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const leagueLogo = LEAGUE_LOGO[title];
  const conf = CONFEDERATION[title];

  return (
    <div>
      {/* ── Group header ── */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center gap-3 mb-4 group"
      >
        {/* League logo or confederation badge */}
        {!isNational && leagueLogo ? (
          <img
            src={leagueLogo}
            alt={title}
            className="w-8 h-8 object-contain rounded shrink-0"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        ) : isNational && conf ? (
          <div className={`shrink-0 px-2 py-0.5 rounded border text-[10px] font-bold tracking-widest ${conf.cls}`}>
            {conf.abbrev}
          </div>
        ) : null}

        {/* Title badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${accentBg} ${accent}`}>
          {title}
        </div>

        {/* Count */}
        <span className="text-slate-500 text-xs">({teams.length})</span>

        {/* Spacer + chevron */}
        <span className="flex-1" />
        <span className="text-slate-500 group-hover:text-slate-300 transition-colors">
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </span>
      </button>

      {/* ── Teams grid ── */}
      {!collapsed && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              isFavorite={favoriteIds.has(team.id)}
              accent={accent}
              isNational={isNational}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TeamCard ─────────────────────────────────────────────────────────────────

function TeamCard({
  team,
  isFavorite,
  accent,
  isNational = false,
}: {
  team: Team;
  isFavorite: boolean;
  accent: string;
  isNational?: boolean;
}) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => teamsApi.toggleFavorite(team.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  // Avatar content: logoUrl from DB > flag for nationals > styled initials
  const flagCode = isNational && team.country ? COUNTRY_FLAG[team.country] : undefined;
  const initials = team.name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Card className="!p-3 hover:border-current/40 transition-colors group">
      <div className="flex items-center gap-3">
        {/* ── Emblema ── */}
        <div className="shrink-0 w-9 h-9 rounded-lg bg-slate-700/50 border border-slate-600/40 flex items-center justify-center overflow-hidden">
          {team.logoUrl ? (
            <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain" />
          ) : flagCode ? (
            <img
              src={`https://flagcdn.com/w40/${flagCode}.png`}
              alt={team.country ?? team.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                el.style.display = 'none';
                el.parentElement!.textContent = initials;
              }}
            />
          ) : (
            <span className="text-[11px] font-bold text-slate-300 leading-none">{initials}</span>
          )}
        </div>

        {/* ── Info ── */}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-100 text-sm truncate">{team.name}</p>
          <p className="text-slate-500 text-xs mt-0.5 truncate">
            {team.league ?? team.country}
          </p>
        </div>

        {/* ── Favorite ── */}
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          className={`shrink-0 p-1.5 rounded-lg transition-all ${
            isFavorite
              ? `${accent} bg-current/10 opacity-100`
              : 'text-slate-600 hover:text-slate-300 opacity-60 group-hover:opacity-100'
          }`}
        >
          <Heart size={15} className={isFavorite ? 'fill-current' : ''} />
        </button>
      </div>
    </Card>
  );
}

// ─── TabButton ────────────────────────────────────────────────────────────────

function TabButton({
  active,
  onClick,
  icon,
  label,
  isWorldCup,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  isWorldCup: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
        active
          ? isWorldCup
            ? 'bg-amber-500 text-black shadow-md'
            : 'bg-green-500 text-black shadow-md'
          : isWorldCup
          ? 'text-amber-400/60 hover:text-amber-300 hover:bg-amber-500/10'
          : 'text-green-400/60 hover:text-green-300 hover:bg-green-500/10'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
