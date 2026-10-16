import React, { useEffect, useState } from 'react';
import { Wind, AlertTriangle, ShieldCheck, Info, ExternalLink } from 'lucide-react';
import { fetchAirQuality } from '../services/weatherApi';

export default function AirQualityAlerts({ city, weather }) {
  const [aqData, setAqData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadAQ() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAirQuality(city.latitude, city.longitude);
        if (isMounted) setAqData(data);
      } catch (err) {
        if (isMounted) setError('Unable to load air quality data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadAQ();
    return () => { isMounted = false; };
  }, [city.latitude, city.longitude]);

  // Compute calculated risk indicators from real weather data
  const risks = [];
  if (weather && weather.current) {
    const cur = weather.current;
    if (cur.temperature_2m >= 38) {
      risks.push({
        type: 'Extreme Heat Risk',
        level: 'Severe',
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        detail: `Ambient temperature is ${cur.temperature_2m}°C. Stay hydrated and avoid peak afternoon sun.`,
      });
    } else if (cur.temperature_2m >= 33) {
      risks.push({
        type: 'High Heat Indicator',
        level: 'Moderate',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        detail: `Temperatures reaching ${cur.temperature_2m}°C. Drink plenty of water during outdoor activities.`,
      });
    }

    if (cur.wind_speed_10m >= 50 || (cur.wind_gusts_10m && cur.wind_gusts_10m >= 65)) {
      risks.push({
        type: 'Strong Wind Advisory',
        level: 'High',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        detail: `Sustained winds of ${cur.wind_speed_10m} km/h with gusts. Watch for flying debris or difficult driving conditions.`,
      });
    }

    if (cur.rain >= 10 || cur.precipitation >= 12) {
      risks.push({
        type: 'Heavy Precipitation Risk',
        level: 'High',
        color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        detail: `Heavy rain detected (${cur.precipitation} mm/h). Risk of localized surface water logging.`,
      });
    }

    if (cur.weather_code >= 95) {
      risks.push({
        type: 'Thunderstorm Indicator',
        level: 'Severe',
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
        detail: `Active thunderstorm conditions reported in numerical models. Seek indoor shelter.`,
      });
    }
  }

  const isIndia = city.country?.toLowerCase().includes('india') || city.country_code?.toUpperCase() === 'IN';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Air Quality Card */}
      <div className="weather-card p-4 sm:p-6 md:p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white tracking-tight">Air Quality Index</h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/25 font-semibold">
                Open-Meteo AQ
              </span>
            </div>
            <Wind className="w-5 h-5 text-cyan-400" />
          </div>

          {loading ? (
            <div className="py-8 text-center text-sm text-slate-400 animate-pulse">Loading air pollutants...</div>
          ) : error ? (
            <div className="py-8 text-center text-sm text-slate-400">{error}</div>
          ) : aqData ? (
            <div>
              {/* Main AQI score banner */}
              <div className="p-4 rounded-2xl weather-subcard flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">US AQI Standard</div>
                  <div className="text-4xl font-black text-white mt-1 flex items-baseline gap-2 font-mono tabular-nums">
                    {aqData.current.us_aqi !== null ? aqData.current.us_aqi : '--'}
                    {aqData.current.us_aqi !== null && <span className="text-xs font-normal text-slate-400 font-sans">/ 500</span>}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    European AQI: <span className="font-semibold text-white font-mono tabular-nums">{aqData.current.european_aqi !== null ? aqData.current.european_aqi : '--'}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{ backgroundColor: `${aqData.current.categoryColor}20`, color: aqData.current.categoryColor, border: `1px solid ${aqData.current.categoryColor}40` }}
                  >
                    {aqData.current.category}
                  </div>
                  <div className="text-[11px] text-slate-300 max-w-[200px] mt-2 leading-relaxed">
                    {aqData.current.advice}
                  </div>
                </div>
              </div>

              {/* Pollutants Breakdown */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4 text-center">
                <div className="weather-subcard p-2.5">
                  <div className="text-[10px] text-slate-400 font-medium">PM2.5</div>
                  <div className="text-sm font-bold text-white mt-0.5 font-mono">
                    {aqData.current.pm2_5 !== null ? aqData.current.pm2_5.toFixed(1) : '--'}
                  </div>
                  <div className="text-[9px] text-slate-500">μg/m³</div>
                </div>
                <div className="weather-subcard p-2.5">
                  <div className="text-[10px] text-slate-400 font-medium">PM10</div>
                  <div className="text-sm font-bold text-white mt-0.5 font-mono">
                    {aqData.current.pm10 !== null ? aqData.current.pm10.toFixed(1) : '--'}
                  </div>
                  <div className="text-[9px] text-slate-500">μg/m³</div>
                </div>
                <div className="weather-subcard p-2.5">
                  <div className="text-[10px] text-slate-400 font-medium">NO₂</div>
                  <div className="text-sm font-bold text-white mt-0.5 font-mono">
                    {aqData.current.no2 !== null ? aqData.current.no2.toFixed(1) : '--'}
                  </div>
                  <div className="text-[9px] text-slate-500">μg/m³</div>
                </div>
                <div className="weather-subcard p-2.5">
                  <div className="text-[10px] text-slate-400 font-medium">O₃ (Ozone)</div>
                  <div className="text-sm font-bold text-white mt-0.5 font-mono">
                    {aqData.current.o3 !== null ? aqData.current.o3.toFixed(1) : '--'}
                  </div>
                  <div className="text-[9px] text-slate-500">μg/m³</div>
                </div>
                <div className="weather-subcard p-2.5">
                  <div className="text-[10px] text-slate-400 font-medium">SO₂</div>
                  <div className="text-sm font-bold text-white mt-0.5 font-mono">
                    {aqData.current.so2 !== null ? aqData.current.so2.toFixed(1) : '--'}
                  </div>
                  <div className="text-[9px] text-slate-500">μg/m³</div>
                </div>
                <div className="weather-subcard p-2.5">
                  <div className="text-[10px] text-slate-400 font-medium">CO</div>
                  <div className="text-sm font-bold text-white mt-0.5 font-mono">
                    {aqData.current.co !== null ? Math.round(aqData.current.co) : '--'}
                  </div>
                  <div className="text-[9px] text-slate-500">μg/m³</div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="text-[10px] text-slate-400 mt-4 border-t border-white/[0.06] pt-3">
          Model: Open-Meteo Copernicus CAMS & regional atmospheric models.
        </div>
      </div>

      {/* Weather Risk Indicators & Official Alerts */}
      <div className="weather-card p-4 sm:p-6 md:p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Weather Risk Assessment</h3>
              <p className="text-xs text-slate-400">Model-derived indicators vs official meteorological bulletins</p>
            </div>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>

          {/* List of derived risk indicators */}
          {risks.length === 0 ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <div className="text-sm font-bold text-emerald-300">No High-Risk Weather Conditions Detected</div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Current temperature, wind speed, and precipitation rates are within normal safety thresholds.
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {risks.map((risk, idx) => (
                <div key={idx} className={`p-3.5 rounded-xl border ${risk.color}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{risk.type}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/10">
                      {risk.level}
                    </span>
                  </div>
                  <div className="text-xs mt-1 text-slate-200">{risk.detail}</div>
                </div>
              ))}
            </div>
          )}

          {/* Official Government Warning Link & Disclaimer */}
          <div className="mt-4 p-3.5 rounded-xl weather-subcard text-xs text-slate-300">
            <div className="flex items-center gap-2 font-semibold text-white">
              <Info className="w-4 h-4 text-cyan-400" />
              Official Warnings & Meteorological Services:
            </div>
            <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
              These risk notices are app-generated from raw mathematical model outputs and do NOT replace official civil protection bulletins.
            </p>
            {isIndia && (
              <a
                href="https://mausam.imd.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-cyan-400 hover:underline font-semibold text-xs"
              >
                Official India Meteorological Department (IMD) Bulletins <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        <div className="text-[10px] text-slate-400 mt-4 border-t border-white/[0.06] pt-3">
          Always consult regional civil protection authorities during extreme storm events.
        </div>
      </div>
    </div>
  );
}
