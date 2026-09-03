import { useCallback, useEffect, useState } from "react";
import { describeWeatherCode, fetchCurrentWeather, getUserLocation, type WeatherCategory } from "../lib/weather";

export interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  category: WeatherCategory;
  label: string;
}

export type WeatherStatus = "loading" | "ready" | "unavailable";

const REFRESH_MS = 10 * 60 * 1000;

export function useWeather() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [status, setStatus] = useState<WeatherStatus>("loading");

  const load = useCallback(async () => {
    setStatus((prev) => (prev === "ready" ? prev : "loading"));
    const loc = getUserLocation();
    if (!loc) {
      setStatus("unavailable");
      return;
    }
    try {
      const raw = await fetchCurrentWeather(loc.lat, loc.lon);
      const desc = describeWeatherCode(raw.code);
      setData({
        city: loc.city,
        country: loc.country,
        temp: raw.temp,
        feelsLike: raw.feelsLike,
        humidity: raw.humidity,
        windSpeed: raw.windSpeed,
        category: desc.category,
        label: desc.label,
      });
      setStatus("ready");
    } catch {
      setStatus("unavailable");
    }
  }, []);

  useEffect(() => {
    load();
    const id = window.setInterval(load, REFRESH_MS);
    return () => window.clearInterval(id);
  }, [load]);

  return { data, status, refresh: load };
}
