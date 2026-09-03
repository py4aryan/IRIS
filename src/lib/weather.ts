export type WeatherCategory =
  | "clear"
  | "partly-cloudy"
  | "overcast"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm";

interface Location {
  city: string;
  country: string;
  lat: number;
  lon: number;
}

// Timezone -> a representative city, so weather is grounded to roughly
// where the user actually is without asking for precise GPS permission.
const TIMEZONE_LOCATIONS: Record<string, Location> = {
  "America/New_York": { city: "New York", country: "US", lat: 40.71, lon: -74.01 },
  "America/Chicago": { city: "Chicago", country: "US", lat: 41.88, lon: -87.63 },
  "America/Denver": { city: "Denver", country: "US", lat: 39.74, lon: -104.99 },
  "America/Los_Angeles": { city: "Los Angeles", country: "US", lat: 34.05, lon: -118.24 },
  "America/Anchorage": { city: "Anchorage", country: "US", lat: 61.22, lon: -149.9 },
  "Pacific/Honolulu": { city: "Honolulu", country: "US", lat: 21.31, lon: -157.86 },
  "America/Toronto": { city: "Toronto", country: "CA", lat: 43.65, lon: -79.38 },
  "America/Vancouver": { city: "Vancouver", country: "CA", lat: 49.28, lon: -123.12 },
  "America/Mexico_City": { city: "Mexico City", country: "MX", lat: 19.43, lon: -99.13 },
  "America/Sao_Paulo": { city: "São Paulo", country: "BR", lat: -23.55, lon: -46.63 },
  "America/Argentina/Buenos_Aires": { city: "Buenos Aires", country: "AR", lat: -34.6, lon: -58.38 },
  "America/Bogota": { city: "Bogotá", country: "CO", lat: 4.71, lon: -74.07 },
  "America/Lima": { city: "Lima", country: "PE", lat: -12.05, lon: -77.04 },
  "America/Santiago": { city: "Santiago", country: "CL", lat: -33.45, lon: -70.65 },
  "Europe/London": { city: "London", country: "GB", lat: 51.51, lon: -0.13 },
  "Europe/Dublin": { city: "Dublin", country: "IE", lat: 53.35, lon: -6.26 },
  "Europe/Paris": { city: "Paris", country: "FR", lat: 48.85, lon: 2.35 },
  "Europe/Berlin": { city: "Berlin", country: "DE", lat: 52.52, lon: 13.4 },
  "Europe/Madrid": { city: "Madrid", country: "ES", lat: 40.42, lon: -3.7 },
  "Europe/Rome": { city: "Rome", country: "IT", lat: 41.9, lon: 12.5 },
  "Europe/Amsterdam": { city: "Amsterdam", country: "NL", lat: 52.37, lon: 4.9 },
  "Europe/Lisbon": { city: "Lisbon", country: "PT", lat: 38.72, lon: -9.14 },
  "Europe/Zurich": { city: "Zurich", country: "CH", lat: 47.38, lon: 8.54 },
  "Europe/Stockholm": { city: "Stockholm", country: "SE", lat: 59.33, lon: 18.07 },
  "Europe/Warsaw": { city: "Warsaw", country: "PL", lat: 52.23, lon: 21.01 },
  "Europe/Athens": { city: "Athens", country: "GR", lat: 37.98, lon: 23.73 },
  "Europe/Istanbul": { city: "Istanbul", country: "TR", lat: 41.01, lon: 28.98 },
  "Europe/Moscow": { city: "Moscow", country: "RU", lat: 55.76, lon: 37.62 },
  "Africa/Cairo": { city: "Cairo", country: "EG", lat: 30.04, lon: 31.24 },
  "Africa/Lagos": { city: "Lagos", country: "NG", lat: 6.52, lon: 3.38 },
  "Africa/Johannesburg": { city: "Johannesburg", country: "ZA", lat: -26.2, lon: 28.05 },
  "Africa/Nairobi": { city: "Nairobi", country: "KE", lat: -1.29, lon: 36.82 },
  "Africa/Casablanca": { city: "Casablanca", country: "MA", lat: 33.57, lon: -7.59 },
  "Asia/Manila": { city: "Quezon City", country: "PH", lat: 14.65, lon: 121.03 },
  "Asia/Tokyo": { city: "Tokyo", country: "JP", lat: 35.68, lon: 139.65 },
  "Asia/Shanghai": { city: "Shanghai", country: "CN", lat: 31.23, lon: 121.47 },
  "Asia/Hong_Kong": { city: "Hong Kong", country: "HK", lat: 22.32, lon: 114.17 },
  "Asia/Singapore": { city: "Singapore", country: "SG", lat: 1.35, lon: 103.82 },
  "Asia/Seoul": { city: "Seoul", country: "KR", lat: 37.57, lon: 126.98 },
  "Asia/Kolkata": { city: "Mumbai", country: "IN", lat: 19.08, lon: 72.88 },
  "Asia/Bangkok": { city: "Bangkok", country: "TH", lat: 13.76, lon: 100.5 },
  "Asia/Jakarta": { city: "Jakarta", country: "ID", lat: -6.21, lon: 106.85 },
  "Asia/Dubai": { city: "Dubai", country: "AE", lat: 25.2, lon: 55.27 },
  "Asia/Karachi": { city: "Karachi", country: "PK", lat: 24.86, lon: 67.01 },
  "Asia/Dhaka": { city: "Dhaka", country: "BD", lat: 23.81, lon: 90.41 },
  "Asia/Ho_Chi_Minh": { city: "Ho Chi Minh City", country: "VN", lat: 10.82, lon: 106.63 },
  "Asia/Kuala_Lumpur": { city: "Kuala Lumpur", country: "MY", lat: 3.14, lon: 101.69 },
  "Asia/Taipei": { city: "Taipei", country: "TW", lat: 25.03, lon: 121.57 },
  "Asia/Jerusalem": { city: "Jerusalem", country: "IL", lat: 31.77, lon: 35.21 },
  "Asia/Riyadh": { city: "Riyadh", country: "SA", lat: 24.71, lon: 46.68 },
  "Australia/Sydney": { city: "Sydney", country: "AU", lat: -33.87, lon: 151.21 },
  "Australia/Melbourne": { city: "Melbourne", country: "AU", lat: -37.81, lon: 144.96 },
  "Australia/Perth": { city: "Perth", country: "AU", lat: -31.95, lon: 115.86 },
  "Australia/Brisbane": { city: "Brisbane", country: "AU", lat: -27.47, lon: 153.03 },
  "Pacific/Auckland": { city: "Auckland", country: "NZ", lat: -36.85, lon: 174.76 },
};

/** Best-effort location from the browser's IANA timezone — no location permission needed. */
export function getUserLocation(): Location | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TIMEZONE_LOCATIONS[tz] ?? null;
  } catch {
    return null;
  }
}

const CODE_MAP: Record<number, { category: WeatherCategory; label: string }> = {
  0: { category: "clear", label: "clear sky" },
  1: { category: "partly-cloudy", label: "mostly clear" },
  2: { category: "partly-cloudy", label: "partly cloudy" },
  3: { category: "overcast", label: "overcast clouds" },
  45: { category: "fog", label: "fog" },
  48: { category: "fog", label: "depositing rime fog" },
  51: { category: "drizzle", label: "light drizzle" },
  53: { category: "drizzle", label: "drizzle" },
  55: { category: "drizzle", label: "dense drizzle" },
  56: { category: "drizzle", label: "freezing drizzle" },
  57: { category: "drizzle", label: "dense freezing drizzle" },
  61: { category: "rain", label: "light rain" },
  63: { category: "rain", label: "rain" },
  65: { category: "rain", label: "heavy rain" },
  66: { category: "rain", label: "freezing rain" },
  67: { category: "rain", label: "heavy freezing rain" },
  71: { category: "snow", label: "light snow" },
  73: { category: "snow", label: "snow" },
  75: { category: "snow", label: "heavy snow" },
  77: { category: "snow", label: "snow grains" },
  80: { category: "rain", label: "light showers" },
  81: { category: "rain", label: "showers" },
  82: { category: "rain", label: "violent showers" },
  85: { category: "snow", label: "snow showers" },
  86: { category: "snow", label: "heavy snow showers" },
  95: { category: "storm", label: "thunderstorm" },
  96: { category: "storm", label: "thunderstorm with hail" },
  99: { category: "storm", label: "severe thunderstorm" },
};

export function describeWeatherCode(code: number) {
  return CODE_MAP[code] ?? { category: "overcast" as const, label: "overcast clouds" };
}

export interface RawWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  code: number;
}

export async function fetchCurrentWeather(lat: number, lon: number): Promise<RawWeather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&temperature_unit=celsius&wind_speed_unit=ms`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather request failed (${res.status})`);
  const data = await res.json();
  const c = data.current;
  return {
    temp: c.temperature_2m,
    feelsLike: c.apparent_temperature,
    humidity: c.relative_humidity_2m,
    windSpeed: c.wind_speed_10m,
    code: c.weather_code,
  };
}
