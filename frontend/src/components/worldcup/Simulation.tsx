import { useState, FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Play, RefreshCw } from 'lucide-react';
import { teamsApi } from '@/services/api';
import { simulateMatch, listSimulations } from '@/services/ai';
import { useApp } from '@/contexts/AppContext';
import { Team, Simulation as SimulationData } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TeamSelect from '@/components/ui/TeamSelect';
import Loader from '@/components/ui/Loader';
import ErrorState from '@/components/ui/ErrorState';

export default function Simulation() {
  const { selectedTeam, selectedOpponent, setSelectedTeam, setSelectedOpponent } = useApp();

  const [teamAId, setTeamAId] = useState(selectedTeam?.id ?? '');
  const [teamBId, setTeamBId] = useState(selectedOpponent?.id ?? '');

  const qc = useQueryClient();

  const { data: teams = [], isLoading: loadingTeams } = useQuery<Team[]>({
    queryKey: ['teams', 'national'],
    queryFn: () => teamsApi.list('national'),
  });

  const { data: history = [], isLoading: loadingHistory } = useQuery<SimulationData[]>({
    queryKey: ['simulations'],
    queryFn: () => listSimulations(5),
  });

  const mutation = useMutation<SimulationData, Error>({
    mutationFn: () => simulateMatch(teamAId, teamBId),
    onSuccess: (data) => {
      // Sync selections back to AppContext so other pages share the choice
      const tA = teams.find((t) => t.id === teamAId) ?? null;
      const tB = teams.find((t) => t.id === teamBId) ?? null;
      setSelectedTeam(tA);
      setSelectedOpponent(tB);
      qc.invalidateQueries({ queryKey: ['simulations'] });
      return data;
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!teamAId || !teamBId || teamAId === teamBId) return;
    mutation.mutate();
  };

  const sim = mutation.data;
  const canSubmit = !!teamAId && !!teamBId && teamAId !== teamBId;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Form */}
      <Card glow className="border-yellow-400/40 bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
        <h2 className="text-yellow-300 font-black mb-6 flex items-center gap-3 text-xl">
          <div className="p-2 bg-yellow-500/20 rounded-lg border border-yellow-400/50">
            <Play size={20} className="text-yellow-300" />
          </div>
          Simular Partida
        </h2>

        {loadingTeams ? (
          <Loader label="Carregando seleções..." />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <TeamSelect
                label="Seleção A"
                value={teamAId}
                onChange={setTeamAId}
                teams={teams}
                excludeId={teamBId}
                required
              />

              <TeamSelect
                label="Seleção B"
                value={teamBId}
                onChange={setTeamBId}
                teams={teams}
                excludeId={teamAId}
                required
              />
            </div>

            {mutation.isError && (
              <ErrorState
                message="Não foi possível simular a partida. Tente novamente."
                onRetry={() => mutation.reset()}
              />
            )}

            <Button 
              type="submit" 
              loading={mutation.isPending} 
              disabled={!canSubmit}
              className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-black font-black w-full"
            >
              <Play size={18} />
              {mutation.isPending ? 'Simulando com IA...' : 'Simular Partida'}
            </Button>
          </form>
        )}
      </Card>

      {/* Simulation result */}
      {sim && (
        <SimulationResult sim={sim} onReset={() => { mutation.reset(); setTeamAId(''); setTeamBId(''); }} />
      )}

      {/* History */}
      {!loadingHistory && history.length > 0 && (
        <SimulationHistory history={history} />
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SimulationResult({ sim, onReset }: { sim: SimulationData; onReset: () => void }) {
  const [golsA, golsB] = sim.result.placar.split(' x ').map(Number);
  const winner = golsA > golsB ? sim.teamA.name : golsB > golsA ? sim.teamB.name : null;

  return (
    <Card glow className="border-yellow-400/50 bg-gradient-to-br from-yellow-500/15 to-orange-500/15 animate-slide-up">
      {/* Stadium Header */}
      <div className="text-center mb-8 pb-6 border-b border-yellow-400/20">
        <p className="text-yellow-200/70 text-sm font-semibold uppercase tracking-wider mb-3">
          🏟️ Resultado da Partida
        </p>
        <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/40">
          <p className="text-yellow-200 text-xs font-bold">Copa do Mundo 2026</p>
        </div>
      </div>

      {/* Score Board */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          {/* Team A */}
          <div className="text-right flex-1">
            <p className="text-2xl font-black text-white mb-1">{sim.teamA.name}</p>
            <p className="text-slate-400 text-sm">{sim.teamA.country}</p>
          </div>

          {/* Score Display - Stadium-like */}
          <div className="px-6 py-4 rounded-2xl bg-gradient-to-br from-black/80 to-slate-900/80 border-4 border-yellow-400/60 shadow-2xl">
            <div className="text-6xl font-black text-yellow-300 tracking-tighter font-mono">
              {golsA}
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mt-2">
              <span className="w-1 h-1 bg-yellow-400 rounded-full" />
              <span>x</span>
              <span className="w-1 h-1 bg-yellow-400 rounded-full" />
            </div>
            <div className="text-6xl font-black text-yellow-300 tracking-tighter font-mono">
              {golsB}
            </div>
          </div>

          {/* Team B */}
          <div className="text-left flex-1">
            <p className="text-2xl font-black text-white mb-1">{sim.teamB.name}</p>
            <p className="text-slate-400 text-sm">{sim.teamB.country}</p>
          </div>
        </div>

        {/* Winner Badge */}
        <div className="flex justify-center">
          {winner ? (
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 text-yellow-200 text-sm font-black px-5 py-2 rounded-full border-2 border-yellow-400/60 shadow-lg">
              <span className="text-xl">👑</span>
              Vencedor: {winner}
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-slate-600/40 text-slate-300 text-sm font-bold px-5 py-2 rounded-full border border-slate-500">
              <span className="text-xl">🤝</span>
              Empate
            </div>
          )}
        </div>
      </div>

      {/* Justification */}
      <p className="text-slate-200 text-sm text-center mb-6 leading-relaxed p-4 bg-blue-500/10 border-l-4 border-blue-400/60 rounded-lg">
        💭 {sim.result.justificativa}
      </p>

      {/* Highlights */}
      <div className="bg-gradient-to-r from-yellow-500/15 to-orange-500/15 rounded-xl p-5 mb-6 border border-yellow-400/30">
        <p className="text-yellow-300 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="text-lg">⚡</span> Destaques Táticos
        </p>
        <ul className="space-y-3">
          {sim.result.destaques.map((d, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-200">
              <span className="text-yellow-300 font-bold mt-0.5 shrink-0">{i + 1}.</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button 
        variant="secondary" 
        onClick={onReset} 
        fullWidth
        className="bg-slate-700/50 hover:bg-slate-600/50 text-white font-bold"
      >
        <RefreshCw size={16} /> Simular Outra Partida
      </Button>
    </Card>
  );
}

function SimulationHistory({ history }: { history: SimulationData[] }) {
  return (
    <div>
      <h3 className="text-yellow-300 font-black mb-4 text-base uppercase tracking-wider flex items-center gap-2">
        <span className="text-lg">📊</span> Histórico de Simulações
      </h3>
      <div className="space-y-3">
        {history.map((s, idx) => {
          const [golsA, golsB] = s.result.placar.split(' x ').map(Number);
          const winner =
            golsA > golsB ? s.teamA.name : golsB > golsA ? s.teamB.name : 'Empate';
          const isWinnerA = golsA > golsB;
          const isWinnerB = golsB > golsA;

          return (
            <div
              key={s.id}
              className="flex items-center justify-between bg-gradient-to-r from-slate-700/30 to-slate-600/20 border-2 border-yellow-400/30 rounded-xl px-5 py-4 hover:border-yellow-400/60 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <span className="text-yellow-300 font-black text-sm shrink-0">#{history.length - idx}</span>
                
                <div className="flex items-center gap-3 text-sm flex-1 min-w-0">
                  <span className={`font-bold truncate ${isWinnerA ? 'text-yellow-200' : 'text-slate-400'}`}>
                    {s.teamA.name}
                  </span>
                  <span className="text-yellow-400 font-black font-mono text-base shrink-0">
                    {s.result.placar}
                  </span>
                  <span className={`font-bold truncate ${isWinnerB ? 'text-yellow-200' : 'text-slate-400'}`}>
                    {s.teamB.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 ml-4">
                <div className="text-center">
                  <p className="text-yellow-300 text-sm font-bold">
                    {winner === 'Empate' ? '🤝' : `${isWinnerA ? '✓' : '✗'}`}
                  </p>
                  <p className="text-slate-500 text-xs hidden sm:block">
                    {winner === 'Empate' ? 'Empate' : winner}
                  </p>
                </div>
                <span className="text-slate-600 text-xs whitespace-nowrap">
                  {new Date(s.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
