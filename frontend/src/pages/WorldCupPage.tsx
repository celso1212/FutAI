import { useState } from 'react';
import { Trophy, Users, Play } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Layout from '@/components/layout/Layout';
import Groups from '@/components/worldcup/Groups';
import Bracket from '@/components/worldcup/Bracket';
import Simulation from '@/components/worldcup/Simulation';
import Button from '@/components/ui/Button';

type TabId = 'groups' | 'bracket' | 'simulate';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'groups', label: 'Grupos', icon: <Users size={15} /> },
  { id: 'bracket', label: 'Chaveamento', icon: <Trophy size={15} /> },
  { id: 'simulate', label: 'Simulação', icon: <Play size={15} /> },
];

export default function WorldCupPage() {
  const { isWorldCupMode, enableWorldCup } = useApp();
  const [tab, setTab] = useState<TabId>('groups');

  // Inactive state
  if (!isWorldCupMode) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6">
            <Trophy size={40} className="text-slate-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-300 mb-2">Modo Copa do Mundo inativo</h2>
          <p className="text-slate-500 max-w-sm mb-6">
            Ative o Modo Copa para explorar grupos, chaveamento e simular partidas entre seleções.
          </p>
          <Button onClick={enableWorldCup}>
            <Trophy size={16} /> Ativar Modo Copa
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Hero banner */}
        <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-[#112240] via-[#0d1b35] to-[#0a1628] p-8">
          {/* Decorative dots pattern */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(245,158,11,0.15) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          {/* Glow orbs */}
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Trophy size={28} className="text-amber-400" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white leading-tight">Copa do Mundo 2026</h1>
                <p className="text-amber-400/80 text-sm mt-0.5">EUA · México · Canadá · 48 seleções</p>
              </div>
            </div>
            <p className="text-slate-300 max-w-xl text-sm leading-relaxed">
              Explore os grupos, veja o chaveamento do torneio e simule partidas entre as melhores seleções do mundo com inteligência artificial.
            </p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-[#112240] p-1 rounded-xl w-fit border border-amber-500/20">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t.id
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-amber-400/60 hover:text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'groups' && <Groups />}
        {tab === 'bracket' && <Bracket />}
        {tab === 'simulate' && <Simulation />}
      </div>
    </Layout>
  );
}
