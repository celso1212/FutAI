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
        {/* World Cup Hero Banner with Theme */}
        <div className="relative rounded-2xl overflow-hidden border border-amber-500/50 bg-gradient-to-br from-[#FFD700]/10 via-[#0066CC]/10 to-[#FF0000]/10 p-8 shadow-2xl">
          {/* Rainbow stripe pattern - inspired by World Cup 2026 design */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 via-blue-500 to-green-500" />
            <div className="absolute left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-yellow-500 to-cyan-500" />
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 via-blue-500 to-yellow-500" />
            <div className="absolute right-3 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-pink-500 to-blue-500" />
          </div>

          {/* Decorative dots and glow elements */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255, 215, 0, 0.3) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          
          {/* Glow orbs with World Cup colors */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-yellow-400/15 to-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-gradient-to-br from-blue-600/15 to-cyan-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
              {/* Trophy Icon with glow */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl blur-lg" />
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400/30 to-orange-500/30 border-2 border-yellow-400/50 flex items-center justify-center shrink-0 relative z-10">
                  <Trophy size={32} className="text-yellow-300 drop-shadow-lg" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent leading-tight">
                    Copa do Mundo 2026
                  </h1>
                  <div className="hidden md:block w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border border-yellow-400/50 animate-pulse" />
                </div>
                <p className="text-yellow-200/90 text-base font-semibold mb-3 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30">
                    🇺🇸 EUA
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/30">
                    🇲🇽 México
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-400/30">
                    🇨🇦 Canadá
                  </span>
                </p>
                <p className="text-white text-sm font-medium">
                  48 seleções · 80 partidas · 12 estádios
                </p>
              </div>
            </div>

            <p className="text-slate-200 max-w-2xl text-base leading-relaxed bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              ⚽ Explore os grupos, analise o chaveamento do torneio e simule partidas entre as melhores seleções do mundo com inteligência artificial. Viva a emoção da Copa do Mundo!</p>
          </div>
        </div>

        {/* Enhanced Tab bar with World Cup styling */}
        <div className="flex gap-1 bg-gradient-to-r from-[#112240] via-[#1a3a5c] to-[#112240] p-1.5 rounded-xl w-fit border-2 border-yellow-500/40 shadow-xl">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                tab === t.id
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow-lg scale-105 border border-yellow-300'
                  : 'text-yellow-300/70 hover:text-yellow-300 hover:bg-yellow-500/15 border border-transparent'
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
