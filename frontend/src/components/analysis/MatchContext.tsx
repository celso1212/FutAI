import { Trophy, AlertCircle } from 'lucide-react';
import { Competition, MatchLocation, MatchImportance } from '@/types';

interface MatchContextProps {
  competition: Competition;
  location: MatchLocation;
  importance: MatchImportance;
  onCompetitionChange: (value: Competition) => void;
  onLocationChange: (value: MatchLocation) => void;
  onImportanceChange: (value: MatchImportance) => void;
}

const competitions: { value: Competition; label: string }[] = [
  { value: 'liginha', label: 'Campeonato Municipal' },
  { value: 'estadual', label: 'Campeonato Estadual' },
  { value: 'copaDoBrasil', label: 'Copa do Brasil' },
  { value: 'libertadores', label: 'Libertadores' },
  { value: 'copaDoMundo', label: 'Copa do Mundo' },
  { value: 'amistoso', label: 'Amistoso' },
  { value: 'outras', label: 'Outras' },
];

const locations: { value: MatchLocation; label: string; icon: string }[] = [
  { value: 'home', label: 'Casa', icon: '🏠' },
  { value: 'away', label: 'Fora', icon: '✈️' },
  { value: 'neutral', label: 'Neutro', icon: '🏟️' },
];

const importances: { value: MatchImportance; label: string; description: string }[] = [
  { value: 'low', label: 'Baixa', description: 'Preparação ou rodada comum' },
  { value: 'medium', label: 'Média', description: 'Jogo importante mas não decisivo' },
  { value: 'high', label: 'Decisiva', description: 'Decisão de título ou eliminação' },
];

export default function MatchContextComponent({
  competition,
  location,
  importance,
  onCompetitionChange,
  onLocationChange,
  onImportanceChange,
}: MatchContextProps) {
  return (
    <div className="rounded-xl border border-slate-600 bg-slate-800/40 p-5 space-y-5">
      <div className="flex items-center gap-2">
        <Trophy size={18} className="text-amber-400" />
        <h3 className="text-sm font-semibold text-white">Contexto da Partida</h3>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {/* Competition */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-300">Competição</label>
          <select
            value={competition}
            onChange={(e) => onCompetitionChange(e.target.value as Competition)}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-600 bg-slate-900 text-slate-200 text-sm outline-none transition-colors focus:ring-2 focus:ring-green-500/20 focus:border-green-500/60"
          >
            {competitions.map((comp) => (
              <option key={comp.value} value={comp.value}>
                {comp.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-300">Local do Jogo</label>
          <div className="grid grid-cols-3 gap-2">
            {locations.map((loc) => (
              <button
                key={loc.value}
                onClick={() => onLocationChange(loc.value)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-lg border transition-all text-xs font-medium ${
                  location === loc.value
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500'
                }`}
              >
                <span className="text-lg">{loc.icon}</span>
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Importance */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-300">Importância</label>
          <div className="space-y-2">
            {importances.map((imp) => (
              <button
                key={imp.value}
                onClick={() => onImportanceChange(imp.value)}
                className={`w-full flex items-start gap-2 px-3 py-2 rounded-lg border transition-all text-xs text-left ${
                  importance === imp.value
                    ? 'bg-green-500/20 border-green-500'
                    : 'bg-slate-800 border-slate-600 hover:border-slate-500'
                }`}
              >
                <AlertCircle
                  size={14}
                  className={`shrink-0 mt-0.5 ${
                    importance === imp.value ? 'text-green-400' : 'text-slate-500'
                  }`}
                />
                <div>
                  <p className={importance === imp.value ? 'text-green-400 font-medium' : 'text-slate-300'}>
                    {imp.label}
                  </p>
                  <p className="text-slate-500 text-xs">{imp.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
