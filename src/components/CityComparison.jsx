import React, { useState } from 'react';
import { Plus, X, ArrowRightLeft, TrendingUp } from 'lucide-react';
import { searchCities, fetchWeatherForecast } from '../services/weatherApi';
import { formatTemperature, getWeatherCondition, formatWindSpeed } from '../utils/weatherCodes';

export default function CityComparison({ baseCity, baseWeather, units }) {
  const [compareCities, setCompareCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length >= 2) {
      setLoading(true);
      try {
        const res = await searchCities(q);
        setSearchResults(res);
      } catch (err) {
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const addCityToCompare = async (city) => {
    if (compareCities.some((c) => c.city.id === city.id)) return;
    setSearchQuery('');
    setSearchResults([]);
    try {
      const weather = await fetchWeatherForecast(city.latitude, city.longitude);
      setCompareCities((prev) => [...prev, { city, weather }]);
    } catch (e) {
      alert('Could not fetch weather for comparison.');
    }
  };

  const removeCity = (id) => {
    setCompareCities((prev) => prev.filter((c) => c.city.id !== id));
  };

  const allCompared = [
    { city: baseCity, weather: baseWeather, isBase: true },
    ...compareCities,
  ];

  return (
    <div className="weather-card p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-400/20 shrink-0">
            <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">City Weather Comparison</h3>
            <p className="text-xs text-slate-300">Compare temperature, humidity, wind, and rain probabilities</p>
          </div>
        </div>

        {/* Add city search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Add city to compare..."
            aria-label="Add city to comparison"
            className="w-full px-3.5 py-2 rounded-xl glass-panel text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 border border-white/10"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full mt-1.5 w-full rounded-xl glass-panel border shadow-2xl z-50 divide-y divide-white/10 max-h-48 overflow-y-auto">
              {searchResults.map((item) => (
                <button
                  key={`${item.id}-${item.name}`}
                  onClick={() => addCityToCompare(item)}
                  className="w-full text-left p-2.5 hover:bg-white/10 text-xs flex justify-between items-center transition-colors"
                >
                  <span className="font-semibold text-white">{item.name}</span>
                  <span className="text-[10px] text-slate-400">{item.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {allCompared.map((item, index) => {
          if (!item.weather || !item.weather.current) return null;
          const cur = item.weather.current;
          const daily = item.weather.daily;
          const cond = getWeatherCondition(cur.weather_code, cur.is_day);

          return (
            <div
              key={index}
              className={`p-5 rounded-2xl border transition-all ${
                item.isBase ? 'bg-cyan-500/10 border-cyan-500/30 shadow-md shadow-cyan-950/20' : 'weather-subcard'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">
                    {item.isBase ? 'Current Focus' : 'Comparison'}
                  </div>
                  <h4 className="text-lg font-bold text-white mt-0.5">{item.city.name}</h4>
                  <div className="text-xs text-slate-400">{item.city.country}</div>
                </div>

                {!item.isBase && (
                  <button
                    onClick={() => removeCity(item.city.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5"
                    aria-label={`Remove ${item.city.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="mt-4 flex items-baseline justify-between border-b border-white/[0.08] pb-3">
                <div className="text-3xl font-extrabold text-white font-mono">
                  {formatTemperature(cur.temperature_2m, units.temperatureUnit)}
                </div>
                <div className="text-xs text-cyan-200 font-medium">{cond.description}</div>
              </div>

              <div className="space-y-2 mt-3.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Feels Like</span>
                  <span className="font-semibold text-white font-mono">{formatTemperature(cur.apparent_temperature, units.temperatureUnit)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>High / Low</span>
                  <span className="font-semibold text-white font-mono">
                    {formatTemperature(daily?.temperature_2m_max?.[0], units.temperatureUnit)} / {formatTemperature(daily?.temperature_2m_min?.[0], units.temperatureUnit)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Humidity</span>
                  <span className="font-semibold text-white font-mono">{cur.relative_humidity_2m}%</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Wind</span>
                  <span className="font-semibold text-white font-mono">{formatWindSpeed(cur.wind_speed_10m, units.windSpeedUnit)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Rain Chance</span>
                  <span className="font-semibold text-cyan-300 font-mono">{daily?.precipitation_probability_max?.[0] || 0}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
