import { Medal } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

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

export default function Groups() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      {Object.entries(WORLD_CUP_GROUPS).map(([letter, teams]) => (
        <Card key={letter} className="border-amber-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-amber-400 font-black text-lg">Grupo {letter}</h3>
            <Medal size={16} className="text-amber-500/50" />
          </div>

          <ul className="space-y-1.5">
            {teams.map((team, i) => (
              <li
                key={team}
                className={`flex items-center gap-3 py-2 px-3 rounded-xl text-sm transition-colors ${
                  i < 2
                    ? 'bg-amber-500/10 text-amber-200'
                    : 'text-slate-400 hover:bg-slate-700/30'
                }`}
              >
                <span className="text-amber-500/60 font-mono text-xs w-4 shrink-0">{i + 1}</span>
                <span className="font-medium flex-1 truncate">{team}</span>
                {i < 2 && (
                  <Badge variant="amber">{i === 0 ? '1º' : '2º'}</Badge>
                )}
              </li>
            ))}
          </ul>

          <p className="text-xs text-slate-600 mt-3 text-center border-t border-amber-500/10 pt-3">
            Classificação inicial
          </p>
        </Card>
      ))}
    </div>
  );
}
