import { useCallback, useEffect, useState } from "react";
import {
  describeWeatherCode,
  fetchCurrentWeather,
  getBrowserLocation,
  getUserLocation,
  reverseGeocode,
  type WeatherCategory,
} from "../lib/weather";

export interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  category: WeatherCategory;
  label: string;
  precise: boolean;
}

export type WeatherStatus = "loading" | "ready" | "unavailable";

const REFRESH_MS = 10 * 60 * 1000;

export function useWeather() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [status, setStatus] = useState<WeatherStatus>("loading");

  const load = useCallback(async () => {
    setStatus((prev) => (prev === "ready" ? prev : "loading"));

    // Prefer the nearest possible fix via real geolocation + reverse
    // geocoding; fall back to the timezone approximation if denied,
    // unsupported, or either request fails.
    try {
      const pos = await getBrowserLocation();
      const { latitude: lat, longitude: lon } = pos.coords;
      const [place, raw] = await Promise.all([
        reverseGeocode(lat, lon).catch(() => null),
        fetchCurrentWeather(lat, lon),
      ]);
      const desc = describeWeatherCode(raw.code);
      setData({
        city: place?.city ?? "Your location",
        country: place?.region ?? "",
        temp: raw.temp,
        feelsLike: raw.feelsLike,
        humidity: raw.humidity,
        windSpeed: raw.windSpeed,
        category: desc.category,
        label: desc.label,
        precise: true,
      });
      setStatus("ready");
      return;
    } catch {
      // fall through to the timezone-based approximation below
    }

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
        precise: false,
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
