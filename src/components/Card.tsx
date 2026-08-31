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
      className={`panel-cut relative border border-cyan-glow/15 bg-iris-800/50 backdrop-blur-sm px-4 py-3.5 shadow-[0_0_0_1px_rgba(94,200,255,0.03),0_8px_24px_-12px_rgba(0,0,0,0.6)] ${className}`}
    >
      {/* cut-corner accent line */}
      <span className="absolute top-0 right-0 w-[18px] h-[18px] border-r border-t border-amber-glow/50" style={{ clipPath: "polygon(100% 0, 100% 100%, 0 0)" }} />
      {/* corner ticks on the sharp corners */}
      <span className="absolute -top-px -left-px w-3 h-3 border-t border-l border-cyan-glow/50" />
      <span className="absolute -bottom-px -left-px w-3 h-3 border-b border-l border-cyan-glow/50" />
      <span className="absolute -bottom-px -right-px w-3 h-3 border-b border-r border-cyan-glow/50" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-slate-200 text-sm font-medium tracking-wide font-display">
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
    <div className="bg-black/25 border border-cyan-glow/10 px-2.5 py-2 text-center">
      <div className="text-[10px] text-slate-500 tracking-wide">{label}</div>
      <div className="text-sm text-slate-100 font-medium tabular-nums font-display">{value}</div>
    </div>
  );
}

export function Meter({ value, color = "bg-cyan-glow" }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 w-full bg-black/30 overflow-hidden">
      <div
        className={`h-full ${color} transition-[width] duration-700 ease-out shadow-[0_0_8px_currentColor]`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
