import { Medal, Zap } from 'lucide-react';
import Card from '@/components/ui/Card';

export const WORLD_CUP_GROUPS: Record<string, string[]> = {
  A: ['Brasil', 'Alemanha', 'México', 'Marrocos'],
  B: ['França', 'Argentina', 'Japão', 'Senegal'],
  C: ['Espanha', 'Portugal', 'Colômbia', 'Estados Unidos'],
  D: ['Inglaterra', 'Países Baixos', 'Uruguai', 'Canadá'],
  E: ['Bélgica', 'Itália', 'Coreia do Sul', 'Nigéria'],
  F: ['Croácia', 'Dinamarca', 'Peru', 'Austrália'],
  G: ['Suíça', 'Polônia', 'Equador', 'Irã'],
  H: ['Sérvia', 'Chile', 'Egito', 'Arábia Saudita'],
};

const GROUP_COLORS: Record<string, { bg: string; border: string; textColor: string }> = {
  A: { bg: 'from-blue-500/10 to-cyan-500/10', border: 'border-blue-400/50', textColor: 'text-blue-300' },
  B: { bg: 'from-purple-500/10 to-pink-500/10', border: 'border-purple-400/50', textColor: 'text-purple-300' },
  C: { bg: 'from-red-500/10 to-orange-500/10', border: 'border-red-400/50', textColor: 'text-red-300' },
  D: { bg: 'from-green-500/10 to-emerald-500/10', border: 'border-green-400/50', textColor: 'text-green-300' },
  E: { bg: 'from-yellow-500/10 to-amber-500/10', border: 'border-yellow-400/50', textColor: 'text-yellow-300' },
  F: { bg: 'from-indigo-500/10 to-blue-500/10', border: 'border-indigo-400/50', textColor: 'text-indigo-300' },
  G: { bg: 'from-rose-500/10 to-pink-500/10', border: 'border-rose-400/50', textColor: 'text-rose-300' },
  H: { bg: 'from-teal-500/10 to-cyan-500/10', border: 'border-teal-400/50', textColor: 'text-teal-300' },
};

export default function Groups() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      {Object.entries(WORLD_CUP_GROUPS).map(([letter, teams]) => {
        const colors = GROUP_COLORS[letter];
        return (
          <Card key={letter} className={`border-2 ${colors.border} bg-gradient-to-br ${colors.bg} hover:shadow-xl transition-all duration-300 group`}>
            {/* Header with gradient accent */}
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-yellow-500/20">
              <div className="flex items-center gap-2">
                <h3 className={`${colors.textColor} font-black text-2xl`}>{letter}</h3>
                <span className="text-xs font-bold text-slate-400">GRUPO</span>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400/20 rounded-lg blur" />
                <Medal size={18} className="text-yellow-400 relative" />
              </div>
            </div>

            {/* Teams list */}
            <ul className="space-y-2.5">
              {teams.map((team, i) => {
                const isAdvanced = i < 2;
                return (
                  <li
                    key={team}
                    className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm transition-all ${
                      isAdvanced
                        ? `bg-gradient-to-r ${colors.bg} border border-yellow-400/40 shadow-md`
                        : 'text-slate-400 hover:bg-slate-700/30'
                    }`}
                  >
                    <span className={`font-mono font-bold text-xs w-5 shrink-0 ${
                      isAdvanced ? colors.textColor : 'text-slate-500'
                    }`}>
                      {i + 1}
                    </span>
                    <span className={`font-semibold flex-1 truncate ${
                      isAdvanced ? 'text-white' : 'text-slate-400'
                    }`}>
                      {team}
                    </span>
                    {isAdvanced && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-400/50">
                        <Zap size={12} className="text-yellow-300" />
                        <span className="text-xs font-bold text-yellow-200">
                          {i === 0 ? '1º' : '2º'}
                        </span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className={`text-xs font-semibold mt-4 pt-3 text-center border-t ${colors.border} ${colors.textColor}/60 opacity-70 group-hover:opacity-100 transition-opacity`}>
              ⚽ Classificação inicial (32 times)
            </div>
          </Card>
        );
      })}
    </div>
  );
}
