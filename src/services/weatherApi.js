const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/search';
const AIR_QUALITY_BASE = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const HISTORICAL_BASE = 'https://archive-api.open-meteo.com/v1/archive';

const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

/**
 * Search cities using Open-Meteo Geocoding API
 */
/**
 * Search cities using Open-Meteo Geocoding API
 */
export async function searchCities(query, signal) {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const cacheKey = `geo:${trimmed.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const url = `${GEOCODING_BASE}?name=${encodeURIComponent(trimmed)}&count=8&language=en&format=json`;
    const res = await fetch(url, { signal });
    if (!res.ok) {
      throw new Error(`Geocoding failed with status: ${res.status}`);
    }
    const data = await res.json();
    const results = data.results || [];
    cache.set(cacheKey, { data: results, timestamp: Date.now() });
    return results;
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('Error fetching city search:', error);
    throw error;
  }
}

/**
 * Fetch real weather forecast from Open-Meteo Forecast API
 */
export async function fetchWeatherForecast(lat, lon, signal) {
  const cacheKey = `weather:${Number(lat).toFixed(2)},${Number(lon).toFixed(2)}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const currentParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'rain',
    'weather_code',
    'surface_pressure',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m',
    'cloud_cover',
    'visibility',
    'uv_index',
  ].join(',');

  const hourlyParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'precipitation_probability',
    'precipitation',
    'weather_code',
    'wind_speed_10m',
    'wind_direction_10m',
    'uv_index',
    'is_day',
  ].join(',');

  const dailyParams = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'apparent_temperature_max',
    'apparent_temperature_min',
    'precipitation_sum',
    'precipitation_probability_max',
    'wind_speed_10m_max',
    'wind_direction_10m_dominant',
    'sunrise',
    'sunset',
    'uv_index_max',
    'daylight_duration',
  ].join(',');

  const url = `${FORECAST_BASE}?latitude=${lat}&longitude=${lon}&current=${currentParams}&hourly=${hourlyParams}&daily=${dailyParams}&timezone=auto&forecast_days=7`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) {
      if (res.status === 429) {
        throw new Error('API Rate limit exceeded. Please wait a moment before refreshing.');
      }
      throw new Error(`Weather request failed with status: ${res.status}`);
    }

    const json = await res.json();
    const result = {
      latitude: json.latitude,
      longitude: json.longitude,
      elevation: json.elevation,
      timezone: json.timezone,
      timezone_abbreviation: json.timezone_abbreviation,
      current: json.current,
      hourly: json.hourly,
      daily: json.daily,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

/**
 * Fetch Air Quality metrics from Open-Meteo Air Quality API
 */
export async function fetchAirQuality(lat, lon, signal) {
  const cacheKey = `aq:${Number(lat).toFixed(2)},${Number(lon).toFixed(2)}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const hourlyParams = [
    'pm10',
    'pm2_5',
    'carbon_monoxide',
    'nitrogen_dioxide',
    'sulphur_dioxide',
    'ozone',
    'european_aqi',
    'us_aqi',
  ].join(',');

  const url = `${AIR_QUALITY_BASE}?latitude=${lat}&longitude=${lon}&hourly=${hourlyParams}&timezone=auto&forecast_days=3`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) {
      throw new Error(`Air Quality request failed with status: ${res.status}`);
    }
    const json = await res.json();
    const hourly = json.hourly || {};

    const currentIdx = 0;
    const usAqi = hourly.us_aqi?.[currentIdx] ?? null;
    const euroAqi = hourly.european_aqi?.[currentIdx] ?? null;
    const pm25 = hourly.pm2_5?.[currentIdx] ?? null;
    const pm10 = hourly.pm10?.[currentIdx] ?? null;
    const no2 = hourly.nitrogen_dioxide?.[currentIdx] ?? null;
    const o3 = hourly.ozone?.[currentIdx] ?? null;
    const so2 = hourly.sulphur_dioxide?.[currentIdx] ?? null;
    const co = hourly.carbon_monoxide?.[currentIdx] ?? null;

    let category = 'Good';
    let categoryColor = '#10b981';
    let advice = 'Air quality is satisfactory, and air pollution poses little or no risk.';

    if (usAqi === null) {
      category = 'Unmeasured';
      categoryColor = '#64748b';
      advice = 'Air quality sensor readings are currently unmeasured or pending for this location.';
    } else if (usAqi > 300) {
      category = 'Hazardous';
      categoryColor = '#7f1d1d';
      advice = 'Health warning: everyone is more likely to be affected.';
    } else if (usAqi > 200) {
      category = 'Very Unhealthy';
      categoryColor = '#831843';
      advice = 'Health alert: risk of health effects is increased for everyone.';
    } else if (usAqi > 150) {
      category = 'Unhealthy';
      categoryColor = '#ef4444';
      advice = 'Sensitive groups may experience health effects; general public affected.';
    } else if (usAqi > 100) {
      category = 'Unhealthy for Sensitive Groups';
      categoryColor = '#f97316';
      advice = 'Members of sensitive groups may experience minor health effects.';
    } else if (usAqi > 50) {
      category = 'Moderate';
      categoryColor = '#eab308';
      advice = 'Air quality is acceptable; minimal risk for unusually sensitive people.';
    }

    const current = {
      european_aqi: euroAqi,
      us_aqi: usAqi,
      pm2_5: pm25,
      pm10,
      no2,
      o3,
      so2,
      co,
      category,
      categoryColor,
      advice,
    };

    const data = { current, hourly };
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('Error fetching air quality:', error);
    throw error;
  }
}

/**
 * Fetch Historical Weather observations from Open-Meteo Archive API
 */
export async function fetchHistoricalWeather(lat, lon, startDate, endDate, signal) {
  const url = `${HISTORICAL_BASE}?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Historical weather query failed: ${res.status}`);
  }
  return await res.json();
}
