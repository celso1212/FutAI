import { Shield, Zap, Target, Users, ChevronRight } from 'lucide-react';
import { Analysis } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useTheme } from '@/contexts/ThemeContext';

interface AnalysisCardProps {
  analysis: Analysis;
  compact?: boolean;
}

export default function AnalysisCard({ analysis, compact = false }: AnalysisCardProps) {
  const { isWorldCup } = useTheme();
  const { content, team, opponent, mode, createdAt } = analysis;
  const accent = isWorldCup ? 'text-amber-400' : 'text-green-400';
  const accentBg = isWorldCup ? 'bg-amber-500/10' : 'bg-green-500/10';

  return (
    <Card glow>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-lg font-bold ${accent}`}>{team.name}</h3>
            {opponent && <span className="text-slate-500 text-sm">vs {opponent}</span>}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={mode === 'WORLD_CUP' ? 'amber' : 'green'}>
              {mode === 'WORLD_CUP' ? '🏆 Copa' : '⚽ Clube'}
            </Badge>
            <span className="text-slate-500 text-xs">
              {new Date(createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-xl text-sm font-mono font-bold ${accentBg} ${accent}`}>
          {content.formacao}
        </div>
      </div>

      {/* Estilo de jogo */}
      <p className="text-slate-300 text-sm mb-4 leading-relaxed border-l-2 border-slate-600 pl-3">
        {content.estiloDeJogo}
      </p>

      {!compact && (
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Pontos Fortes */}
          <div className={`rounded-xl p-4 ${accentBg}`}>
            <div className={`flex items-center gap-2 mb-3 text-sm font-semibold ${accent}`}>
              <Zap size={14} /> Padrões Ofensivos
            </div>
            <ul className="space-y-1.5">
              {content.pontosFortes.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <ChevronRight size={14} className={`shrink-0 mt-0.5 ${accent}`} />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Fragilidades Defensivas */}
          <div className="rounded-xl p-4 bg-red-500/10">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-red-400">
              <Shield size={14} /> Fragilidades Defensivas
            </div>
            <ul className="space-y-1.5">
              {content.pontosFracos.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <ChevronRight size={14} className="shrink-0 mt-0.5 text-red-400" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Plano de Jogo */}
          <div className="rounded-xl p-4 bg-blue-500/10 sm:col-span-2">
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-blue-400">
              <Target size={14} /> Plano de Jogo
            </div>
            <p className="text-slate-300 text-sm">{content.estrategia}</p>
          </div>

          {/* Jogadores-chave */}
          <div className="rounded-xl p-4 bg-slate-700/40 sm:col-span-2">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-300">
              <Users size={14} /> Jogadores-chave
            </div>
            <div className="flex flex-wrap gap-2">
              {content.jogadoresChave.map((j, i) => (
                <Badge key={i} variant="slate">{j}</Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
