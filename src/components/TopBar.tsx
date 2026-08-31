import { LogOut, Settings } from "lucide-react";
import { IrisMark } from "./IrisMark";

interface TopBarProps {
  onLogout?: () => void;
}

export function TopBar({ onLogout }: TopBarProps) {
  return (
    <header className="flex items-center justify-between px-6 md:px-10 py-5">
      <div className="flex items-center gap-3">
        <IrisMark size={28} />
        <span className="text-base font-display font-semibold tracking-[0.3em] text-slate-100">
          IRIS
        </span>
        <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-300/90 bg-emerald-400/10 rounded-full px-2.5 py-1 ml-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Online
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="w-9 h-9 rounded-full bg-black/20 flex items-center justify-center text-slate-400 hover:text-cyan-glow transition-colors"
          aria-label="Settings"
        >
          <Settings size={15} />
        </button>
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="w-9 h-9 rounded-full bg-black/20 flex items-center justify-center text-slate-400 hover:text-red-300 transition-colors"
            aria-label="Log out"
          >
            <LogOut size={14} />
          </button>
        )}
      </div>
    </header>
  );
}
