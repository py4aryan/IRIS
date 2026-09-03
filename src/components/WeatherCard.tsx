import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Sun } from "lucide-react";
import { Card, MiniStat } from "./Card";
import { useWeather } from "../hooks/useWeather";
import type { WeatherCategory } from "../lib/weather";

const ICONS: Record<WeatherCategory, typeof Cloud> = {
  clear: Sun,
  "partly-cloudy": CloudSun,
  overcast: Cloud,
  fog: CloudFog,
  drizzle: CloudRain,
  rain: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
};

export function WeatherCard() {
  const { data, status, refresh } = useWeather();
  const Icon = data ? ICONS[data.category] : CloudSun;

  return (
    <Card icon={<CloudSun size={15} />} title="Weather" onRefresh={refresh}>
      {!data && status === "loading" ? (
        <div className="h-[118px] flex items-center justify-center text-xs text-slate-500">
          Locating…
        </div>
      ) : !data ? (
        <div className="h-[118px] flex items-center justify-center text-center px-4">
          <p className="text-xs text-slate-500">
            Weather isn't available for your timezone yet.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-3xl font-display font-semibold text-amber-glow">
                {Math.round(data.temp)}°C
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {data.city}, {data.country}
              </div>
              <div className="text-xs text-slate-500">{data.label}</div>
            </div>
            <Icon size={40} className="text-amber-glow/50" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <MiniStat label="Humidity" value={`${Math.round(data.humidity)}%`} />
            <MiniStat label="Wind" value={`${data.windSpeed.toFixed(1)} m/s`} />
            <MiniStat label="Feels Like" value={`${Math.round(data.feelsLike)}°C`} />
          </div>
        </>
      )}
    </Card>
  );
}
