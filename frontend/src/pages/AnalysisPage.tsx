import { useState, FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BarChart2, Plus, ChevronDown } from 'lucide-react';
import { teamsApi } from '@/services/api';
import { analyzeTeam, listAnalyses } from '@/services/ai';
import { useApp } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Analysis, Team, Competition, MatchLocation, MatchImportance } from '@/types';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TeamSelect from '@/components/ui/TeamSelect';
import Loader from '@/components/ui/Loader';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import AnalysisCard from '@/components/analysis/AnalysisCard';
import MatchContextComponent from '@/components/analysis/MatchContext';

export default function AnalysisPage() {
  const { isWorldCupMode, selectedTeam, setSelectedTeam } = useApp();
  const { accent, accentBorder } = useTheme();
  const qc = useQueryClient();

  const teamType = isWorldCupMode ? 'national' : 'club';
  const mode = isWorldCupMode ? 'WORLD_CUP' : 'CLUB';

  const [teamId, setTeamId] = useState(selectedTeam?.id ?? '');
  const [opponent, setOpponent] = useState('');
  const [rawInput, setRawInput] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [competition, setCompetition] = useState<Competition>('liginha');
  const [location, setLocation] = useState<MatchLocation>('home');
  const [importance, setImportance] = useState<MatchImportance>('medium');

  const { data: teams = [], isLoading: loadingTeams } = useQuery<Team[]>({
    queryKey: ['teams', teamType],
    queryFn: () => teamsApi.list(teamType),
  });

  const {
    data: analyses = [],
    isLoading: loadingList,
    isError: listError,
    refetch,
  } = useQuery<Analysis[]>({
    queryKey: ['analyses', mode],
    queryFn: () => listAnalyses(mode),
  });

  const mutation = useMutation({
    mutationFn: () =>
      analyzeTeam(teamId, {
        opponent: opponent || undefined,
        rawInput: rawInput || undefined,
        mode,
        matchContext: { competition, location, importance },
      }),
    onSuccess: (data) => {
      // Sync selected team to AppContext
      const found = teams.find((t) => t.id === teamId) ?? null;
      setSelectedTeam(found);
      qc.invalidateQueries({ queryKey: ['analyses'] });
      setTeamId('');
      setOpponent('');
      setRawInput('');
      setCompetition('liginha');
      setLocation('home');
      setImportance('medium');
      setShowForm(false);
      return data;
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!teamId) return;
    mutation.mutate();
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${accent}`}>
              <BarChart2 size={22} className="inline mr-2" />
              Análise de Partida
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {isWorldCupMode
                ? 'Análise tática de seleções — Modo Copa do Mundo'
                : 'Selecione um time e gere análise tática com IA'}
            </p>
          </div>
          <Button onClick={() => setShowForm((v) => !v)}>
            <Plus size={16} />
            Preparar Jogo
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${showForm ? 'rotate-180' : ''}`}
            />
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card glow className="animate-slide-up">
            <h2 className="text-lg font-semibold text-white mb-5">Preparação de Jogo</h2>

            {loadingTeams ? (
              <Loader label="Carregando times..." />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Team selector — auto-switches between club / national */}
                <TeamSelect
                  label={isWorldCupMode ? 'Seleção' : 'Time'}
                  value={teamId}
                  onChange={setTeamId}
                  teams={teams}
                  required
                />

                {/* Opponent (free text) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Adversário <span className="text-slate-500">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder={isWorldCupMode ? 'Ex: França' : 'Ex: Corinthians'}
                    value={opponent}
                    onChange={(e) => setOpponent(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-slate-900 text-slate-200 text-sm outline-none transition-colors placeholder-slate-500 border-slate-600 ${accentBorder} focus:ring-2`}
                  />
                </div>

                {/* Raw notes */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Dados / observações{' '}
                    <span className="text-slate-500">(opcional)</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Descreva padrões observados, contexto do jogo, formação adversária..."
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    maxLength={2000}
                    className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-900 text-slate-200 text-sm outline-none transition-colors placeholder-slate-500 resize-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/60"
                  />
                  <span className="text-xs text-slate-500 text-right">{rawInput.length}/2000</span>
                </div>

                {/* Match Context */}
                <MatchContextComponent
                  competition={competition}
                  location={location}
                  importance={importance}
                  onCompetitionChange={setCompetition}
                  onLocationChange={setLocation}
                  onImportanceChange={setImportance}
                />

                {mutation.isError && (
                  <ErrorState
                    message="Não foi possível gerar a análise. Tente novamente."
                    onRetry={() => mutation.reset()}
                  />
                )}

                <div className="flex gap-3 pt-1">
                  <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" loading={mutation.isPending} disabled={!teamId}>
                    {mutation.isPending ? 'Analisando...' : 'Gerar com IA'}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        )}

        {/* List states */}
        {loadingList && <Loader label="Carregando análises..." />}

        {!loadingList && listError && (
          <ErrorState
            message="Não foi possível carregar as análises."
            onRetry={() => refetch()}
          />
        )}

        {!loadingList && !listError && analyses.length === 0 && (
          <EmptyState
            icon={<BarChart2 size={48} />}
            title="Nenhuma análise ainda"
            description={`Clique em "Nova Análise" para gerar sua primeira análise tática com IA.`}
          />
        )}

        {!loadingList && !listError && analyses.length > 0 && (
          <div className="space-y-4">
            {analyses.map((a) => (
              <AnalysisCard key={a.id} analysis={a} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
