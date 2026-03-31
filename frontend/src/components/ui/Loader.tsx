import { Loader2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface LoaderProps {
  size?: number;
  fullPage?: boolean;
  label?: string;
}

export default function Loader({ size = 32, fullPage = false, label }: LoaderProps) {
  const { accent } = useTheme();

  const inner = (
    <div className="flex flex-col items-center gap-3">
      <Loader2 size={size} className={`animate-spin ${accent}`} />
      {label && <p className="text-slate-400 text-sm">{label}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        {inner}
      </div>
    );
  }

  return <div className="flex justify-center py-12">{inner}</div>;
}
