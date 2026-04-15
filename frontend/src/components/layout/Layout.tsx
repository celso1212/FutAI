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
      {/* World Cup ambient glow and pattern background */}
      {isWorldCup && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {/* Rainbow stripes - World Cup 2026 theme */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-b from-pink-500 via-blue-500 via-green-500 to-yellow-500" />
            <div className="absolute left-12 top-0 bottom-0 w-4 bg-gradient-to-b from-purple-500 via-yellow-500 to-cyan-500" />
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-b from-red-500 via-blue-500 to-yellow-500" />
            <div className="absolute right-12 top-0 bottom-0 w-4 bg-gradient-to-b from-green-500 via-pink-500 to-blue-500" />
          </div>

          {/* Radial glow elements */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/8 rounded-full blur-3xl" />

          {/* Stadium grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: 'linear-gradient(90deg, #FFD700 1px, transparent 1px), linear-gradient(#FFD700 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* Floating particles effect */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-1/4 w-2 h-2 bg-yellow-400/30 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="absolute top-32 right-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-red-400/30 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            <div className="absolute bottom-10 right-1/3 w-2 h-2 bg-green-400/30 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }} />
          </div>
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
