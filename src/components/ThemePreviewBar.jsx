import React, { useState } from 'react';
import { Palette, X } from 'lucide-react';

const THEMES = [
  { id: 'clear-day', label: 'Clear Day (Sunny)' },
  { id: 'clear-night', label: 'Clear Night (Stars/Moon)' },
  { id: 'partly-cloudy-day', label: 'Partly Cloudy (Day)' },
  { id: 'partly-cloudy-night', label: 'Partly Cloudy (Night)' },
  { id: 'overcast', label: 'Overcast (Grey Clouds)' },
  { id: 'drizzle', label: 'Light Drizzle' },
  { id: 'rain', label: 'Rain (Streaks)' },
  { id: 'thunderstorm', label: 'Thunderstorm (Lightning)' },
  { id: 'fog', label: 'Fog / Mist' },
  { id: 'snow', label: 'Snowfall' },
  { id: 'haze', label: 'Haze (Sepia/Dust)' },
];

export default function ThemePreviewBar({ currentTheme, onSelectTheme }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-40 hidden sm:block">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open background weather themes QA preview drawer"
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-panel text-xs font-semibold text-slate-200 hover:text-cyan-300 border border-white/20 shadow-xl transition-all hover:scale-105"
        >
          <Palette className="w-4 h-4 text-cyan-400" aria-hidden="true" />
          <span>Test Backgrounds</span>
        </button>
      ) : (
        <div className="rounded-2xl glass-panel p-4 border border-white/20 shadow-2xl w-64 animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
              Weather Themes QA
            </span>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close background themes preview drawer"
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-1 max-h-56 overflow-y-auto scrollbar-thin">
            <button
              onClick={() => onSelectTheme(null)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                currentTheme === null
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                  : 'text-slate-300 hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              • Auto (Real Weather Code)
            </button>
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTheme(t.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  currentTheme === t.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                    : 'text-slate-300 hover:bg-black/10 dark:hover:bg-white/10'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
