import { ReactNode } from 'react';

type Variant = 'green' | 'amber' | 'red' | 'blue' | 'slate';

const styles: Record<Variant, string> = {
  green: 'bg-green-500/20 text-green-400 border-green-500/30',
  amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  red: 'bg-red-500/20 text-red-400 border-red-500/30',
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  slate: 'bg-slate-600/40 text-slate-300 border-slate-600',
};

export default function Badge({ children, variant = 'slate' }: { children: ReactNode; variant?: Variant }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]}`}>
      {children}
    </span>
  );
}
