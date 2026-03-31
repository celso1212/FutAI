import { useState, FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Play, ChevronRight, RefreshCw } from 'lucide-react';
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
      <Card glow className="border-amber-500/30">
        <h2 className="text-amber-400 font-semibold mb-5 flex items-center gap-2 text-lg">
          <Play size={18} /> Simular Partida
        </h2>

        {loadingTeams ? (
          <Loader label="Carregando seleções..." />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
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

            <Button type="submit" loading={mutation.isPending} disabled={!canSubmit}>
              <Play size={16} />
              {mutation.isPending ? 'Simulando...' : 'Simular com IA'}
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
    <Card glow className="border-amber-500/40 animate-slide-up">
      {/* Score */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-6 mb-2">
          <div className="text-right">
            <p className="text-xl font-bold text-amber-300">{sim.teamA.name}</p>
            <p className="text-slate-500 text-xs">{sim.teamA.country}</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-white tracking-tight">
              {sim.result.placar}
            </div>
            <p className="text-slate-500 text-xs mt-1">Resultado simulado</p>
          </div>
          <div className="text-left">
            <p className="text-xl font-bold text-slate-300">{sim.teamB.name}</p>
            <p className="text-slate-500 text-xs">{sim.teamB.country}</p>
          </div>
        </div>

        {winner ? (
          <span className="inline-block bg-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/30">
            Vencedor: {winner}
          </span>
        ) : (
          <span className="inline-block bg-slate-600/30 text-slate-400 text-xs font-semibold px-3 py-1 rounded-full border border-slate-600">
            Empate
          </span>
        )}
      </div>

      {/* Justification */}
      <p className="text-slate-300 text-sm text-center mb-5 leading-relaxed border-l-2 border-amber-500/30 pl-3">
        {sim.result.justificativa}
      </p>

      {/* Highlights */}
      <div className="bg-amber-500/5 rounded-xl p-4 mb-4">
        <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Destaques táticos
        </p>
        <ul className="space-y-2">
          {sim.result.destaques.map((d, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <ChevronRight size={14} className="shrink-0 mt-0.5 text-amber-400" />
              {d}
            </li>
          ))}
        </ul>
      </div>

      <Button variant="secondary" onClick={onReset} fullWidth>
        <RefreshCw size={14} /> Nova simulação
      </Button>
    </Card>
  );
}

function SimulationHistory({ history }: { history: SimulationData[] }) {
  return (
    <div>
      <h3 className="text-amber-400 font-semibold mb-3 text-sm uppercase tracking-wider">
        Histórico de Simulações
      </h3>
      <div className="space-y-2">
        {history.map((s) => {
          const [golsA, golsB] = s.result.placar.split(' x ').map(Number);
          const winner =
            golsA > golsB ? s.teamA.name : golsB > golsA ? s.teamB.name : 'Empate';

          return (
            <div
              key={s.id}
              className="flex items-center justify-between bg-[#112240] border border-amber-500/10 rounded-xl px-4 py-3 hover:border-amber-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 text-sm">
                <span className="text-slate-200 font-medium">{s.teamA.name}</span>
                <span className="text-amber-400 font-bold font-mono text-base">{s.result.placar}</span>
                <span className="text-slate-400">{s.teamB.name}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-slate-500 text-xs hidden sm:block">
                  {winner === 'Empate' ? '🤝' : `✓ ${winner}`}
                </span>
                <span className="text-slate-600 text-xs">
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
