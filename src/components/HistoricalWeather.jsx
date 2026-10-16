import React, { useState } from 'react';
import { Calendar, Search, History, CloudRain, Thermometer } from 'lucide-react';
import { fetchHistoricalWeather } from '../services/weatherApi';
import { formatTemperature, formatPrecipitation, getWeatherCondition } from '../utils/weatherCodes';

export default function HistoricalWeather({ city, units }) {
  // ERA5 and ECMWF reanalysis models have an inherent 5-day publication delay
  const maxAvailableDate = new Date();
  maxAvailableDate.setDate(maxAvailableDate.getDate() - 5);
  const maxDateStr = maxAvailableDate.toISOString().split('T')[0];

  // Default to 1 year ago from today
  const lastYearDate = new Date();
  lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);
  const defaultDateStr = lastYearDate.toISOString().split('T')[0];

  const [date, setDate] = useState(defaultDateStr);
  const [histData, setHistData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = async () => {
    // Validate date against ERA5 bounds
    if (date > maxDateStr) {
      setError(`Recent dates have a 5-day publication delay in the ERA5 reanalysis archive. Latest available date is ${maxDateStr}.`);
      return;
    }
    if (date < '1940-01-01') {
      setError('Historical reanalysis records begin on 1940-01-01.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Historical API allows single day range: start_date=X&end_date=X
      const res = await fetchHistoricalWeather(city.latitude, city.longitude, date, date);
      setHistData(res);
    } catch (err) {
      setError('Historical archive unavailable for this specific date/range. Please try an earlier date.');
    } finally {
      setLoading(false);
    }
  };

  const dayData = histData?.daily;

  return (
    <div className="w-full rounded-3xl glass-panel p-4 sm:p-6 backdrop-blur-xl border border-white/10 shadow-2xl mt-5 sm:mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shrink-0">
            <History className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">Historical Weather Archive</h3>
            <p className="text-xs text-slate-300">Open-Meteo ERA5 climate reanalysis and observational data (1940 – Present)</p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={date}
            min="1940-01-01"
            max={maxDateStr}
            onChange={(e) => setDate(e.target.value)}
            aria-label="Select historical date"
            className="px-3 py-1.5 rounded-xl glass-panel text-xs text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
          <button
            onClick={handleFetch}
            disabled={loading}
            className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all disabled:opacity-50"
          >
            {loading ? 'Fetching...' : 'Query Past'}
          </button>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 mb-4 weather-subcard p-3 flex items-start gap-2">
        <span>📌</span>
        <div>
          <strong>Archive Lag & Source Notice:</strong> The ECMWF ERA5 reanalysis archive consolidates global observations with a standard <strong>5-day publication delay</strong>. Dates within the last 5 days are not yet processed in the reanalysis record.
        </div>
      </div>

      {error && <div className="p-3 text-xs text-rose-400 bg-rose-500/10 rounded-xl">{error}</div>}

      {dayData && dayData.time?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="p-4 rounded-2xl weather-subcard">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Date Record</span>
              <Calendar className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-lg font-bold text-white mt-1 tabular-nums">{dayData.time[0]}</div>
            <div className="text-xs text-cyan-400 mt-1">
              {getWeatherCondition(dayData.weather_code?.[0] || 0, 1).description}
            </div>
          </div>

          <div className="p-4 rounded-2xl weather-subcard">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Recorded Temp Range</span>
              <Thermometer className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-extrabold text-white mt-1 tabular-nums">
              {formatTemperature(dayData.temperature_2m_max[0], units.temperatureUnit)}
              <span className="text-sm font-normal text-slate-400 ml-1">
                / {formatTemperature(dayData.temperature_2m_min[0], units.temperatureUnit)}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Max High / Min Low</div>
          </div>

          <div className="p-4 rounded-2xl weather-subcard">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Precipitation</span>
              <CloudRain className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-extrabold text-white mt-1 tabular-nums">
              {formatPrecipitation(dayData.precipitation_sum[0] || 0, units.precipitationUnit)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Accumulated daily sum</div>
          </div>
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-400">
          Pick a date from the past and click "Query Past" to inspect historical weather in {city.name}.
        </div>
      )}
    </div>
  );
}
