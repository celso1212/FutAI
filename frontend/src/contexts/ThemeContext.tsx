import { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react';
import { defaultTheme } from '@/themes/defaultTheme';
import { worldCupTheme } from '@/themes/worldCupTheme';

// ─── Computed theme helpers ───────────────────────────────────────────────────
// Centralise all ternary repetition so components just use theme.accent etc.

export interface ThemeHelpers {
  isWorldCup: boolean;
  /** e.g. "text-amber-400" | "text-green-400" */
  accent: string;
  /** e.g. "bg-amber-500/10" | "bg-green-500/10" */
  accentBg: string;
  /** e.g. "bg-amber-500/20" | "bg-green-500/20" */
  accentBgStrong: string;
  /** e.g. "border-amber-500/30" | "border-green-500/30" */
  accentBorder: string;
  /** focus ring class */
  focusRing: string;
  /** Page background */
  pageBg: string;
  /** Card background */
  cardBg: string;
  /** Badge variant for the active theme */
  badgeVariant: 'amber' | 'green';
}

interface ThemeContextValue extends ThemeHelpers {
  activateWorldCup: () => void;
  deactivateWorldCup: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyThemeCssVars(vars: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

function buildHelpers(isWorldCup: boolean): ThemeHelpers {
  if (isWorldCup) {
    return {
      isWorldCup: true,
      accent: 'text-amber-400',
      accentBg: 'bg-amber-500/10',
      accentBgStrong: 'bg-amber-500/20',
      accentBorder: 'border-amber-500/30',
      focusRing: 'focus:ring-amber-500/30 focus:border-amber-500/60',
      pageBg: 'bg-[#0a1628]',
      cardBg: 'bg-[#112240]',
      badgeVariant: 'amber',
    };
  }
  return {
    isWorldCup: false,
    accent: 'text-green-400',
    accentBg: 'bg-green-500/10',
    accentBgStrong: 'bg-green-500/20',
    accentBorder: 'border-green-500/30',
    focusRing: 'focus:ring-green-500/30 focus:border-green-500/60',
    pageBg: 'bg-[#0f172a]',
    cardBg: 'bg-slate-800/60',
    badgeVariant: 'green',
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isWorldCup, setIsWorldCup] = useState(() => {
    return localStorage.getItem('futai_worldcup') === 'true';
  });

  // Apply CSS variables whenever the mode changes
  useEffect(() => {
    applyThemeCssVars(isWorldCup ? worldCupTheme : defaultTheme);
    // Smooth transition class on <html>
    document.documentElement.classList.toggle('world-cup-mode', isWorldCup);
  }, [isWorldCup]);

  const activateWorldCup = useCallback(() => {
    localStorage.setItem('futai_worldcup', 'true');
    setIsWorldCup(true);
  }, []);

  const deactivateWorldCup = useCallback(() => {
    localStorage.setItem('futai_worldcup', 'false');
    setIsWorldCup(false);
  }, []);

  const helpers = useMemo(() => buildHelpers(isWorldCup), [isWorldCup]);

  return (
    <ThemeContext.Provider value={{ ...helpers, activateWorldCup, deactivateWorldCup }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
