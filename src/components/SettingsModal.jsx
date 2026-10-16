import React from 'react';
import { X, Sliders, Sun, Moon, MapPin } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, units, onChangeUnits, city, onOpenLocationModal }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl glass-panel p-6 border border-white/20 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">Preferences & Settings</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close preferences modal"
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-5 py-4">
          {/* Default City Quick Setting */}
          {city && (
            <div className="p-3.5 rounded-2xl weather-subcard flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Default City</div>
                  <div className="text-xs font-bold text-white">
                    {city.name}{city.country ? `, ${city.country}` : ''}
                  </div>
                </div>
              </div>
              {onOpenLocationModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenLocationModal();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 text-xs font-bold transition-all"
                >
                  Change
                </button>
              )}
            </div>
          )}

          {/* Theme Mode (Light / Dark) */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Appearance & Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChangeUnits({ ...units, theme: 'dark' })}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  (units.theme || 'dark') === 'dark'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'weather-subcard text-slate-300 hover:text-white'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark Mode</span>
              </button>
              <button
                onClick={() => onChangeUnits({ ...units, theme: 'light' })}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  units.theme === 'light'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'weather-subcard text-slate-300 hover:text-white'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light Mode</span>
              </button>
            </div>
          </div>

          {/* Temperature Unit */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Temperature Scale
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChangeUnits({ ...units, temperatureUnit: 'celsius' })}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  units.temperatureUnit === 'celsius'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'weather-subcard text-slate-300 hover:text-white'
                }`}
              >
                Celsius (°C)
              </button>
              <button
                onClick={() => onChangeUnits({ ...units, temperatureUnit: 'fahrenheit' })}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  units.temperatureUnit === 'fahrenheit'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'weather-subcard text-slate-300 hover:text-white'
                }`}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>

          {/* Wind Speed Unit */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Wind Speed Unit
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['kmh', 'ms', 'mph'].map((u) => (
                <button
                  key={u}
                  onClick={() => onChangeUnits({ ...units, windSpeedUnit: u })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all uppercase border ${
                    units.windSpeedUnit === u
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'weather-subcard text-slate-300 hover:text-white'
                  }`}
                >
                  {u === 'kmh' ? 'km/h' : u === 'ms' ? 'm/s' : 'mph'}
                </button>
              ))}
            </div>
          </div>

          {/* Time Format */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Time Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChangeUnits({ ...units, timeFormat: '12h' })}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  units.timeFormat === '12h'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'weather-subcard text-slate-300 hover:text-white'
                }`}
              >
                12-Hour (AM/PM)
              </button>
              <button
                onClick={() => onChangeUnits({ ...units, timeFormat: '24h' })}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  units.timeFormat === '24h'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'weather-subcard text-slate-300 hover:text-white'
                }`}
              >
                24-Hour (Military)
              </button>
            </div>
          </div>

          {/* Accessibility: Reduced Motion */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
            <div>
              <div className="text-sm font-semibold text-white">Reduced Motion</div>
              <div className="text-xs text-slate-400">Disable background particle animations</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={units.reducedMotion}
              aria-label="Toggle reduced motion for background animations"
              onClick={() => onChangeUnits({ ...units, reducedMotion: !units.reducedMotion })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                units.reducedMotion ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-white/20'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  units.reducedMotion ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-cyan-500/20"
        >
          Save & Apply
        </button>
      </div>
    </div>
  );
}
