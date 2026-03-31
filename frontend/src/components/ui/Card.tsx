import { ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export default function Card({ children, className = '', glow = false }: CardProps) {
  const { isWorldCup } = useTheme();

  return (
    <div
      className={`rounded-2xl border p-6 transition-all duration-300 ${
        isWorldCup
          ? `bg-[#112240] border-amber-500/20 ${glow ? 'shadow-lg shadow-amber-500/10' : ''}`
          : `bg-slate-800/60 border-slate-700/50 ${glow ? 'shadow-lg shadow-green-500/5' : ''}`
      } ${className}`}
    >
      {children}
    </div>
  );
}
