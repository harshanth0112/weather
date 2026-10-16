/**
 * Service to interact with the Groq Cloud API for weather intelligence.
 * Compatible active models on Groq:
 * - openai/gpt-oss-120b (Primary high-intelligence model)
 * - qwen/qwen3.8-27b (Fast secondary model)
 * - openai/gpt-oss-20b
 */

const GROQ_COMPLETIONS_URL = 'https://api.groq.com/openai/v1/chat/completions';
const PRIMARY_MODEL = 'llama-3.3-70b-versatile';
const FALLBACK_MODELS = [
  'llama-3.1-8b-instant',
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'qwen/qwen3.8-27b',
];

/**
 * Send query to Groq with strictly structured live weather context
 */
export async function askGroqAssistant({
  apiKey,
  userPrompt,
  city,
  weather,
  airQuality,
  units,
  conversationHistory = [],
  signal,
}) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('MISSING_API_KEY');
  }

  const cur = weather?.current;
  const daily = weather?.daily;

  // Build rigorous, factual weather context string
  const contextLines = [
    `Location: ${city?.name || 'Unknown'}, ${city?.admin1 ? `${city.admin1}, ` : ''}${city?.country || ''}`,
    `Coordinates: Lat ${city?.latitude?.toFixed(2)}, Lon ${city?.longitude?.toFixed(2)}`,
    cur ? `Current Temperature: ${cur.temperature_2m}°C (Apparent/Feels Like: ${cur.apparent_temperature}°C)` : 'Current Temperature: Data Unavailable',
    cur ? `Relative Humidity: ${cur.relative_humidity_2m}%` : null,
    cur ? `Surface Atmospheric Pressure: ${Math.round(cur.surface_pressure)} hPa` : null,
    cur ? `Wind: ${cur.wind_speed_10m} km/h (Direction: ${cur.wind_direction_10m}°, Gusts: ${cur.wind_gusts_10m ?? 'N/A'} km/h)` : null,
    cur ? `Precipitation right now: ${cur.precipitation} mm (Rain: ${cur.rain} mm)` : null,
    cur ? `Cloud Cover: ${cur.cloud_cover}%` : null,
    cur ? `UV Index: ${cur.uv_index !== undefined ? cur.uv_index : 'Not measured'}` : null,
    cur ? `Visibility: ${cur.visibility ? `${(cur.visibility / 1000).toFixed(1)} km` : 'Over 10 km'}` : null,
    daily ? `Today's Forecast Range: High ${daily.temperature_2m_max?.[0]}°C / Low ${daily.temperature_2m_min?.[0]}°C` : null,
    daily ? `Max Precipitation Probability Today: ${daily.precipitation_probability_max?.[0] ?? 0}%` : null,
    daily?.temperature_2m_max?.[1] !== undefined ? `Tomorrow's High Forecast: ${daily.temperature_2m_max[1]}°C / Low: ${daily.temperature_2m_min[1]}°C` : null,
    airQuality?.current ? `Air Quality: US AQI ${airQuality.current.us_aqi} (${airQuality.current.category}), PM2.5: ${airQuality.current.pm2_5} µg/m³, PM10: ${airQuality.current.pm10} µg/m³` : 'Air Quality: Sensor readings currently pending',
  ].filter(Boolean).join('\n');

  const systemMessage = {
    role: 'system',
    content: `You are the Atmos Weather AI Advisor, an expert meteorologist and outdoor activity planner.
Your goal is to answer questions for the user accurately, concisely, and helpfully using ONLY the genuine real-time weather and forecast data provided below.
Rules:
1. Always base your advice strictly on the provided real atmospheric data.
2. If data is missing (e.g. UV or air quality is marked unavailable), honestly state that it's unmeasured rather than inventing values.
3. Be friendly, concise, and structured. Use bullet points or bold text where helpful for quick readability.
4. User preference units: Temperature in ${units?.temperatureUnit || 'celsius'}, Wind in ${units?.windSpeedUnit || 'kmh'}.

CURRENT ATMOSPHERIC DATA:
${contextLines}`,
  };

  const sanitizedHistory = conversationHistory.slice(-6).map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.text,
  }));

  const messages = [
    systemMessage,
    ...sanitizedHistory,
    { role: 'user', content: userPrompt },
  ];

  const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS];

  for (const modelToTry of modelsToTry) {
    try {
      const response = await fetch(GROQ_COMPLETIONS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: modelToTry,
          messages,
          temperature: 0.5,
          max_tokens: 600,
        }),
        signal,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('INVALID_API_KEY');
        }
        if (response.status === 429) {
          throw new Error('RATE_LIMITED');
        }
        // If 404 or model issue, try next model in loop
        if (response.status === 404) {
          continue;
        }
        const errText = await response.text();
        throw new Error(`Groq API error (${response.status}): ${errText}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (text) {
        return text;
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        throw err;
      }
      if (err.message === 'INVALID_API_KEY' || err.message === 'RATE_LIMITED') {
        throw err;
      }
      // If last model, rethrow generic error without exposing authorization or raw sensitive payload
      if (modelToTry === modelsToTry[modelsToTry.length - 1]) {
        throw err;
      }
    }
  }

  throw new Error('EMPTY_RESPONSE');
}
