import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudRainWind,
  CloudLightning,
  CloudSnow,
  CloudFog,
  CloudDrizzle,
  CloudHail,
  Snowflake,
  SunMedium,
  Droplets,
  Wind,
  Compass,
  Gauge,
  Eye,
  Sunset,
  Sunrise,
  Clock,
  Calendar,
  Sparkles,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  getWeatherCondition,
  formatTemperature,
  formatWindSpeed,
  getWindDirectionLabel,
} from '../utils/weatherCodes';

// Icon Map
const ICON_COMPONENTS = {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudRainWind,
  CloudLightning,
  CloudSnow,
  CloudFog,
  CloudDrizzle,
  CloudHail,
  Snowflake,
  SunMedium,
};

export default function CurrentWeatherCard({ weather, city, units }) {
  const [liveTime, setLiveTime] = useState(new Date());

  // Live ticking clock updated every second
  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!weather || !weather.current) return null;

  const { current, daily, timezone } = weather;
  const condition = getWeatherCondition(current.weather_code, current.is_day);
  const IconComponent = ICON_COMPONENTS[condition.iconName] || Cloud;

  const maxTemp = daily?.temperature_2m_max?.[0];
  const minTemp = daily?.temperature_2m_min?.[0];
  const sunriseTime = daily?.sunrise?.[0]
    ? new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: units.timeFormat === '12h', ...(timezone ? { timeZone: timezone } : {}) })
    : '--';
  const sunsetTime = daily?.sunset?.[0]
    ? new Date(daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: units.timeFormat === '12h', ...(timezone ? { timeZone: timezone } : {}) })
    : '--';
  const daylightHours = daily?.daylight_duration?.[0] ? (daily.daylight_duration[0] / 3600).toFixed(1) : null;

  // Format the city's exact local time according to its Open-Meteo timezone
  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: units.timeFormat === '12h',
    ...(timezone ? { timeZone: timezone } : {}),
  };

  const dateOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...(timezone ? { timeZone: timezone } : {}),
  };

  const formattedLocalTime = liveTime.toLocaleTimeString([], timeOptions);
  const formattedLocalDate = liveTime.toLocaleDateString([], dateOptions);

  return (
    <div className="weather-card p-4 sm:p-6 md:p-8">
      {/* 1. Header: Location, Status Badge, Live Clock */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-5 sm:pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm break-words">
              {city?.name || 'Selected City'}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/25 text-[11px] sm:text-xs font-semibold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Real API Data
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {city?.admin1 ? `${city.admin1}, ` : ''}{city?.country || ''}
          </p>
        </div>

        {/* Live Local Clock and Timezone */}
        <div className="flex items-center gap-2 self-start md:self-auto w-full sm:w-auto">
          <div className="flex items-center gap-2.5 px-3 sm:px-4 py-2 rounded-2xl bg-slate-900/70 border border-cyan-500/20 shadow-sm w-full sm:w-auto">
            <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 shrink-0">
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm sm:text-base md:text-lg font-bold font-mono text-white tracking-wide tabular-nums">
                  {formattedLocalTime.toUpperCase()}
                </span>
                {weather.timezone_abbreviation && (
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-400/15 text-cyan-300 font-mono">
                    {weather.timezone_abbreviation}
                  </span>
                )}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5 flex-wrap">
                <Calendar className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>{formattedLocalDate}</span>
                <span className="text-slate-600 hidden xs:inline">•</span>
                <span className="hidden xs:inline">Sync: {weather.lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hero Section: Weather Icon, Giant Temperature, Condition, and Sun Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 py-5 sm:py-6 border-b border-white/[0.08] items-center">
        {/* Left: Giant Temp & Condition */}
        <div className="lg:col-span-7 flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="p-3 sm:p-4 rounded-3xl bg-slate-800/50 border border-white/10 shrink-0 shadow-inner">
            <IconComponent className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.35)]" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold tracking-tight gradient-text-temperature drop-shadow-md tabular-nums">
                {formatTemperature(current.temperature_2m, units.temperatureUnit)}
              </span>
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-semibold text-cyan-200 mt-0.5 sm:mt-1 capitalize tracking-tight">
              {condition.description}
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300 mt-1">
              <span>Feels like <strong className="text-white font-semibold tabular-nums">{formatTemperature(current.apparent_temperature, units.temperatureUnit)}</strong></span>
              {maxTemp !== undefined && minTemp !== undefined && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1">
                    <ArrowUp className="w-3.5 h-3.5 text-rose-400" />
                    <span>{formatTemperature(maxTemp, units.temperatureUnit)}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <ArrowDown className="w-3.5 h-3.5 text-blue-400" />
                    <span>{formatTemperature(minTemp, units.temperatureUnit)}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Clean Sunrise & Sunset Panel */}
        <div className="lg:col-span-5 grid grid-cols-3 gap-2 sm:gap-3 weather-subcard p-3 sm:p-4 rounded-2xl">
          <div className="flex flex-col items-center text-center justify-center p-1.5 sm:p-2 rounded-xl bg-white/[0.02]">
            <Sunrise className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mb-1" />
            <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Sunrise</div>
            <div className="text-xs sm:text-sm font-bold text-white mt-0.5 tabular-nums">{sunriseTime}</div>
          </div>
          <div className="flex flex-col items-center text-center justify-center p-1.5 sm:p-2 rounded-xl bg-white/[0.02]">
            <Sunset className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 mb-1" />
            <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Sunset</div>
            <div className="text-xs sm:text-sm font-bold text-white mt-0.5 tabular-nums">{sunsetTime}</div>
          </div>
          <div className="flex flex-col items-center text-center justify-center p-1.5 sm:p-2 rounded-xl bg-white/[0.02]">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 mb-1" />
            <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Daylight</div>
            <div className="text-xs sm:text-sm font-bold text-cyan-300 mt-0.5 tabular-nums">{daylightHours ? `${daylightHours}h` : '--'}</div>
          </div>
        </div>
      </div>

      {/* 3. Standardized Weather Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5 pt-5 sm:pt-6">
        {/* Humidity */}
        <div className="weather-subcard p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Humidity</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">
            {current.relative_humidity_2m}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {current.relative_humidity_2m > 70 ? 'High moisture' : current.relative_humidity_2m < 30 ? 'Dry air' : 'Comfortable'}
          </div>
          <div className="metric-bar mt-2">
            <div className="metric-bar-fill bg-gradient-to-r from-cyan-600 to-cyan-400" style={{ width: `${current.relative_humidity_2m}%` }} />
          </div>
        </div>

        {/* Wind */}
        <div className="weather-subcard p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Wind</span>
            <Wind className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">
            {formatWindSpeed(current.wind_speed_10m, units.windSpeedUnit)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <Compass className="w-3 h-3 text-slate-400" />
            <span>{getWindDirectionLabel(current.wind_direction_10m)} ({current.wind_direction_10m}°)</span>
          </div>
        </div>

        {/* UV Index */}
        <div className="weather-subcard p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>UV Index</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">
            {current.uv_index !== undefined ? current.uv_index.toFixed(1) : '--'}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {current.uv_index >= 8 ? 'Very High' : current.uv_index >= 6 ? 'High' : current.uv_index >= 3 ? 'Moderate' : 'Low'}
          </div>
          <div className="metric-bar mt-2">
            <div
              className="metric-bar-fill"
              style={{
                width: `${Math.min(100, (current.uv_index || 0) / 11 * 100)}%`,
                background: (current.uv_index || 0) >= 8 ? 'linear-gradient(90deg, #f97316, #ef4444)' :
                            (current.uv_index || 0) >= 3 ? 'linear-gradient(90deg, #fbbf24, #f97316)' :
                            'linear-gradient(90deg, #34d399, #22d3ee)',
              }}
            />
          </div>
        </div>

        {/* Pressure */}
        <div className="weather-subcard p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Pressure</span>
            <Gauge className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">
            {Math.round(current.surface_pressure)} <span className="text-xs font-normal text-slate-400">hPa</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {current.surface_pressure > 1013 ? 'High pressure' : 'Normal / Low'}
          </div>
        </div>

        {/* Cloud Cover */}
        <div className="weather-subcard p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Cloud Cover</span>
            <Cloud className="w-4 h-4 text-sky-300" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">
            {current.cloud_cover}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {current.cloud_cover > 75 ? 'Dense cover' : current.cloud_cover > 25 ? 'Scattered' : 'Clear sky'}
          </div>
          <div className="metric-bar mt-2">
            <div className="metric-bar-fill bg-gradient-to-r from-sky-700 to-sky-400" style={{ width: `${current.cloud_cover}%` }} />
          </div>
        </div>

        {/* Visibility */}
        <div className="weather-subcard p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Visibility</span>
            <Eye className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">
            {current.visibility ? `${(current.visibility / 1000).toFixed(0)}` : '>10'} <span className="text-xs font-normal text-slate-400">km</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {current.visibility && current.visibility < 3000 ? 'Poor / Foggy' : 'Clear vision'}
          </div>
        </div>
      </div>
    </div>
  );
}
