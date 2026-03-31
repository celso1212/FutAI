import { ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  const { cardBg, accentBorder } = useTheme();

  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-16 px-8 rounded-2xl border border-dashed ${accentBorder} ${cardBg}`}
    >
      <div className="text-slate-600 mb-4">{icon}</div>
      <h3 className="text-slate-300 font-semibold text-lg mb-1">{title}</h3>
      {description && <p className="text-slate-500 text-sm max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  );
}
