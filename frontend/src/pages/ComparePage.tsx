import { useState, FormEvent } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Swords, ChevronRight, Target, Shield, Zap, TrendingUp } from 'lucide-react';
import { teamsApi } from '@/services/api';
import { compareTeams } from '@/services/ai';
import { useApp } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ComparisonResult, Team } from '@/types';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TeamSelect from '@/components/ui/TeamSelect';
import Badge from '@/components/ui/Badge';
import Loader from '@/components/ui/Loader';
import ErrorState from '@/components/ui/ErrorState';

export default function ComparePage() {
  const { isWorldCupMode, selectedTeam, selectedOpponent, setSelectedTeam, setSelectedOpponent } = useApp();
  const { accent, accentBg, badgeVariant } = useTheme();
  const teamType = isWorldCupMode ? 'national' : 'club';
  const mode = isWorldCupMode ? 'WORLD_CUP' : 'CLUB';

  const [myTeamId, setMyTeamId] = useState(selectedTeam?.id ?? '');
  const [opponentId, setOpponentId] = useState(selectedOpponent?.id ?? '');

  const { data: teams = [], isLoading: loadingTeams } = useQuery<Team[]>({
    queryKey: ['teams', teamType],
    queryFn: () => teamsApi.list(teamType),
  });

  const mutation = useMutation<ComparisonResult, Error>({
    mutationFn: () => compareTeams(myTeamId, opponentId, { mode }),
    onSuccess: (data) => {
      // Persist selections to AppContext
      setSelectedTeam(teams.find((t) => t.id === myTeamId) ?? null);
      setSelectedOpponent(teams.find((t) => t.id === opponentId) ?? null);
      return data;
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!myTeamId || !opponentId || myTeamId === opponentId) return;
    mutation.mutate();
  };

  const result = mutation.data;
  const canSubmit = !!myTeamId && !!opponentId && myTeamId !== opponentId;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className={`text-2xl font-bold ${accent}`}>
            <Swords size={22} className="inline mr-2" />
            Comparação de Times
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isWorldCupMode
              ? 'Compare seleções e descubra estratégias para a Copa do Mundo'
              : 'Analise o confronto tático entre dois times'}
          </p>
        </div>

        {/* Form */}
        <Card glow>
          {loadingTeams ? (
            <Loader label="Carregando times..." />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4 items-end">
                <TeamSelect
                  label={isWorldCupMode ? 'Minha Seleção' : 'Meu Time'}
                  value={myTeamId}
                  onChange={setMyTeamId}
                  teams={teams}
                  excludeId={opponentId}
                  required
                />

                <TeamSelect
                  label="Adversário"
                  value={opponentId}
                  onChange={setOpponentId}
                  teams={teams}
                  excludeId={myTeamId}
                  required
                />
              </div>

              {mutation.isError && (
                <ErrorState
                  message={
                    (mutation.error as { response?: { data?: { error?: string } } })?.response?.data
                      ?.error ?? 'Erro ao comparar times.'
                  }
                  onRetry={() => mutation.reset()}
                />
              )}

              <Button
                type="submit"
                loading={mutation.isPending}
                disabled={!canSubmit}
              >
                <Swords size={16} />
                {mutation.isPending ? 'Analisando...' : 'Comparar com IA'}
              </Button>
            </form>
          )}
        </Card>

        {/* Result */}
        {result && (
          <div className="space-y-4 animate-slide-up">
            {/* Score card */}
            <Card glow className="text-center">
              <div className="flex items-center justify-center gap-6 sm:gap-12 mb-4">
                <div className="text-right">
                  <p className={`text-xl sm:text-2xl font-bold ${accent}`}>{result.myTeam.name}</p>
                  <Badge variant={badgeVariant}>Meu time</Badge>
                </div>
                <div>
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    {result.analysis.placarProvavel}
                  </div>
                  <p className="text-slate-500 text-xs mt-1">Placar provável</p>
                </div>
                <div className="text-left">
                  <p className="text-xl sm:text-2xl font-bold text-slate-300">{result.opponent.name}</p>
                  <Badge variant="slate">Adversário</Badge>
                </div>
              </div>
              <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
                {result.analysis.justificativaTatica}
              </p>
            </Card>

            {/* Three-column insights */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className={accentBg}>
                <SectionHeader icon={<TrendingUp size={14} />} label="Como Ganhar" color={accent} />
                <BulletList items={result.analysis.comoGanhar} color={accent} />
              </Card>

              <Card className="bg-red-500/10">
                <SectionHeader icon={<Shield size={14} />} label="Riscos" color="text-red-400" />
                <BulletList items={result.analysis.riscos} color="text-red-400" />
              </Card>

              <Card className="bg-blue-500/10 sm:col-span-2 lg:col-span-1">
                <SectionHeader icon={<Target size={14} />} label="Estratégias" color="text-blue-400" />
                <BulletList items={result.analysis.estrategiasRecomendadas} color="text-blue-400" />
              </Card>
            </div>

            {/* Team panels */}
            <div className="grid sm:grid-cols-2 gap-4">
              <TeamPanel title={result.myTeam.name} analysis={result.analysis.myTeam} highlight accent={accent} />
              <TeamPanel title={result.opponent.name} analysis={result.analysis.opponent} highlight={false} accent="text-slate-300" />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function SectionHeader({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <div className={`flex items-center gap-2 mb-3 font-semibold text-sm ${color}`}>
      {icon} {label}
    </div>
  );
}

function BulletList({ items, color }: { items: string[]; color: string }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
          <ChevronRight size={14} className={`shrink-0 mt-0.5 ${color}`} />
          {item}
        </li>
      ))}
    </ul>
  );
}

function TeamPanel({
  title,
  analysis,
  highlight,
  accent,
}: {
  title: string;
  analysis: ComparisonResult['analysis']['myTeam'];
  highlight: boolean;
  accent: string;
}) {
  return (
    <Card className={highlight ? 'border-current/20' : ''}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-bold text-lg ${accent}`}>{title}</h3>
        <span className="px-3 py-1 rounded-xl text-xs font-mono bg-slate-700/50 text-slate-300">
          {analysis.formacao}
        </span>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2">
            <Zap size={11} /> Pontos Fortes
          </div>
          <div className="flex flex-wrap gap-1.5">
            {analysis.pontosFortes.map((p, i) => <Badge key={i} variant="green">{p}</Badge>)}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2">
            <Shield size={11} /> Pontos Fracos
          </div>
          <div className="flex flex-wrap gap-1.5">
            {analysis.pontosFracos.map((p, i) => <Badge key={i} variant="red">{p}</Badge>)}
          </div>
        </div>
      </div>
    </Card>
  );
}
