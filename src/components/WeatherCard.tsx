import { CloudSun } from "lucide-react";
import { Card, MiniStat } from "./Card";

export function WeatherCard() {
  return (
    <Card icon={<CloudSun size={15} />} title="Weather">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-3xl font-display font-semibold text-amber-glow">25.2°C</div>
          <div className="text-xs text-slate-400 mt-0.5">Quezon City, PH</div>
          <div className="text-xs text-slate-500">overcast clouds</div>
        </div>
        <CloudSun size={40} className="text-amber-glow/50" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <MiniStat label="Humidity" value="94%" />
        <MiniStat label="Wind" value="5.8 m/s" />
        <MiniStat label="Feels Like" value="26.3°C" />
      </div>
    </Card>
  );
}
