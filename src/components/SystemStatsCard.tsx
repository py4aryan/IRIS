import { useEffect, useState } from "react";
import { Cpu } from "lucide-react";
import { Card, MiniStat, Meter } from "./Card";

export function SystemStatsCard() {
  const [cpu, setCpu] = useState(8);
  const [ram, setRam] = useState(44);
  const disk = { used: 439, total: 475 };

  const roll = () => {
    setCpu(Math.max(3, Math.min(92, Math.round(cpu + (Math.random() - 0.5) * 20))));
    setRam(Math.max(20, Math.min(85, Math.round(ram + (Math.random() - 0.5) * 10))));
  };

  useEffect(() => {
    const id = window.setInterval(roll, 3000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cpu, ram]);

  return (
    <Card icon={<Cpu size={15} />} title="System Stats" onRefresh={roll}>
      <div className="space-y-3 mb-3">
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>CPU Usage</span>
            <span className="text-slate-200">{cpu}%</span>
          </div>
          <Meter value={cpu} />
        </div>
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>RAM Usage</span>
            <span className="text-slate-200">{(ram / 100 * 16).toFixed(0)} GB</span>
          </div>
          <Meter value={ram} color="bg-blue-glow" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <MiniStat label="CPU" value={`${cpu}%`} />
        <MiniStat label="Memory" value={`${ram}%`} />
        <MiniStat label="Disk" value={`${disk.used}/${disk.total} GB`} />
      </div>
    </Card>
  );
}
