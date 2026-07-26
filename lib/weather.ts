"use client";

import { useEffect, useState } from "react";
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  type LucideIcon,
} from "lucide-react";

export type Weather = {
  tempC: number;
  condition: string;
  city: string;
  isDay: boolean;
  Icon: LucideIcon;
  loading: boolean;
  error: boolean;
};

// Default location (Hyderabad) so something renders instantly before geolocation.
const DEFAULT = { lat: 17.385, lon: 78.4867, city: "Hyderabad" };

/** Map a WMO weather code to a label + day/night icon. */
function describe(code: number, isDay: boolean): { condition: string; Icon: LucideIcon } {
  const clearIcon = isDay ? Sun : Moon;
  const partlyIcon = isDay ? CloudSun : CloudMoon;
  if (code === 0) return { condition: "Clear", Icon: clearIcon };
  if (code <= 2) return { condition: "Partly cloudy", Icon: partlyIcon };
  if (code === 3) return { condition: "Overcast", Icon: Cloud };
  if (code <= 48) return { condition: "Fog", Icon: CloudFog };
  if (code <= 57) return { condition: "Drizzle", Icon: CloudDrizzle };
  if (code <= 67) return { condition: "Rain", Icon: CloudRain };
  if (code <= 77) return { condition: "Snow", Icon: CloudSnow };
  if (code <= 82) return { condition: "Showers", Icon: CloudRain };
  if (code <= 86) return { condition: "Snow showers", Icon: CloudSnow };
  return { condition: "Thunderstorm", Icon: CloudLightning };
}

async function reverseCity(lat: number, lon: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
    );
    if (!res.ok) return null;
    const d = await res.json();
    return d.city || d.locality || d.principalSubdivision || null;
  } catch {
    return null;
  }
}

async function fetchWeather(lat: number, lon: number) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&timezone=auto`,
  );
  if (!res.ok) throw new Error("weather fetch failed");
  const d = await res.json();
  return {
    tempC: Math.round(d.current.temperature_2m),
    code: d.current.weather_code as number,
    isDay: d.current.is_day === 1,
  };
}

export function useWeather(): Weather {
  const [state, setState] = useState<Weather>({
    tempC: 0,
    condition: "…",
    city: DEFAULT.city,
    isDay: true,
    Icon: CloudSun,
    loading: true,
    error: false,
  });

  useEffect(() => {
    let cancelled = false;

    const load = async (lat: number, lon: number, city: string) => {
      try {
        const w = await fetchWeather(lat, lon);
        if (cancelled) return;
        const { condition, Icon } = describe(w.code, w.isDay);
        setState({ tempC: w.tempC, condition, city, isDay: w.isDay, Icon, loading: false, error: false });
      } catch {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: true }));
      }
    };

    // instant default, then refine with geolocation
    load(DEFAULT.lat, DEFAULT.lon, DEFAULT.city);

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const city = (await reverseCity(latitude, longitude)) ?? "Your location";
          if (!cancelled) load(latitude, longitude, city);
        },
        () => {},
        { timeout: 8000, maximumAge: 600000 },
      );
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
