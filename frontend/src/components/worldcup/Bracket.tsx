import { Trophy } from 'lucide-react';

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
      <div className="overflow-x-auto pb-4 -mx-1 px-1">
        <div className="flex gap-6 min-w-max">
          {ROUNDS.map((round) => (
            <BracketColumn key={round.label} round={round} />
          ))}

          {/* Champion placeholder */}
          <div className="flex flex-col justify-center items-center gap-2 px-4">
            <Trophy size={40} className="text-amber-400" />
            <span className="text-amber-400 font-black text-sm whitespace-nowrap">Campeão</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BracketColumn({ round }: { round: BracketRound }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-amber-400 font-semibold text-xs text-center whitespace-nowrap uppercase tracking-wider mb-1">
        {round.label}
      </h3>
      <div className="flex flex-col gap-3">
        {round.matches.map((match, i) => (
          <MatchCard key={i} match={match} />
        ))}
      </div>
    </div>
  );
}

function MatchCard({ match }: { match: BracketMatch }) {
  return (
    <div className="bg-[#112240] border border-amber-500/20 rounded-xl overflow-hidden w-44 hover:border-amber-500/40 transition-colors">
      <TeamRow name={match.teamA} topBorder={false} />
      <div className="border-t border-amber-500/10" />
      <TeamRow name={match.teamB} topBorder={false} />
    </div>
  );
}

function TeamRow({ name }: { name: string; topBorder: boolean }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-amber-500/5 transition-colors">
      <div className="w-2 h-2 rounded-full bg-amber-500/30 shrink-0" />
      <span className="text-slate-300 truncate text-xs">{name}</span>
    </div>
  );
}
