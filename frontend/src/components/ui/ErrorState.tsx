import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = 'Ocorreu um erro inesperado.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-8 rounded-2xl border border-red-500/20 bg-red-500/5">
      <AlertCircle size={40} className="text-red-400 mb-3" />
      <p className="text-red-300 font-semibold mb-1">Algo deu errado</p>
      <p className="text-slate-400 text-sm max-w-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
        >
          <RefreshCw size={14} />
          Tentar novamente
        </button>
      )}
    </div>
  );
}
