import { useEffect, useState } from "react";
import { LogOut, Settings, Thermometer } from "lucide-react";
import { IrisMark } from "./IrisMark";

interface TopBarProps {
  userName?: string;
  onLogout?: () => void;
}

export function TopBar({ userName, onLogout }: TopBarProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const date = now.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-cyan-glow/10 bg-black/20 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <IrisMark size={30} />
        <span className="text-lg font-display font-semibold tracking-[0.3em] text-slate-100">
          IRIS
        </span>
        <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-300/90 border border-emerald-400/25 bg-emerald-400/5 rounded-full px-2.5 py-1 ml-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Online
        </span>
      </div>

      <div className="hidden md:flex items-center gap-2 text-slate-300 text-sm tabular-nums font-display">
        <span className="text-cyan-glow/80">{time}</span>
        <span className="text-slate-500">|</span>
        <span className="text-slate-400">{date}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:flex items-center gap-1.5 text-sm text-slate-300">
          <Thermometer size={14} className="text-amber-glow/80" />
          <span className="font-display">25.2°C</span> <span className="text-slate-500">Quezon City</span>
        </span>
        {userName && (
          <span className="hidden lg:inline text-sm text-slate-400">
            Hi, <span className="text-slate-200">{userName}</span>
          </span>
        )}
        <button
          type="button"
          className="w-8 h-8 rounded-full border border-cyan-glow/20 flex items-center justify-center text-slate-400 hover:text-cyan-glow hover:border-cyan-glow/40 transition-colors"
          aria-label="Settings"
        >
          <Settings size={15} />
        </button>
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="w-8 h-8 rounded-full border border-cyan-glow/20 flex items-center justify-center text-slate-400 hover:text-red-300 hover:border-red-400/40 transition-colors"
            aria-label="Log out"
          >
            <LogOut size={14} />
          </button>
        )}
      </div>
    </header>
  );
}
