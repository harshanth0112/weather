import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  CloudDrizzle,
  ChevronDown,
  ChevronUp,
  Droplets,
  Wind,
  Calendar,
  Clock,
} from 'lucide-react';
import {
  getWeatherCondition,
  formatTemperature,
  formatPrecipitation,
  formatWindSpeed,
  getHourlyGradient,
} from '../utils/weatherCodes';
import { getWeatherIconComponent } from './WeatherIcons';

const ICON_MAP = {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  CloudDrizzle,
};

export default function ForecastSection({ weather, units }) {
  const [activeTab, setActiveTab] = useState('hourly'); // 'hourly' or 'daily'
  const [expandedDay, setExpandedDay] = useState(null);

  if (!weather || !weather.hourly || !weather.daily) return null;

  const { hourly, daily } = weather;

  // Prepare hourly data (next 24 hours)
  const hourlyData = [];
  const limit = Math.min(24, hourly.time.length);

  for (let i = 0; i < limit; i++) {
    const timeStr = hourly.time[i];
    const date = new Date(timeStr);
    const hourLabel = date.toLocaleTimeString([], { hour: 'numeric', hour12: units.timeFormat === '12h' });
    const cond = getWeatherCondition(hourly.weather_code[i], hourly.is_day[i]);
    const temp = units.temperatureUnit === 'fahrenheit' 
      ? Math.round((hourly.temperature_2m[i] * 9) / 5 + 32)
      : Math.round(hourly.temperature_2m[i]);

    hourlyData.push({
      time: hourLabel,
      temp,
      rawTemp: hourly.temperature_2m[i],
      pop: hourly.precipitation_probability[i] || 0,
      precip: hourly.precipitation[i] || 0,
      code: hourly.weather_code[i],
      isDay: hourly.is_day[i],
      condition: cond,
      wind: hourly.wind_speed_10m[i],
    });
  }

  // Prepare 7-day data
  const dailyData = [];
  const daysLimit = Math.min(7, daily.time.length);

  // Compute week-wide temp range for relative bar positioning
  const weekMinTemp = Math.min(...daily.temperature_2m_min.slice(0, daysLimit));
  const weekMaxTemp = Math.max(...daily.temperature_2m_max.slice(0, daysLimit));
  const weekRange = weekMaxTemp - weekMinTemp || 1;

  for (let i = 0; i < daysLimit; i++) {
    const dateObj = new Date(daily.time[i]);
    const dayName = i === 0 ? 'Today' : dateObj.toLocaleDateString([], { weekday: 'short' });
    const fullDate = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const cond = getWeatherCondition(daily.weather_code[i], 1);

    const barLeft = ((daily.temperature_2m_min[i] - weekMinTemp) / weekRange) * 100;
    const barWidth = ((daily.temperature_2m_max[i] - daily.temperature_2m_min[i]) / weekRange) * 100;

    dailyData.push({
      index: i,
      dayName,
      fullDate,
      code: daily.weather_code[i],
      condition: cond,
      maxTemp: daily.temperature_2m_max[i],
      minTemp: daily.temperature_2m_min[i],
      pop: daily.precipitation_probability_max[i] || 0,
      precipSum: daily.precipitation_sum[i] || 0,
      windMax: daily.wind_speed_10m_max[i],
      uvMax: daily.uv_index_max?.[i],
      sunrise: daily.sunrise?.[i] ? new Date(daily.sunrise[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--',
      sunset: daily.sunset?.[i] ? new Date(daily.sunset[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--',
      barLeft,
      barWidth,
    });
  }

  return (
    <div className="weather-card p-4 sm:p-6 md:p-8">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Forecast & Trends
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Real Open-Meteo multi-model high-resolution numerical forecast
          </p>
        </div>

        <div className="inline-flex items-center gap-1 p-1 rounded-xl weather-subcard self-stretch sm:self-auto justify-center" role="group" aria-label="Forecast timeframe selection">
          <button
            onClick={() => setActiveTab('hourly')}
            aria-pressed={activeTab === 'hourly'}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'hourly'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Hourly (24h)</span>
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            aria-pressed={activeTab === 'daily'}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'daily'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            <span>7-Day Extended</span>
          </button>
        </div>
      </div>

      {/* Hourly View */}
      {activeTab === 'hourly' && (
        <div className="space-y-5 sm:space-y-6">
          {/* Temperature Chart Preview */}
          <div className="p-3 sm:p-4 rounded-2xl weather-subcard">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
              <span className="font-semibold text-slate-200">24-Hour Temperature Trajectory</span>
              <span className="text-cyan-400 font-mono text-[11px] font-semibold tabular-nums">• Unit: {units.temperatureUnit === 'fahrenheit' ? '°F' : '°C'}</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="glass-panel p-2.5 rounded-xl text-xs border border-white/20 shadow-lg text-white">
                            <div className="font-bold text-cyan-400">{data.time}</div>
                            <div className="tabular-nums">Temp: {formatTemperature(data.rawTemp, units.temperatureUnit)}</div>
                            <div className="tabular-nums">Precip Chance: {data.pop}%</div>
                            <div className="tabular-nums">Wind: {formatWindSpeed(data.wind, units.windSpeedUnit)}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="temp"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#tempGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Horizontal Hourly Cards Carousel with SVG Icons & Coordinated Gradients */}
          <div className="flex gap-3 overflow-x-auto pb-3 pt-1 snap-x scrollbar-thin">
            {hourlyData.map((item, index) => {
              const SvgIcon = getWeatherIconComponent(item.code, item.isDay);
              const cardGradientClass = getHourlyGradient(item.code, item.isDay, units.theme || 'dark');

              return (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-between p-3.5 min-w-[96px] rounded-2xl border snap-start shrink-0 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 ${cardGradientClass}`}
                >
                  <span className="text-xs font-bold text-slate-200 font-mono tabular-nums tracking-tight">
                    {item.time}
                  </span>

                  {/* High Quality Vector SVG Weather Illustration */}
                  <div className="my-2.5 p-1 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                    <SvgIcon className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-md" />
                  </div>

                  <span className="text-sm sm:text-base font-extrabold text-white font-mono tabular-nums">
                    {formatTemperature(item.rawTemp, units.temperatureUnit)}
                  </span>

                  <div className="flex items-center gap-1 text-[11px] text-cyan-300 mt-1 font-semibold tabular-nums">
                    <Droplets className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span>{item.pop}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7-Day Extended View */}
      {activeTab === 'daily' && (
        <div className="space-y-2.5">
          {dailyData.map((day) => {
            const SvgIcon = getWeatherIconComponent(day.code, 1);
            const isExpanded = expandedDay === day.index;

            return (
              <div
                key={day.index}
                className="weather-subcard overflow-hidden"
              >
                <div
                  onClick={() => setExpandedDay(isExpanded ? null : day.index)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
                >
                  <div className="w-28">
                    <div className="font-bold text-white text-sm md:text-base">{day.dayName}</div>
                    <div className="text-xs text-slate-400">{day.fullDate}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-xl bg-black/10 dark:bg-slate-800/40 flex items-center justify-center">
                      <SvgIcon className="w-6 h-6 drop-shadow-sm" />
                    </div>
                    <span className="text-xs md:text-sm text-slate-200 hidden sm:inline w-36 truncate font-medium">
                      {day.condition.description}
                    </span>
                  </div>

                  {/* Precipitation indicator */}
                  <div className="flex items-center gap-1.5 w-16 text-xs text-cyan-300 font-medium">
                    <Droplets className="w-3.5 h-3.5" />
                    <span>{day.pop}%</span>
                  </div>

                  {/* High and Low temps + Range Bar */}
                  <div className="flex flex-col gap-1 items-end w-32 md:w-40">
                    <div className="flex items-center gap-2 text-xs md:text-sm font-mono font-semibold">
                      <span className="text-blue-300 text-xs">{formatTemperature(day.minTemp, units.temperatureUnit)}</span>
                      <div className="relative w-16 md:w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="absolute top-0 h-full rounded-full"
                          style={{
                            left: `${day.barLeft}%`,
                            width: `${Math.max(day.barWidth, 8)}%`,
                            background: 'linear-gradient(90deg, #60a5fa, #f97316)',
                          }}
                        />
                      </div>
                      <span className="text-orange-300 font-bold">
                        {formatTemperature(day.maxTemp, units.temperatureUnit)}
                      </span>
                    </div>
                  </div>

                  <button className="text-slate-400 p-1" aria-label={isExpanded ? 'Collapse day details' : 'Expand day details'}>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expandable Daily Details */}
                {isExpanded && (
                  <div className="p-4 bg-slate-950/40 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs animate-in fade-in duration-150">
                    <div>
                      <div className="text-slate-400">Expected Precipitation</div>
                      <div className="text-white font-bold mt-1 font-mono">
                        {formatPrecipitation(day.precipSum, units.precipitationUnit)}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400">Peak Wind Gust</div>
                      <div className="text-white font-bold mt-1 font-mono">
                        {formatWindSpeed(day.windMax, units.windSpeedUnit)}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400">Max UV Index</div>
                      <div className="text-white font-bold mt-1 font-mono">
                        {day.uvMax !== undefined ? day.uvMax.toFixed(1) : '--'}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400">Sunrise / Sunset</div>
                      <div className="text-white font-bold mt-1 font-mono">
                        {day.sunrise} / {day.sunset}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
