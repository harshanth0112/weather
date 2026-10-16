import React from 'react';

/**
 * Dynamic Weather Background Component
 * Automatically transforms sky gradients and atmospheric elements based on:
 * - WMO weather code from Open-Meteo
 * - is_day flag (1 = Day, 0 = Night)
 * - reducedMotion preference
 */
export default function WeatherBackground({ weatherCode = 0, isDay = 1, previewTheme = null, reducedMotion = false, isDarkMode = true }) {
  // Determine effective theme
  const getTheme = () => {
    if (previewTheme) return previewTheme;
    const isNight = isDay === 0;

    switch (weatherCode) {
      case 0:
      case 1:
        return isNight ? 'clear-night' : 'clear-day';
      case 2:
        return isNight ? 'partly-cloudy-night' : 'partly-cloudy-day';
      case 3:
        return 'overcast';
      case 45:
      case 48:
        return 'fog';
      case 51:
      case 53:
      case 55:
      case 56:
      case 57:
        return 'drizzle';
      case 61:
      case 63:
      case 65:
      case 66:
      case 67:
      case 80:
      case 81:
      case 82:
        return 'rain';
      case 71:
      case 73:
      case 75:
      case 77:
      case 85:
      case 86:
        return 'snow';
      case 95:
      case 96:
      case 99:
        return 'thunderstorm';
      default:
        return isNight ? 'clear-night' : 'clear-day';
    }
  };

  const theme = getTheme();

  // Premium, high-contrast sky gradients
  const darkGradients = {
    'clear-day':           'bg-gradient-to-b from-sky-500 via-blue-600 to-indigo-900',
    'clear-night':         'bg-gradient-to-b from-[#030612] via-[#080f26] to-[#0e0c28]',
    'partly-cloudy-day':   'bg-gradient-to-b from-sky-600 via-sky-800 to-slate-900',
    'partly-cloudy-night': 'bg-gradient-to-b from-[#060a18] via-[#0d1428] to-[#1a1840]',
    'overcast':            'bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950',
    'drizzle':             'bg-gradient-to-b from-slate-800 via-cyan-950 to-slate-950',
    'rain':                'bg-gradient-to-b from-slate-900 via-[#071e3a] to-[#020617]',
    'thunderstorm':        'bg-gradient-to-b from-zinc-950 via-[#2d0560] to-[#09090b]',
    'fog':                 'bg-gradient-to-b from-slate-600 via-slate-700 to-slate-900',
    'snow':                'bg-gradient-to-b from-slate-800 via-blue-950 to-cyan-950',
    'haze':                'bg-gradient-to-b from-amber-900/90 via-orange-950 to-slate-950',
  };

  const lightGradients = {
    'clear-day':           'bg-gradient-to-b from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc]/40',
    'clear-night':         'bg-gradient-to-b from-[#cbd5e1] via-[#94a3b8] to-[#64748b]/40',
    'partly-cloudy-day':   'bg-gradient-to-b from-[#e2e8f0] via-[#cbd5e1] to-[#94a3b8]/40',
    'partly-cloudy-night': 'bg-gradient-to-b from-[#94a3b8] via-[#64748b] to-[#475569]/40',
    'overcast':            'bg-gradient-to-b from-[#f1f5f9] via-[#e2e8f0] to-[#cbd5e1]/40',
    'drizzle':             'bg-gradient-to-b from-[#e0f2fe] via-[#cbd5e1] to-[#94a3b8]/40',
    'rain':                'bg-gradient-to-b from-[#cbd5e1] via-[#94a3b8] to-[#64748b]/40',
    'thunderstorm':        'bg-gradient-to-b from-[#e2e8f0] via-[#c7d2fe] to-[#818cf8]/30',
    'fog':                 'bg-gradient-to-b from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1]/50',
    'snow':                'bg-gradient-to-b from-[#f0f9ff] via-[#e0f2fe] to-[#bae6fd]/40',
    'haze':                'bg-gradient-to-b from-[#fef3c7] via-[#fde68a] to-[#f59e0b]/30',
  };

  const gradients = isDarkMode ? darkGradients : lightGradients;
  const currentGradient = gradients[theme] || gradients['clear-day'];

  const isNight = theme === 'clear-night' || theme === 'partly-cloudy-night';
  const isCloud = ['partly-cloudy-day', 'partly-cloudy-night', 'overcast', 'rain', 'thunderstorm'].includes(theme);
  const isRainy = ['rain', 'drizzle', 'thunderstorm'].includes(theme);

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-1000 ${currentGradient}`}>
      {/* === SUN === */}
      {(theme === 'clear-day' || theme === 'partly-cloudy-day') && (
        <div className="absolute top-12 right-[12%] w-40 h-40 rounded-full">
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-tr from-amber-200 to-yellow-400 ${!reducedMotion ? 'animate-sun-pulse' : ''}`}
            style={{ boxShadow: '0 0 90px 25px rgba(251,191,36,0.75)' }}
          />
          {!reducedMotion && (
            <div
              className="absolute inset-0 rounded-full border border-yellow-300/20 animate-sun-rays"
              style={{ transform: 'scale(1.8)' }}
            />
          )}
        </div>
      )}

      {/* === MOON === */}
      {isNight && (
        <div className="absolute top-14 right-[10%] w-28 h-28">
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-100 to-slate-300"
            style={{ boxShadow: '0 0 50px 12px rgba(226,232,240,0.35)' }}
          />
          <div className="absolute top-5 left-6 w-6 h-6 rounded-full bg-slate-300/50" />
          <div className="absolute top-11 left-14 w-8 h-8 rounded-full bg-slate-300/40" />
          <div className="absolute top-3 left-16 w-4 h-4 rounded-full bg-slate-300/35" />
          <div
            className="absolute -inset-6 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(226,232,240,0.4) 0%, transparent 70%)' }}
          />
        </div>
      )}

      {/* === STARS === */}
      {isNight && (
        <div className="absolute inset-0">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                top: `${(i * 17) % 82}%`,
                left: `${(i * 31) % 100}%`,
                width: `${(i % 3) + 1}px`,
                height: `${(i % 3) + 1}px`,
                opacity: (i % 5) * 0.18 + 0.3,
                animation: !reducedMotion
                  ? `pulseGlow ${2.5 + (i % 5)}s ease-in-out ${(i % 8) * 0.3}s infinite`
                  : 'none',
              }}
            />
          ))}
        </div>
      )}

      {/* === AURORA BOREALIS (clear-night only) === */}
      {theme === 'clear-night' && !reducedMotion && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute animate-aurora"
            style={{
              top: '12%', left: '-20%', width: '140%', height: '18%',
              background: 'linear-gradient(180deg, transparent 0%, rgba(16,185,129,0.22) 40%, rgba(6,182,212,0.18) 70%, transparent 100%)',
              borderRadius: '50%', filter: 'blur(24px)',
            }}
          />
          <div
            className="absolute animate-aurora"
            style={{
              top: '22%', left: '-30%', width: '160%', height: '14%',
              background: 'linear-gradient(180deg, transparent 0%, rgba(124,58,237,0.18) 45%, rgba(16,185,129,0.12) 75%, transparent 100%)',
              borderRadius: '50%', filter: 'blur(30px)', animationDelay: '4s',
            }}
          />
          <div
            className="absolute animate-aurora"
            style={{
              top: '8%', left: '-10%', width: '120%', height: '10%',
              background: 'linear-gradient(180deg, transparent 0%, rgba(236,72,153,0.10) 50%, transparent 100%)',
              borderRadius: '50%', filter: 'blur(20px)', animationDelay: '8s',
            }}
          />
        </div>
      )}

      {/* === CLOUD LAYERS === */}
      {isCloud && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute -top-16 -left-24 w-[700px] h-[380px] rounded-full blur-3xl ${!reducedMotion ? 'animate-drift' : ''}`}
            style={{ background: theme === 'thunderstorm' ? 'rgba(15,5,40,0.55)' : 'rgba(148,163,184,0.18)' }}
          />
          <div
            className={`absolute top-20 -right-16 w-[800px] h-[420px] rounded-full blur-3xl ${!reducedMotion ? 'animate-drift-reverse' : ''}`}
            style={{ background: theme === 'thunderstorm' ? 'rgba(10,3,30,0.5)' : 'rgba(100,116,139,0.20)' }}
          />
          <div
            className="absolute top-52 left-1/4 w-[600px] h-[320px] rounded-full blur-2xl"
            style={{ background: theme === 'thunderstorm' ? 'rgba(50,5,80,0.35)' : 'rgba(71,85,105,0.28)' }}
          />
        </div>
      )}

      {/* === DENSE FOG === */}
      {theme === 'fog' && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute inset-x-0 bottom-0 h-3/4 blur-3xl ${!reducedMotion ? 'animate-fog-drift' : ''}`}
            style={{ background: 'rgba(148,163,184,0.30)' }}
          />
          <div
            className={`absolute inset-x-0 top-1/4 h-1/2 blur-2xl ${!reducedMotion ? 'animate-drift-reverse' : ''}`}
            style={{ background: 'rgba(226,232,240,0.22)' }}
          />
          <div className="absolute inset-x-0 top-0 h-1/3 blur-3xl" style={{ background: 'rgba(148,163,184,0.15)' }} />
        </div>
      )}

      {/* === RAIN STREAKS === */}
      {isRainy && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(theme === 'drizzle' ? 40 : 80)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                top: `${(i * 13) % 40}%`,
                left: `${(i * 7) % 100}%`,
                width: theme === 'drizzle' ? '1px' : '1.5px',
                height: theme === 'drizzle' ? 12 : (20 + (i % 3) * 6),
                background: theme === 'thunderstorm'
                  ? 'linear-gradient(180deg, rgba(196,226,255,0.7), rgba(196,226,255,0.2))'
                  : 'linear-gradient(180deg, rgba(147,197,253,0.65), rgba(147,197,253,0.15))',
                transform: 'rotate(5deg)',
                animation: !reducedMotion
                  ? `rainFall ${theme === 'drizzle' ? 1.2 : 0.65}s linear ${(i % 12) * 0.07}s infinite`
                  : 'none',
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      )}

      {/* === SNOWFLAKES === */}
      {theme === 'snow' && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(55)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                top: `${(i * 17) % 60}%`,
                left: `${(i * 11) % 100}%`,
                width: `${(i % 4) + 2}px`,
                height: `${(i % 4) + 2}px`,
                background: 'rgba(255,255,255,0.9)',
                boxShadow: '0 0 4px rgba(255,255,255,0.7)',
                animation: !reducedMotion
                  ? `snowFall ${3.5 + (i % 5)}s linear ${(i % 10) * 0.2}s infinite`
                  : 'none',
              }}
            />
          ))}
        </div>
      )}

      {/* === LIGHTNING === */}
      {theme === 'thunderstorm' && !reducedMotion && (
        <div className="absolute inset-0 bg-indigo-200/60 animate-lightning pointer-events-none" />
      )}

      {/* === HEAT SHIMMER (clear-day) === */}
      {theme === 'clear-day' && !reducedMotion && (
        <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute bottom-0 animate-heat-shimmer"
              style={{
                left: `${15 + i * 28}%`,
                width: '30%',
                height: '80px',
                background: 'linear-gradient(180deg, transparent 0%, rgba(251,191,36,0.06) 50%, transparent 100%)',
                filter: 'blur(8px)',
                animationDelay: `${i * 1.1}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* === AMBIENT FLOATING ATMOSPHERIC ORBS === */}
      {!reducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full blur-[110px] animate-float-orb ${
              isDarkMode
                ? 'bg-gradient-to-tr from-cyan-600/25 via-blue-600/20 to-transparent'
                : 'bg-gradient-to-tr from-sky-400/35 via-cyan-300/25 to-transparent'
            }`}
          />
          <div
            className={`absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] animate-float-orb-reverse ${
              isDarkMode
                ? 'bg-gradient-to-bl from-indigo-700/25 via-purple-900/15 to-transparent'
                : 'bg-gradient-to-bl from-blue-300/30 via-indigo-200/20 to-transparent'
            }`}
          />
          <div
            className={`absolute -bottom-24 left-1/4 w-[750px] h-[550px] rounded-full blur-[130px] animate-float-orb ${
              isDarkMode
                ? 'bg-gradient-to-t from-sky-900/20 via-cyan-800/15 to-transparent'
                : 'bg-gradient-to-t from-sky-200/40 via-blue-100/20 to-transparent'
            }`}
            style={{ animationDelay: '-6s' }}
          />
        </div>
      )}

      {/* === VIGNETTE (text readability & theme blend) === */}
      <div
        className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${
          isDarkMode
            ? 'bg-gradient-to-t from-[#0B1220]/80 via-transparent to-black/25'
            : 'bg-gradient-to-t from-[#F4F8FC]/60 via-transparent to-white/20'
        }`}
      />
    </div>
  );
}
