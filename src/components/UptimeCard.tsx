import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { Card, MiniStat, Meter } from "./Card";

function formatUptime(seconds: number) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

interface UptimeCardProps {
  commandCount: number;
}

export function UptimeCard({ commandCount }: UptimeCardProps) {
  const [seconds, setSeconds] = useState(0);
  const [load, setLoad] = useState(26);

  useEffect(() => {
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setLoad((l) => Math.max(8, Math.min(85, Math.round(l + (Math.random() - 0.5) * 14))));
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

  const loadLabel = load < 35 ? "Low" : load < 65 ? "Moderate" : "High";
  const loadColor = load < 35 ? "bg-emerald-400" : load < 65 ? "bg-amber-400" : "bg-red-400";

  return (
    <Card icon={<Info size={15} />} title="System Uptime">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
        <span>System Running For:</span>
        <span className="text-slate-200 tabular-nums">{formatUptime(seconds)}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <MiniStat label="Session" value="1" />
        <MiniStat label="Commands" value={String(commandCount)} />
      </div>
      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>System Load</span>
          <span className="text-slate-200">{loadLabel} · {load}%</span>
        </div>
        <Meter value={load} color={loadColor} />
      </div>
    </Card>
  );
}
