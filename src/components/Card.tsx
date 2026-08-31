import type { ReactNode } from "react";
import { RefreshCw } from "lucide-react";

interface CardProps {
  icon: ReactNode;
  title: string;
  onRefresh?: () => void;
  children: ReactNode;
  className?: string;
}

export function Card({ icon, title, onRefresh, children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-3xl bg-iris-800/60 backdrop-blur-md px-5 py-4 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.75)] ${className}`}
    >
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2 text-slate-300 text-[13px] font-medium tracking-wide">
          <span className="text-cyan-glow/80">{icon}</span>
          {title}
        </div>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="text-slate-600 hover:text-cyan-glow transition-colors"
            aria-label={`Refresh ${title}`}
          >
            <RefreshCw size={13} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-black/20 px-2.5 py-2.5 text-center">
      <div className="text-[10px] text-slate-500 tracking-wide">{label}</div>
      <div className="text-sm text-slate-100 font-medium tabular-nums font-display">{value}</div>
    </div>
  );
}

export function Meter({ value, color = "bg-cyan-glow" }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-black/25 overflow-hidden">
      <div
        className={`h-full rounded-full ${color} transition-[width] duration-700 ease-out`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
