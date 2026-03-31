import {
  createContext, useContext, useState, useCallback, ReactNode,
} from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Team } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppContextValue {
  /** Mirrors ThemeContext.isWorldCup — single source of truth exposed here */
  isWorldCupMode: boolean;
  /** Activate World Cup mode (applies theme + updates state) */
  enableWorldCup: () => void;
  /** Deactivate World Cup mode */
  disableWorldCup: () => void;
  /** Toggle with confirmation handled by callers */
  toggleWorldCup: () => void;

  /** Currently selected team (shared across Analysis / Compare) */
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team | null) => void;

  /** Currently selected opponent (shared across Compare) */
  selectedOpponent: Team | null;
  setSelectedOpponent: (team: Team | null) => void;

  /** Clear all selections */
  clearSelections: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
// Must be mounted INSIDE ThemeProvider so it can call useTheme().

export function AppProvider({ children }: { children: ReactNode }) {
  const { isWorldCup, activateWorldCup, deactivateWorldCup } = useTheme();

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedOpponent, setSelectedOpponent] = useState<Team | null>(null);

  const enableWorldCup = useCallback(() => {
    activateWorldCup();
    // Reset club selections when switching to Copa mode
    setSelectedTeam(null);
    setSelectedOpponent(null);
  }, [activateWorldCup]);

  const disableWorldCup = useCallback(() => {
    deactivateWorldCup();
    setSelectedTeam(null);
    setSelectedOpponent(null);
  }, [deactivateWorldCup]);

  const toggleWorldCup = useCallback(() => {
    if (isWorldCup) {
      disableWorldCup();
    } else {
      enableWorldCup();
    }
  }, [isWorldCup, enableWorldCup, disableWorldCup]);

  const clearSelections = useCallback(() => {
    setSelectedTeam(null);
    setSelectedOpponent(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        isWorldCupMode: isWorldCup,
        enableWorldCup,
        disableWorldCup,
        toggleWorldCup,
        selectedTeam,
        setSelectedTeam,
        selectedOpponent,
        setSelectedOpponent,
        clearSelections,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
