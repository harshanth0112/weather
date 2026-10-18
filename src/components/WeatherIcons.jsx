import React from 'react';

/**
 * Professional SVG Weather Icons with 0 0 64 64 uniform viewBox,
 * rich layered gradients, clean vector silhouettes, and accessible scaling.
 */

// 1. Clear Day (Sun with clean rays and subtle pulse)
export function SvgSun({ className = 'w-8 h-8', size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sunny">
      <defs>
        <radialGradient id="sun-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF7ED" />
          <stop offset="35%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
        <filter id="sun-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Sun Rays */}
      <g stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" opacity="0.9">
        <line x1="32" y1="6" x2="32" y2="12" />
        <line x1="32" y1="52" x2="32" y2="58" />
        <line x1="6" y1="32" x2="12" y2="32" />
        <line x1="52" y1="32" x2="58" y2="32" />
        <line x1="13.6" y1="13.6" x2="17.8" y2="17.8" />
        <line x1="46.2" y1="46.2" x2="50.4" y2="50.4" />
        <line x1="13.6" y1="50.4" x2="17.8" y2="46.2" />
        <line x1="46.2" y1="17.8" x2="50.4" y2="13.6" />
      </g>
      {/* Sun Core */}
      <circle cx="32" cy="32" r="14" fill="url(#sun-grad)" filter="url(#sun-glow)" stroke="#F59E0B" strokeWidth="1" />
      <circle cx="28" cy="28" r="4" fill="#FFFFFF" opacity="0.35" />
    </svg>
  );
}

// 2. Clear Night (Crescent Moon with subtle stars)
export function SvgMoon({ className = 'w-8 h-8', size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Clear Night">
      <defs>
        <linearGradient id="moon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>
      {/* Stars */}
      <circle cx="48" cy="18" r="1.5" fill="#FDE047" opacity="0.8" />
      <circle cx="42" cy="38" r="1.2" fill="#E2E8F0" opacity="0.7" />
      <circle cx="16" cy="22" r="1.2" fill="#FDE047" opacity="0.75" />
      {/* Crescent Moon */}
      <path
        d="M37.5 12C25.5 12 16 21.5 16 33.5C16 45.5 25.5 55 37.5 55C43.5 55 48.9 52.5 52.8 48.5C41.8 48.5 33 39.7 33 28.7C33 21.7 36.6 15.6 42 12.2C40.6 12.1 39.1 12 37.5 12Z"
        fill="url(#moon-grad)"
        stroke="#CBD5E1"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Craters */}
      <circle cx="26" cy="32" r="2.5" fill="#64748B" opacity="0.25" />
      <circle cx="31" cy="42" r="3" fill="#64748B" opacity="0.2" />
    </svg>
  );
}

// 3. Partly Cloudy Day (Sun + Soft Floating Cloud)
export function SvgCloudSun({ className = 'w-8 h-8', size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Partly Cloudy">
      <defs>
        <radialGradient id="sun-partly-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
        <linearGradient id="cloud-grad-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
      </defs>
      {/* Background Sun */}
      <g transform="translate(4, -4)">
        <g stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
          <line x1="38" y1="12" x2="38" y2="17" />
          <line x1="53" y1="27" x2="58" y2="27" />
          <line x1="48.6" y1="16.4" x2="52.1" y2="12.9" />
          <line x1="27.4" y1="16.4" x2="23.9" y2="12.9" />
        </g>
        <circle cx="38" cy="27" r="10" fill="url(#sun-partly-grad)" stroke="#F59E0B" strokeWidth="1" />
      </g>
      {/* Foreground Cloud */}
      <path
        d="M20 48H44C48.4 48 52 44.4 52 40C52 35.8 48.8 32.4 44.6 32.1C43.8 25.3 38 20 31 20C24.8 20 19.5 24.1 17.8 29.9C13.4 30.6 10 34.4 10 39C10 44 14.5 48 20 48Z"
        fill="url(#cloud-grad-front)"
        stroke="#94A3B8"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 4. Partly Cloudy Night (Moon + Soft Floating Cloud)
export function SvgCloudMoon({ className = 'w-8 h-8', size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Partly Cloudy Night">
      <defs>
        <linearGradient id="cloud-moon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
        <linearGradient id="cloud-night-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="70%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
      </defs>
      {/* Moon behind cloud */}
      <path
        d="M38 12C32 12 27 15.5 24.6 20.6C26.5 21.5 28 23 29 25C34.5 24 39.5 27.5 41 33C43.5 32.5 45.5 33.5 47 35C48.2 32.5 49 29.5 49 26.5C49 18.5 44 12 38 12Z"
        fill="url(#cloud-moon-grad)"
        stroke="#CBD5E1"
        strokeWidth="1.2"
      />
      {/* Foreground Cloud */}
      <path
        d="M20 48H44C48.4 48 52 44.4 52 40C52 35.8 48.8 32.4 44.6 32.1C43.8 25.3 38 20 31 20C24.8 20 19.5 24.1 17.8 29.9C13.4 30.6 10 34.4 10 39C10 44 14.5 48 20 48Z"
        fill="url(#cloud-night-front)"
        stroke="#475569"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 5. Overcast (Layered heavy soft clouds)
export function SvgOvercast({ className = 'w-8 h-8', size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Overcast">
      <defs>
        <linearGradient id="cloud-back" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
        <linearGradient id="cloud-front-overcast" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F1F5F9" />
          <stop offset="60%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>
      {/* Back Layer Cloud */}
      <path
        d="M26 38H48C51.5 38 54 35.5 54 32C54 28.5 51.5 25.8 48 25.5C47.2 20 42.5 16 37 16C32 16 27.8 19.3 26.5 24C23 24.5 20 27.5 20 31C20 35 22.5 38 26 38Z"
        fill="url(#cloud-back)"
        opacity="0.85"
      />
      {/* Front Layer Cloud */}
      <path
        d="M18 50H44C48.4 50 52 46.4 52 42C52 37.8 48.8 34.4 44.6 34.1C43.8 27.3 38 22 31 22C24.8 22 19.5 26.1 17.8 31.9C13.4 32.6 10 36.4 10 41C10 46 13.6 50 18 50Z"
        fill="url(#cloud-front-overcast)"
        stroke="#64748B"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 6. Fog / Mist (Clouds with horizontal sleek fog streaks)
export function SvgFog({ className = 'w-8 h-8', size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Fog">
      <defs>
        <linearGradient id="fog-cloud" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>
      {/* Upper Cloud Silhouette */}
      <path
        d="M20 38H44C47.5 38 50 35 50 31.5C50 28 47.5 25 44 24.8C43.3 19 38 15 32 15C26.5 15 22 18.5 20.5 23.5C16.5 24 14 27 14 31C14 35 17 38 20 38Z"
        fill="url(#fog-cloud)"
        opacity="0.9"
      />
      {/* Horizontal Sleek Fog lines */}
      <g stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
        <line x1="12" y1="44" x2="52" y2="44" />
        <line x1="16" y1="50" x2="48" y2="50" />
        <line x1="22" y1="56" x2="42" y2="56" />
      </g>
    </svg>
  );
}

// 7. Drizzle (Cloud + Short Subtle Raindrops)
export function SvgDrizzle({ className = 'w-8 h-8', size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Drizzle">
      <defs>
        <linearGradient id="cloud-drizzle" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>
      {/* Cloud */}
      <path
        d="M18 40H44C48.4 40 52 36.4 52 32C52 27.8 48.8 24.4 44.6 24.1C43.8 17.3 38 12 31 12C24.8 12 19.5 16.1 17.8 21.9C13.4 22.6 10 26.4 10 31C10 36 13.6 40 18 40Z"
        fill="url(#cloud-drizzle)"
        stroke="#64748B"
        strokeWidth="1.5"
      />
      {/* Drizzle Droplets */}
      <g stroke="#38BDF8" strokeWidth="2" strokeLinecap="round">
        <line x1="22" y1="46" x2="20" y2="51" />
        <line x1="32" y1="46" x2="30" y2="51" />
        <line x1="42" y1="46" x2="40" y2="51" />
        <line x1="27" y1="53" x2="25" y2="58" />
        <line x1="37" y1="53" x2="35" y2="58" />
      </g>
    </svg>
  );
}

// 8. Rain (Cloud + Multiple distinct falling raindrops)
export function SvgRain({ className = 'w-8 h-8', size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rain">
      <defs>
        <linearGradient id="cloud-rain" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="60%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
      </defs>
      {/* Cloud */}
      <path
        d="M18 38H44C48.4 38 52 34.4 52 30C52 25.8 48.8 22.4 44.6 22.1C43.8 15.3 38 10 31 10C24.8 10 19.5 14.1 17.8 19.9C13.4 20.6 10 24.4 10 29C10 34 13.6 38 18 38Z"
        fill="url(#cloud-rain)"
        stroke="#475569"
        strokeWidth="1.5"
      />
      {/* Rain Streaks */}
      <g stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round">
        <line x1="23" y1="43" x2="19" y2="53" stroke="#38BDF8" />
        <line x1="33" y1="43" x2="29" y2="53" stroke="#0284C7" />
        <line x1="43" y1="43" x2="39" y2="53" stroke="#38BDF8" />
        <line x1="28" y1="50" x2="24" y2="60" stroke="#0284C7" />
        <line x1="38" y1="50" x2="34" y2="60" stroke="#38BDF8" />
      </g>
    </svg>
  );
}

// 9. Heavy Rain (Dense rain streaks beneath dark storm cloud)
export function SvgHeavyRain({ className = 'w-8 h-8', size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Heavy Rain">
      <defs>
        <linearGradient id="cloud-heavy" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="60%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
      </defs>
      <path
        d="M18 36H44C48.4 36 52 32.4 52 28C52 23.8 48.8 20.4 44.6 20.1C43.8 13.3 38 8 31 8C24.8 8 19.5 12.1 17.8 17.9C13.4 18.6 10 22.4 10 27C10 32 13.6 36 18 36Z"
        fill="url(#cloud-heavy)"
        stroke="#334155"
        strokeWidth="1.5"
      />
      {/* Diagonal Dense Rain Streaks */}
      <g stroke="#0284C7" strokeWidth="2.8" strokeLinecap="round">
        <line x1="20" y1="41" x2="15" y2="53" stroke="#38BDF8" />
        <line x1="28" y1="41" x2="23" y2="53" stroke="#0284C7" />
        <line x1="36" y1="41" x2="31" y2="53" stroke="#38BDF8" />
        <line x1="44" y1="41" x2="39" y2="53" stroke="#0284C7" />
        <line x1="24" y1="51" x2="19" y2="62" stroke="#0284C7" />
        <line x1="32" y1="51" x2="27" y2="62" stroke="#38BDF8" />
        <line x1="40" y1="51" x2="35" y2="62" stroke="#0284C7" />
      </g>
    </svg>
  );
}

// 10. Thunderstorm (Dark cloud + Rain + Golden Lightning Bolt)
export function SvgThunderstorm({ className = 'w-8 h-8', size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Thunderstorm">
      <defs>
        <linearGradient id="cloud-thunder" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#64748B" />
          <stop offset="60%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="bolt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      {/* Storm Cloud */}
      <path
        d="M18 36H44C48.4 36 52 32.4 52 28C52 23.8 48.8 20.4 44.6 20.1C43.8 13.3 38 8 31 8C24.8 8 19.5 12.1 17.8 17.9C13.4 18.6 10 22.4 10 27C10 32 13.6 36 18 36Z"
        fill="url(#cloud-thunder)"
        stroke="#1E293B"
        strokeWidth="1.5"
      />
      {/* Lightning Bolt */}
      <polygon
        points="32,32 24,46 32,46 28,60 42,42 34,42"
        fill="url(#bolt-grad)"
        stroke="#FBBF24"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* Rain Streaks */}
      <line x1="18" y1="44" x2="15" y2="54" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
      <line x1="46" y1="44" x2="43" y2="54" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 11. Snow (Cloud + Geometric Crystalline Snowflakes)
export function SvgSnow({ className = 'w-8 h-8', size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Snow">
      <defs>
        <linearGradient id="cloud-snow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
      </defs>
      <path
        d="M18 38H44C48.4 38 52 34.4 52 30C52 25.8 48.8 22.4 44.6 22.1C43.8 15.3 38 10 31 10C24.8 10 19.5 14.1 17.8 19.9C13.4 20.6 10 24.4 10 29C10 34 13.6 38 18 38Z"
        fill="url(#cloud-snow)"
        stroke="#94A3B8"
        strokeWidth="1.5"
      />
      {/* Snowflakes (3 crystalline shapes) */}
      <g stroke="#E0F2FE" strokeWidth="1.8" strokeLinecap="round">
        {/* Left Snowflake */}
        <g transform="translate(20, 48)">
          <line x1="0" y1="-5" x2="0" y2="5" />
          <line x1="-5" y1="0" x2="5" y2="0" />
          <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" />
          <line x1="-3.5" y1="3.5" x2="3.5" y2="-3.5" />
          <circle cx="0" cy="0" r="1.2" fill="#BAE6FD" />
        </g>
        {/* Center Snowflake */}
        <g transform="translate(32, 54)">
          <line x1="0" y1="-6" x2="0" y2="6" stroke="#BAE6FD" />
          <line x1="-6" y1="0" x2="6" y2="0" stroke="#BAE6FD" />
          <line x1="-4" y1="-4" x2="4" y2="4" stroke="#BAE6FD" />
          <line x1="-4" y1="4" x2="4" y2="-4" stroke="#BAE6FD" />
          <circle cx="0" cy="0" r="1.5" fill="#38BDF8" />
        </g>
        {/* Right Snowflake */}
        <g transform="translate(44, 48)">
          <line x1="0" y1="-5" x2="0" y2="5" />
          <line x1="-5" y1="0" x2="5" y2="0" />
          <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" />
          <line x1="-3.5" y1="3.5" x2="3.5" y2="-3.5" />
          <circle cx="0" cy="0" r="1.2" fill="#BAE6FD" />
        </g>
      </g>
    </svg>
  );
}

// 12. Freezing Rain / Sleet (Cloud + Rain Streaks & Ice Particles)
export function SvgFreezingRain({ className = 'w-8 h-8', size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Freezing Rain">
      <defs>
        <linearGradient id="cloud-freezing" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
      </defs>
      <path
        d="M18 38H44C48.4 38 52 34.4 52 30C52 25.8 48.8 22.4 44.6 22.1C43.8 15.3 38 10 31 10C24.8 10 19.5 14.1 17.8 19.9C13.4 20.6 10 24.4 10 29C10 34 13.6 38 18 38Z"
        fill="url(#cloud-freezing)"
        stroke="#475569"
        strokeWidth="1.5"
      />
      {/* Rain line */}
      <line x1="22" y1="44" x2="18" y2="54" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="42" y1="44" x2="38" y2="54" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
      {/* Ice Pellets / Hail Crystals */}
      <polygon points="32,44 35,48 32,52 29,48" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1" />
      <polygon points="26,52 28.5,55 26,58 23.5,55" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1" />
      <polygon points="38,52 40.5,55 38,58 35.5,55" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1" />
    </svg>
  );
}

// 13. Rain Showers (Daytime: Sun peeking behind raining cloud)
export function SvgRainShowers({ className = 'w-8 h-8', size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rain Showers">
      <defs>
        <radialGradient id="sun-shower-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
        <linearGradient id="cloud-shower-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>
      {/* Sun peeking */}
      <circle cx="42" cy="22" r="9" fill="url(#sun-shower-grad)" stroke="#F59E0B" strokeWidth="1" />
      <g stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" opacity="0.8">
        <line x1="42" y1="9" x2="42" y2="12" />
        <line x1="53" y1="17" x2="56" y2="15" />
        <line x1="55" y1="22" x2="58" y2="22" />
      </g>
      {/* Cloud */}
      <path
        d="M18 38H44C48.4 38 52 34.4 52 30C52 25.8 48.8 22.4 44.6 22.1C43.8 15.3 38 10 31 10C24.8 10 19.5 14.1 17.8 19.9C13.4 20.6 10 24.4 10 29C10 34 13.6 38 18 38Z"
        fill="url(#cloud-shower-grad)"
        stroke="#64748B"
        strokeWidth="1.5"
      />
      {/* Rain Streaks */}
      <g stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round">
        <line x1="22" y1="44" x2="18" y2="54" stroke="#38BDF8" />
        <line x1="32" y1="44" x2="28" y2="54" stroke="#0284C7" />
        <line x1="42" y1="44" x2="38" y2="54" stroke="#38BDF8" />
      </g>
    </svg>
  );
}

// 14. Snow Showers (Daytime: Sun peeking behind snowing cloud)
export function SvgSnowShowers({ className = 'w-8 h-8', size }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Snow Showers">
      <defs>
        <radialGradient id="sun-snow-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
        <linearGradient id="cloud-snow-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
      </defs>
      {/* Sun peeking */}
      <circle cx="42" cy="22" r="9" fill="url(#sun-snow-grad)" stroke="#F59E0B" strokeWidth="1" />
      {/* Cloud */}
      <path
        d="M18 38H44C48.4 38 52 34.4 52 30C52 25.8 48.8 22.4 44.6 22.1C43.8 15.3 38 10 31 10C24.8 10 19.5 14.1 17.8 19.9C13.4 20.6 10 24.4 10 29C10 34 13.6 38 18 38Z"
        fill="url(#cloud-snow-grad)"
        stroke="#94A3B8"
        strokeWidth="1.5"
      />
      {/* Falling Snowflakes */}
      <g stroke="#BAE6FD" strokeWidth="1.6" strokeLinecap="round">
        <g transform="translate(22, 48)">
          <line x1="0" y1="-4" x2="0" y2="4" />
          <line x1="-4" y1="0" x2="4" y2="0" />
        </g>
        <g transform="translate(34, 52)">
          <line x1="0" y1="-5" x2="0" y2="5" stroke="#38BDF8" />
          <line x1="-5" y1="0" x2="5" y2="0" stroke="#38BDF8" />
          <circle cx="0" cy="0" r="1.2" fill="#38BDF8" />
        </g>
        <g transform="translate(44, 48)">
          <line x1="0" y1="-4" x2="0" y2="4" />
          <line x1="-4" y1="0" x2="4" y2="0" />
        </g>
      </g>
    </svg>
  );
}

/**
 * Centralized Weather Icon Resolver
 * Maps Open-Meteo WMO code and isDay to the corresponding high-quality SVG Component.
 */
export function getWeatherIconComponent(code, isDay = 1) {
  const isNight = isDay === 0;

  switch (code) {
    case 0:
      return isNight ? SvgMoon : SvgSun;
    case 1:
      return isNight ? SvgCloudMoon : SvgSun;
    case 2:
      return isNight ? SvgCloudMoon : SvgCloudSun;
    case 3:
      return SvgOvercast;
    case 45:
    case 48:
      return SvgFog;
    case 51:
    case 53:
    case 55:
      return SvgDrizzle;
    case 56:
    case 57:
      return SvgFreezingRain;
    case 61:
    case 63:
      return SvgRain;
    case 65:
      return SvgHeavyRain;
    case 66:
    case 67:
      return SvgFreezingRain;
    case 71:
    case 73:
    case 75:
      return SvgSnow;
    case 77:
      return SvgSnow;
    case 80:
    case 81:
    case 82:
      return isNight ? SvgRain : SvgRainShowers;
    case 85:
    case 86:
      return isNight ? SvgSnow : SvgSnowShowers;
    case 95:
    case 96:
    case 99:
      return SvgThunderstorm;
    default:
      return isNight ? SvgMoon : SvgSun;
  }
}
