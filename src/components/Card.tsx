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
      className={`rounded-xl border border-cyan-glow/12 bg-iris-800/50 backdrop-blur-sm px-4 py-3.5 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-slate-200 text-sm font-medium">
          <span className="text-cyan-glow">{icon}</span>
          {title}
        </div>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="text-slate-500 hover:text-cyan-glow transition-colors"
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
    <div className="rounded-lg bg-black/25 border border-cyan-glow/10 px-2.5 py-2 text-center">
      <div className="text-[10px] text-slate-500 tracking-wide">{label}</div>
      <div className="text-sm text-slate-100 font-medium tabular-nums">{value}</div>
    </div>
  );
}

export function Meter({ value, color = "bg-cyan-glow" }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-black/30 overflow-hidden">
      <div
        className={`h-full rounded-full ${color} transition-[width] duration-700 ease-out`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
