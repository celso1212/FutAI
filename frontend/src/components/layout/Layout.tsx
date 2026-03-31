import { ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import Header from './Header';
import WorldCupButton from './WorldCupButton';

export default function Layout({ children }: { children: ReactNode }) {
  const { isWorldCup } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isWorldCup ? 'bg-[#0a1628]' : 'bg-[#0f172a]'
      }`}
    >
      {/* World Cup ambient glow */}
      {isWorldCup && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        </div>
      )}

      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>

      <WorldCupButton />
    </div>
  );
}
