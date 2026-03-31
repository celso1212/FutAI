import { useState } from 'react';
import { Trophy, X, Globe } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function WorldCupButton() {
  const { isWorldCupMode, enableWorldCup, disableWorldCup } = useApp();
  useTheme(); // subscribe to theme changes (CSS vars applied at root)
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (isWorldCupMode) {
      disableWorldCup();
    } else {
      setShowModal(true);
    }
  };

  const handleConfirm = () => {
    enableWorldCup();
    setShowModal(false);
  };

  return (
    <>
      {/* Fixed floating button */}
      <button
        onClick={handleClick}
        title={isWorldCupMode ? 'Desativar Modo Copa' : 'Ativar Modo Copa do Mundo'}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-xl font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95 ${
          isWorldCupMode
            ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/40 animate-pulse-slow'
            : 'bg-green-600 text-white hover:bg-green-500 shadow-green-600/30'
        }`}
      >
        <Trophy size={18} />
        <span className="hidden sm:inline">
          {isWorldCupMode ? 'Copa Ativa' : 'Modo Copa'}
        </span>
      </button>

      {/* Confirmation modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-[#112240] border border-amber-500/40 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl shadow-amber-500/10 animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                  <Trophy size={24} className="text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Modo Copa do Mundo</h2>
                  <p className="text-amber-400/70 text-xs">FIFA World Cup 2026</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-white transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Hosts */}
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 mb-5">
              <Globe size={14} className="text-amber-400 shrink-0" />
              <span className="text-amber-300 text-xs font-medium">
                EUA · México · Canadá — 48 seleções
              </span>
            </div>

            <p className="text-slate-300 text-sm mb-2">
              Deseja ativar o <strong className="text-amber-400">Modo Copa do Mundo</strong>?
            </p>
            <p className="text-slate-500 text-sm mb-7">
              O sistema será transformado numa experiência imersiva. Clubes serão
              substituídos por seleções nacionais automaticamente.
            </p>

            {/* Bullets */}
            <ul className="space-y-1.5 mb-7">
              {[
                'Tema visual Copa do Mundo ativado',
                'Grupos, chaveamento e simulações disponíveis',
                'Análises automáticas de seleções',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-amber-400">✓</span> {item}
                </li>
              ))}
            </ul>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700/50 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-all hover:shadow-lg hover:shadow-amber-500/20 text-sm"
              >
                Ativar Copa!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
