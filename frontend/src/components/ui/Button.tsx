import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

type Variant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const { isWorldCup } = useTheme();

  const base = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants: Record<Variant, string> = {
    primary: isWorldCup
      ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-lg shadow-amber-500/20'
      : 'bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-500/20',
    secondary: 'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600',
    danger: 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30',
  };

  return (
    <button
      disabled={disabled ?? loading}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
