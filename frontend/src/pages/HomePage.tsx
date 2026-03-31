import { useQuery } from '@tanstack/react-query';
import { BarChart2, Heart, Trophy, ArrowRight, Newspaper, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analysisApi, teamsApi, newsApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Analysis, Team } from '@/types';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import AnalysisCard from '@/components/analysis/AnalysisCard';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'agora';
  if (h < 24) return `${h}h atrás`;
  return `${Math.floor(h / 24)}d atrás`;
}

export default function HomePage() {
  const { user } = useAuth();
  const { isWorldCup } = useTheme();
  const accent = isWorldCup ? 'text-amber-400' : 'text-green-400';

  const { data: analyses = [] } = useQuery<Analysis[]>({
    queryKey: ['analyses', isWorldCup ? 'WORLD_CUP' : 'CLUB'],
    queryFn: () => analysisApi.list(isWorldCup ? 'WORLD_CUP' : undefined),
  });

  const { data: favorites = [] } = useQuery<Team[]>({
    queryKey: ['favorites'],
    queryFn: teamsApi.favorites,
  });

  const { data: news = [] } = useQuery<NewsArticle[]>({
    queryKey: ['news', isWorldCup ? 'copa' : 'futebol'],
    queryFn: () => newsApi.list(isWorldCup ? 'Copa do Mundo futebol' : 'futebol brasileirao', 5),
    staleTime: 1000 * 60 * 15,
  });

  const recentAnalyses = analyses.slice(0, 3);

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Greeting */}
        <div>
          <h1 className="text-3xl font-bold text-white">
            Olá, {user?.name ?? 'Analista'} 👋
          </h1>
          <p className="text-slate-400 mt-1">
            {isWorldCup
              ? 'Modo Copa do Mundo ativo — análise de seleções nacionais'
              : 'Pronto para analisar sua próxima partida?'}
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickAction
            to="/analysis"
            icon={<BarChart2 size={22} />}
            title="Nova Análise"
            description="Gere análise tática com IA"
            isWorldCup={isWorldCup}
          />
          <QuickAction
            to="/compare"
            icon={<Trophy size={22} />}
            title="Comparar Times"
            description="Confronto tático entre dois times"
            isWorldCup={isWorldCup}
          />
          {isWorldCup && (
            <QuickAction
              to="/worldcup"
              icon={<Trophy size={22} />}
              title="Copa do Mundo"
              description="Grupos, chaves e simulações"
              isWorldCup={isWorldCup}
              highlight
            />
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent analyses */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-semibold ${accent}`}>
                <BarChart2 size={18} className="inline mr-2" />
                Últimas Análises
              </h2>
              <Link to="/analysis" className="text-sm text-slate-400 hover:text-slate-200 flex items-center gap-1">
                Ver todas <ArrowRight size={14} />
              </Link>
            </div>

            {recentAnalyses.length === 0 ? (
              <Card className="text-center py-12">
                <BarChart2 size={40} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">Nenhuma análise ainda.</p>
                <Link to="/analysis" className={`text-sm ${accent} hover:underline mt-2 block`}>
                  Criar primeira análise →
                </Link>
              </Card>
            ) : (
              recentAnalyses.map((a) => (
                <AnalysisCard key={a.id} analysis={a} compact />
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Favorite teams */}
            <div>
              <h2 className={`text-lg font-semibold ${accent} mb-3`}>
                <Heart size={18} className="inline mr-2" />
                Times Favoritos
              </h2>
              <Card>
                {favorites.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-4">
                    Adicione favoritos na aba de times
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {favorites.slice(0, 6).map((team) => (
                      <li key={team.id} className="flex items-center justify-between">
                        <span className="text-slate-200 text-sm">{team.name}</span>
                        <Badge variant={team.type === 'national' ? 'amber' : 'green'}>
                          {team.type === 'national' ? 'Seleção' : 'Clube'}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>

            {/* News feed */}
            <div>
              <h2 className={`text-lg font-semibold ${accent} mb-3`}>
                <Newspaper size={18} className="inline mr-2" />
                Notícias
              </h2>
              <Card>
                <ul className="divide-y divide-slate-700/50">
                  {news.map((article, i) => (
                    <li key={i} className="py-3 first:pt-0 last:pb-0">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block hover:opacity-80 transition-opacity"
                      >
                        <p className="text-slate-200 text-sm font-medium leading-snug mb-1 group-hover:text-white flex items-start gap-1">
                          {article.title}
                          <ExternalLink size={11} className="shrink-0 mt-0.5 text-slate-500" />
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{article.source}</span>
                          <span>·</span>
                          <span>{timeAgo(article.publishedAt)}</span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

interface QuickActionProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  isWorldCup: boolean;
  highlight?: boolean;
}

function QuickAction({ to, icon, title, description, isWorldCup, highlight }: QuickActionProps) {
  return (
    <Link
      to={to}
      className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 ${
        highlight
          ? 'bg-amber-500/10 border-amber-500/40 hover:bg-amber-500/20'
          : isWorldCup
          ? 'bg-[#112240] border-amber-500/20 hover:border-amber-500/40'
          : 'bg-slate-800/60 border-slate-700/50 hover:border-green-500/30'
      }`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
          highlight
            ? 'bg-amber-500/20 text-amber-400'
            : isWorldCup
            ? 'bg-amber-500/10 text-amber-400'
            : 'bg-green-500/10 text-green-400'
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-white">{title}</p>
        <p className="text-slate-400 text-sm truncate">{description}</p>
      </div>
      <ArrowRight
        size={16}
        className="ml-auto shrink-0 text-slate-500 group-hover:text-slate-300 transition-colors"
      />
    </Link>
  );
}
