import { Zap, Crown } from 'lucide-react';

interface BracketMatch {
  teamA: string;
  teamB: string;
}

interface BracketRound {
  label: string;
  matches: BracketMatch[];
}

const ROUNDS: BracketRound[] = [
  {
    label: 'Oitavas de Final',
    matches: [
      { teamA: '1º Grupo A', teamB: '2º Grupo B' },
      { teamA: '1º Grupo C', teamB: '2º Grupo D' },
      { teamA: '1º Grupo E', teamB: '2º Grupo F' },
      { teamA: '1º Grupo G', teamB: '2º Grupo H' },
      { teamA: '1º Grupo B', teamB: '2º Grupo A' },
      { teamA: '1º Grupo D', teamB: '2º Grupo C' },
      { teamA: '1º Grupo F', teamB: '2º Grupo E' },
      { teamA: '1º Grupo H', teamB: '2º Grupo G' },
    ],
  },
  {
    label: 'Quartas de Final',
    matches: [
      { teamA: 'Vencedor OF1', teamB: 'Vencedor OF2' },
      { teamA: 'Vencedor OF3', teamB: 'Vencedor OF4' },
      { teamA: 'Vencedor OF5', teamB: 'Vencedor OF6' },
      { teamA: 'Vencedor OF7', teamB: 'Vencedor OF8' },
    ],
  },
  {
    label: 'Semifinais',
    matches: [
      { teamA: 'Vencedor QF1', teamB: 'Vencedor QF2' },
      { teamA: 'Vencedor QF3', teamB: 'Vencedor QF4' },
    ],
  },
  {
    label: 'Final',
    matches: [{ teamA: 'Vencedor SF1', teamB: 'Vencedor SF2' }],
  },
];

export default function Bracket() {
  return (
    <div className="animate-fade-in">
      {/* Bracket Title */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex-1 h-1 bg-gradient-to-r from-yellow-400/50 via-red-400/50 to-transparent rounded-full" />
        <h2 className="text-yellow-300 font-black text-lg whitespace-nowrap">CHAVEAMENTO DO TORNEIO</h2>
        <div className="flex-1 h-1 bg-gradient-to-l from-yellow-400/50 via-blue-400/50 to-transparent rounded-full" />
      </div>

      <div className="overflow-x-auto pb-6 -mx-1 px-1">
        <div className="flex gap-8 min-w-max">
          {ROUNDS.map((round) => (
            <BracketColumn key={round.label} round={round} />
          ))}

          {/* Champion Highlight */}
          <div className="flex flex-col justify-center items-center gap-3 px-6 py-8 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-2 border-yellow-400/50 shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-2xl blur-xl" />
            <div className="relative z-10 text-center">
              <Crown size={48} className="text-yellow-300 mb-2 drop-shadow-lg mx-auto" />
              <span className="text-yellow-200 font-black text-lg whitespace-nowrap drop-shadow-lg">CAMPEÃO</span>
              <span className="text-yellow-300/60 text-xs mt-1 block font-semibold">2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BracketColumn({ round }: { round: BracketRound }) {
  const isSemifinal = round.label === 'Semifinais';
  const isFinal = round.label === 'Final';

  return (
    <div className="flex flex-col gap-4">
      {/* Round header */}
      <div className="text-center">
        <div className="inline-block">
          <h3 className="text-yellow-300 font-black text-xs text-center whitespace-nowrap uppercase tracking-widest px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-400/30">
            {round.label}
          </h3>
        </div>
      </div>

      {/* Matches container with proper spacing */}
      <div className={`flex flex-col gap-${isFinal ? '24' : '8'}`}>
        {round.matches.map((match, i) => (
          <MatchCard key={i} match={match} isFinal={isFinal} isSemifinal={isSemifinal} />
        ))}
      </div>
    </div>
  );
}

interface MatchCardProps {
  match: BracketMatch;
  isFinal?: boolean;
  isSemifinal?: boolean;
}

function MatchCard({ match, isFinal, isSemifinal }: MatchCardProps) {
  const cardSize = isFinal ? 'w-56' : isSemifinal ? 'w-48' : 'w-44';
  const bgGradient = isFinal 
    ? 'bg-gradient-to-br from-yellow-400/15 to-orange-500/15 border-yellow-400/60' 
    : 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-400/40';

  return (
    <div className={`${cardSize} rounded-xl overflow-hidden border-2 ${bgGradient} hover:shadow-xl transition-all duration-300 hover:scale-105`}>
      <TeamRow name={match.teamA} position="top" isFinal={isFinal} />
      <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent" />
      <div className="flex items-center justify-center py-1 bg-black/30">
        <Zap size={14} className="text-yellow-300" />
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent" />
      <TeamRow name={match.teamB} position="bottom" isFinal={isFinal} />
    </div>
  );
}

interface TeamRowProps {
  name: string;
  position: 'top' | 'bottom';
  isFinal?: boolean;
}

function TeamRow({ name, position, isFinal }: TeamRowProps) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-yellow-500/10 transition-colors group ${
      isFinal ? 'bg-gradient-to-r from-yellow-400/5 to-transparent' : ''
    }`}>
      <div className={`w-2 h-2 rounded-full shrink-0 transition-all group-hover:w-3 ${
        position === 'top' 
          ? 'bg-gradient-to-b from-yellow-400 to-orange-400' 
          : 'bg-gradient-to-b from-blue-400 to-cyan-400'
      }`} />
      <span className="text-slate-200 truncate text-xs font-semibold flex-1">{name}</span>
      <div className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold text-slate-400 bg-slate-700/50 group-hover:bg-yellow-500/20 group-hover:text-yellow-300 transition-all">
        ⚽
      </div>
    </div>
  );
}
