import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Team } from '@/types';

interface TeamSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  teams: Team[];
  placeholder?: string;
  excludeId?: string;
  required?: boolean;
}

export default function TeamSelect({
  label,
  value,
  onChange,
  teams,
  placeholder = 'Selecione...',
  excludeId,
  required,
}: TeamSelectProps) {
  const { isWorldCup } = useTheme();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = teams
    .filter((t) => t.id !== excludeId)
    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  const selected = teams.find((t) => t.id === value);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Focus search when opening
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const accent = isWorldCup
    ? 'border-amber-500/30 focus-within:border-amber-500/60 focus-within:ring-amber-500/20'
    : 'border-slate-600 focus-within:border-green-500/60 focus-within:ring-green-500/20';

  const accentHover = isWorldCup
    ? 'hover:bg-amber-500/10 hover:text-amber-300'
    : 'hover:bg-green-500/10 hover:text-green-300';

  const accentActive = isWorldCup
    ? 'bg-amber-500/20 text-amber-300'
    : 'bg-green-500/20 text-green-400';

  return (
    <div className="flex flex-col gap-1.5 relative" ref={containerRef}>
      {label && (
        <label className="text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
          isWorldCup ? 'bg-[#0a1628]' : 'bg-slate-900'
        } ${accent}`}
      >
        <span className={selected ? 'text-slate-200' : 'text-slate-500'}>
          {selected ? selected.name : placeholder}
        </span>
        <ChevronDown
          size={15}
          className={`text-slate-400 transition-transform shrink-0 ml-2 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`absolute z-50 mt-1 w-full rounded-xl border shadow-2xl overflow-hidden ${
            isWorldCup
              ? 'bg-[#0a1628] border-amber-500/30 shadow-amber-500/10'
              : 'bg-slate-900 border-slate-600 shadow-black/40'
          }`}
          style={{ top: '100%', left: 0 }}
        >
          {/* Search input */}
          <div className={`flex items-center gap-2 px-3 py-2 border-b ${isWorldCup ? 'border-amber-500/20' : 'border-slate-700'}`}>
            <Search size={14} className="text-slate-400 shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar time..."
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-slate-500 hover:text-slate-300">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Options list */}
          <div className="max-h-56 overflow-y-auto">
            {/* Clear option */}
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false); setSearch(''); }}
              className={`w-full text-left px-4 py-2.5 text-sm text-slate-500 ${accentHover} transition-colors`}
            >
              {placeholder}
            </button>

            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-slate-500 text-center">Nenhum time encontrado</p>
            ) : (
              filtered.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { onChange(t.id); setOpen(false); setSearch(''); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    t.id === value ? accentActive : `text-slate-200 ${accentHover}`
                  }`}
                >
                  {t.name}
                  {t.league && (
                    <span className="ml-2 text-xs text-slate-500">{t.league}</span>
                  )}
                  {!t.league && t.country && (
                    <span className="ml-2 text-xs text-slate-500">{t.country}</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
