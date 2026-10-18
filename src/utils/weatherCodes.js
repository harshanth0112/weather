/**
 * Open-Meteo standard WMO weather interpretation code mapper.
 * Maps WMO code and day/night status to human description, theme, and Lucide icon.
 */
export function getWeatherCondition(code, isDay = 1) {
  const isNight = isDay === 0;

  switch (code) {
    case 0:
      return {
        code,
        description: isNight ? 'Clear Night' : 'Sunny & Clear',
        theme: isNight ? 'clear-night' : 'clear-day',
        iconName: isNight ? 'Moon' : 'Sun',
      };
    case 1:
      return {
        code,
        description: isNight ? 'Mainly Clear' : 'Mainly Sunny',
        theme: isNight ? 'clear-night' : 'clear-day',
        iconName: isNight ? 'CloudMoon' : 'SunMedium',
      };
    case 2:
      return {
        code,
        description: 'Partly Cloudy',
        theme: isNight ? 'partly-cloudy-night' : 'partly-cloudy-day',
        iconName: isNight ? 'CloudMoon' : 'CloudSun',
      };
    case 3:
      return {
        code,
        description: 'Overcast',
        theme: 'overcast',
        iconName: 'Cloud',
      };
    case 45:
      return {
        code,
        description: 'Foggy',
        theme: 'fog',
        iconName: 'CloudFog',
      };
    case 48:
      return {
        code,
        description: 'Depositing Rime Fog',
        theme: 'fog',
        iconName: 'CloudFog',
      };
    case 51:
      return {
        code,
        description: 'Light Drizzle',
        theme: 'drizzle',
        iconName: 'CloudDrizzle',
      };
    case 53:
      return {
        code,
        description: 'Moderate Drizzle',
        theme: 'drizzle',
        iconName: 'CloudDrizzle',
      };
    case 55:
      return {
        code,
        description: 'Dense Drizzle',
        theme: 'drizzle',
        iconName: 'CloudDrizzle',
      };
    case 56:
    case 57:
      return {
        code,
        description: 'Freezing Drizzle',
        theme: 'drizzle',
        iconName: 'CloudHail',
      };
    case 61:
      return {
        code,
        description: 'Slight Rain',
        theme: 'rain',
        iconName: 'CloudRain',
      };
    case 63:
      return {
        code,
        description: 'Moderate Rain',
        theme: 'rain',
        iconName: 'CloudRain',
      };
    case 65:
      return {
        code,
        description: 'Heavy Rain',
        theme: 'rain',
        iconName: 'CloudRainWind',
      };
    case 66:
    case 67:
      return {
        code,
        description: 'Freezing Rain',
        theme: 'rain',
        iconName: 'CloudHail',
      };
    case 71:
      return {
        code,
        description: 'Slight Snow Fall',
        theme: 'snow',
        iconName: 'CloudSnow',
      };
    case 73:
      return {
        code,
        description: 'Moderate Snow Fall',
        theme: 'snow',
        iconName: 'CloudSnow',
      };
    case 75:
      return {
        code,
        description: 'Heavy Snow Fall',
        theme: 'snow',
        iconName: 'CloudSnow',
      };
    case 77:
      return {
        code,
        description: 'Snow Grains',
        theme: 'snow',
        iconName: 'Snowflake',
      };
    case 80:
      return {
        code,
        description: 'Slight Rain Showers',
        theme: 'rain',
        iconName: 'CloudRain',
      };
    case 81:
      return {
        code,
        description: 'Moderate Rain Showers',
        theme: 'rain',
        iconName: 'CloudRainWind',
      };
    case 82:
      return {
        code,
        description: 'Violent Rain Showers',
        theme: 'rain',
        iconName: 'CloudRainWind',
      };
    case 85:
    case 86:
      return {
        code,
        description: 'Snow Showers',
        theme: 'snow',
        iconName: 'CloudSnow',
      };
    case 95:
      return {
        code,
        description: 'Thunderstorm',
        theme: 'thunderstorm',
        iconName: 'CloudLightning',
      };
    case 96:
    case 99:
      return {
        code,
        description: 'Thunderstorm with Hail',
        theme: 'thunderstorm',
        iconName: 'CloudLightning',
      };
    default:
      return {
        code,
        description: isNight ? 'Clear Night' : 'Clear Day',
        theme: isNight ? 'clear-night' : 'clear-day',
        iconName: isNight ? 'Moon' : 'Sun',
      };
  }
}

/**
 * Format temperatures based on unit
 */
export function formatTemperature(celsius, unit = 'celsius') {
  if (celsius === undefined || celsius === null || isNaN(celsius)) return '--';
  if (unit === 'fahrenheit') {
    const f = (celsius * 9) / 5 + 32;
    return `${Math.round(f)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

/**
 * Format wind speed based on unit
 */
export function formatWindSpeed(kmh, unit = 'kmh') {
  if (kmh === undefined || kmh === null || isNaN(kmh)) return '--';
  if (unit === 'ms') {
    return `${(kmh / 3.6).toFixed(1)} m/s`;
  }
  if (unit === 'mph') {
    return `${(kmh * 0.621371).toFixed(1)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

/**
 * Format precipitation
 */
export function formatPrecipitation(mm, unit = 'mm') {
  if (mm === undefined || mm === null || isNaN(mm)) return '0.0 mm';
  if (unit === 'inch') {
    return `${(mm * 0.0393701).toFixed(2)} in`;
  }
  return `${Number(mm).toFixed(1)} mm`;
}

/**
 * Get compass cardinal direction
 */
export function getWindDirectionLabel(deg) {
  if (deg === undefined || deg === null) return 'N';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

/**
 * Readable condition label by weather code
 */
export function getWeatherDescription(code, isDay = 1) {
  return getWeatherCondition(code, isDay).description;
}

/**
 * Coordinated background gradients for hourly forecast cards
 * based on actual hourly weather conditions, day/night status, and active theme.
 */
export function getHourlyGradient(weatherCode, isDay = 1, theme = 'dark') {
  const isNight = isDay === 0;
  const isDark = theme === 'dark';

  // Nighttime gradients
  if (isNight) {
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
      // Rainy night
      return isDark
        ? 'bg-gradient-to-b from-[#0e1d38]/90 via-[#0a1329]/90 to-[#070d1e]/90 border-blue-500/25 hover:border-blue-400/50 shadow-blue-950/20'
        : 'bg-gradient-to-b from-[#dbeafe] via-[#bfdbfe] to-[#93c5fd]/70 border-blue-300 text-slate-800 shadow-blue-100';
    }
    if ([95, 96, 99].includes(weatherCode)) {
      // Thunderstorm night
      return isDark
        ? 'bg-gradient-to-b from-[#1e103a]/90 via-[#130b26]/90 to-[#090514]/90 border-purple-500/30 hover:border-purple-400/50 shadow-purple-950/20'
        : 'bg-gradient-to-b from-[#ede9fe] via-[#ddd6fe] to-[#c4b5fd]/70 border-purple-300 text-slate-900 shadow-purple-100';
    }
    if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
      // Snow night
      return isDark
        ? 'bg-gradient-to-b from-[#0f243a]/90 via-[#0b1728]/90 to-[#060c18]/90 border-cyan-400/25 hover:border-cyan-300/50 shadow-cyan-950/20'
        : 'bg-gradient-to-b from-[#f0f9ff] via-[#e0f2fe] to-[#bae6fd]/80 border-sky-300 text-slate-800 shadow-sky-100';
    }
    // Clear / Partly cloudy night
    return isDark
      ? 'bg-gradient-to-b from-[#131d36]/90 via-[#0d152a]/90 to-[#080d1b]/90 border-indigo-400/20 hover:border-indigo-300/40 shadow-indigo-950/20'
      : 'bg-gradient-to-b from-[#e2e8f0] via-[#cbd5e1] to-[#94a3b8]/60 border-slate-300 text-slate-900 shadow-slate-100';
  }

  // Daytime gradients by WMO category
  switch (weatherCode) {
    case 0:
    case 1:
      // Clear daytime / mainly sunny
      return isDark
        ? 'bg-gradient-to-b from-[#1e2a4a]/90 via-[#141d33]/90 to-[#0a101f]/90 border-amber-400/25 hover:border-amber-300/50 shadow-amber-500/5'
        : 'bg-gradient-to-b from-[#fef3c7] via-[#fde68a] to-[#fed7aa]/70 border-amber-300 text-slate-900 shadow-amber-100';

    case 2:
      // Partly cloudy day
      return isDark
        ? 'bg-gradient-to-b from-[#17253d]/90 via-[#101b2d]/90 to-[#0a111e]/90 border-sky-400/25 hover:border-sky-300/50 shadow-sky-500/5'
        : 'bg-gradient-to-b from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc]/60 border-sky-300 text-slate-900 shadow-sky-100';

    case 3:
      // Overcast
      return isDark
        ? 'bg-gradient-to-b from-[#1a2333]/90 via-[#121926]/90 to-[#0c101a]/90 border-slate-400/20 hover:border-slate-300/40'
        : 'bg-gradient-to-b from-[#f1f5f9] via-[#e2e8f0] to-[#cbd5e1]/70 border-slate-300 text-slate-800 shadow-slate-100';

    case 45:
    case 48:
      // Fog / mist
      return isDark
        ? 'bg-gradient-to-b from-[#192635]/90 via-[#111c29]/90 to-[#0c131d]/90 border-teal-400/20 hover:border-teal-300/40'
        : 'bg-gradient-to-b from-[#f0fdf4] via-[#e2e8f0] to-[#cbd5e1]/60 border-slate-300 text-slate-800 shadow-slate-100';

    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      // Drizzle
      return isDark
        ? 'bg-gradient-to-b from-[#13293d]/90 via-[#0e1d2c]/90 to-[#08121d]/90 border-cyan-400/25 hover:border-cyan-300/50'
        : 'bg-gradient-to-b from-[#e0f2fe] via-[#cffafe] to-[#a5f3fc]/70 border-cyan-300 text-slate-900 shadow-cyan-100';

    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      // Rain / showers
      return isDark
        ? 'bg-gradient-to-b from-[#102a4a]/90 via-[#0c1e36]/90 to-[#071324]/90 border-blue-400/30 hover:border-blue-300/60 shadow-blue-500/10'
        : 'bg-gradient-to-b from-[#dbeafe] via-[#bfdbfe] to-[#60a5fa]/50 border-blue-300 text-slate-900 shadow-blue-100';

    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      // Snow / snow showers
      return isDark
        ? 'bg-gradient-to-b from-[#142d45]/90 via-[#0d1e30]/90 to-[#081422]/90 border-sky-300/30 hover:border-sky-200/60 shadow-sky-400/10'
        : 'bg-gradient-to-b from-[#f0f9ff] via-[#e0f2fe] to-[#bae6fd]/80 border-sky-300 text-slate-900 shadow-sky-100';

    case 95:
    case 96:
    case 99:
      // Thunderstorm
      return isDark
        ? 'bg-gradient-to-b from-[#261545]/90 via-[#180c30]/90 to-[#0e071e]/90 border-purple-400/35 hover:border-purple-300/65 shadow-purple-500/15'
        : 'bg-gradient-to-b from-[#ede9fe] via-[#ddd6fe] to-[#a78bfa]/50 border-purple-300 text-slate-900 shadow-purple-100';

    default:
      return isDark
        ? 'bg-gradient-to-b from-[#17253a]/90 via-[#101c2e]/90 to-[#0b1320]/90 border-slate-500/20'
        : 'bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]/80 border-slate-200 text-slate-900';
  }
}
