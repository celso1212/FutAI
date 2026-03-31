import { SelectHTMLAttributes } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export default function Select({ label, className = '', ...props }: SelectProps) {
  const { isWorldCup } = useTheme();

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-300">{label}</label>
      )}
      <select
        className={`w-full px-4 py-2.5 rounded-xl border text-slate-200 text-sm outline-none transition-colors focus:ring-2 ${
          isWorldCup
            ? 'bg-[#0a1628] border-amber-500/30 focus:ring-amber-500/30 focus:border-amber-500/60'
            : 'bg-slate-900 border-slate-600 focus:ring-green-500/30 focus:border-green-500/60'
        } ${className}`}
        {...props}
      />
    </div>
  );
}
