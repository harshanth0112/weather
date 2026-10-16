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
