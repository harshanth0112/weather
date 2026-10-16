import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Umbrella,
  Footprints,
  Thermometer,
  Cpu,
  Loader2,
} from 'lucide-react';
import { askGroqAssistant } from '../services/groqApi';
import { formatTemperature } from '../utils/weatherCodes';
import FormattedAIMessage from './FormattedAIMessage';

export default function WeatherAssistant({ city, weather, airQuality, units, groqKey }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am your Atmos Weather Advisor. Ask me anything about current conditions, forecasts, air quality, or outdoor recommendations for ${city.name}.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Rule-based fallback weather reasoning engine
  const generateRuleBasedAnswer = (query) => {
    const q = query.toLowerCase();
    const current = weather?.current;
    const daily = weather?.daily;

    if (!current) {
      return `Weather data for ${city.name} is currently loading or unavailable. Please wait a moment.`;
    }

    if (q.includes('umbrella') || q.includes('rain') || q.includes('wet')) {
      const rainToday = (daily?.precipitation_probability_max?.[0] || 0) > 30 || current.precipitation > 0;
      if (rainToday) {
        return `🌧️ **Yes, carry an umbrella!** There is a **${daily?.precipitation_probability_max?.[0] || 0}%** chance of rain in ${city.name} today with **${current.precipitation} mm** current precipitation recorded.`;
      }
      return `☀️ **No umbrella needed today.** The rain probability is low (**${daily?.precipitation_probability_max?.[0] || 0}%**) and conditions are currently ${current.cloud_cover}% cloudy.`;
    }

    if (q.includes('walk') || q.includes('running') || q.includes('exercise') || q.includes('outdoor')) {
      if (current.temperature_2m > 33) {
        return `🌡️ **Caution for outdoor workouts:** It's quite hot (**${formatTemperature(current.temperature_2m, units.temperatureUnit)}**). Early morning or late evening after sunset would be best for running or walking.`;
      }
      if (current.precipitation > 1 || current.weather_code >= 61) {
        return `🌧️ **Indoor workout recommended:** It is currently raining in ${city.name}. Best to wait until showers subside.`;
      }
      return `👟 **Great time for an outdoor walk!** Ambient temperature is **${formatTemperature(current.temperature_2m, units.temperatureUnit)}** with gentle winds at **${current.wind_speed_10m} km/h** and pleasant conditions.`;
    }

    if (q.includes('tomorrow') || q.includes('warmer') || q.includes('colder')) {
      const todayMax = daily?.temperature_2m_max?.[0];
      const tomorrowMax = daily?.temperature_2m_max?.[1];
      if (todayMax !== undefined && tomorrowMax !== undefined) {
        const diff = Math.round(tomorrowMax - todayMax);
        if (diff > 1) {
          return `📈 **Tomorrow will be warmer:** High will reach **${formatTemperature(tomorrowMax, units.temperatureUnit)}** compared to today's high of ${formatTemperature(todayMax, units.temperatureUnit)} (+${diff}°C).`;
        } else if (diff < -1) {
          return `📉 **Tomorrow will be cooler:** High will reach **${formatTemperature(tomorrowMax, units.temperatureUnit)}** compared to today's high of ${formatTemperature(todayMax, units.temperatureUnit)} (${diff}°C).`;
        }
        return `⚖️ **Tomorrow's temperature will be very similar to today**, peaking at **${formatTemperature(tomorrowMax, units.temperatureUnit)}**.`;
      }
    }

    if (q.includes('uv') || q.includes('sunscreen') || q.includes('sun')) {
      const uv = current.uv_index !== undefined ? current.uv_index : daily?.uv_index_max?.[0] || 0;
      if (uv >= 6) {
        return `🧴 **Sun protection advised:** UV Index is high (**${uv.toFixed(1)}**). Apply SPF 30+ sunscreen and wear sunglasses if outdoors between 11 AM and 4 PM.`;
      }
      return `🌤️ **Low to moderate UV Index (${uv.toFixed(1)}):** Minimal protection required for brief outdoor activities.`;
    }

    if (q.includes('air') || q.includes('aqi') || q.includes('pollution')) {
      if (airQuality?.current) {
        return `💨 **Air Quality in ${city.name}:** US AQI is **${airQuality.current.us_aqi}** (${airQuality.current.category}). ${airQuality.current.advice}`;
      }
      return `💨 Air quality sensor data for this location is currently pending from Open-Meteo.`;
    }

    // Default intelligent summary
    return `In **${city.name}**, current temperature is **${formatTemperature(current.temperature_2m, units.temperatureUnit)}** (feels like ${formatTemperature(current.apparent_temperature, units.temperatureUnit)}) with **${current.relative_humidity_2m}%** humidity and **${current.wind_speed_10m} km/h** winds. Today's forecast high is **${formatTemperature(daily?.temperature_2m_max?.[0], units.temperatureUnit)}**.`;
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // If Groq API key is configured, use Groq Cloud LLM
    if (groqKey && groqKey.trim()) {
      setLoading(true);
      try {
        const groqAnswer = await askGroqAssistant({
          apiKey: groqKey,
          userPrompt: query,
          city,
          weather,
          airQuality,
          units,
          conversationHistory: messages,
        });
        setMessages((prev) => [...prev, { sender: 'ai', text: groqAnswer, isGroq: true }]);
      } catch (err) {
        console.warn('Groq API call error. Falling back to rule-based engine:', err);
        const fallbackText = generateRuleBasedAnswer(query);
        setMessages((prev) => [...prev, { sender: 'ai', text: fallbackText, isGroq: false }]);
      } finally {
        setLoading(false);
      }
    } else {
      // Direct local rule-based response
      const answer = generateRuleBasedAnswer(query);
      setMessages((prev) => [...prev, { sender: 'ai', text: answer, isGroq: false }]);
    }
  };

  const quickPrompts = [
    { label: 'Should I carry an umbrella?', icon: Umbrella },
    { label: 'Best time for a walk?', icon: Footprints },
    { label: 'Will tomorrow be hotter?', icon: Thermometer },
    { label: 'Need sunscreen today?', icon: Sparkles },
  ];

  return (
    <div className="w-full rounded-3xl glass-panel p-4 sm:p-6 md:p-8 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[480px] sm:min-h-[540px] md:min-h-[580px]">
      <div>
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-black/10 dark:border-white/10 mb-3 sm:mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-lg shadow-cyan-500/10 shrink-0">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
                  Atmos AI Assistant
                </h2>
                {groqKey ? (
                  <span className="text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold flex items-center gap-1">
                    <Cpu className="w-3 h-3" /> Groq AI Active
                  </span>
                ) : (
                  <span className="text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-semibold">
                    Rule-Based Reasoner
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                Contextually grounded in real Open-Meteo observations for {city.name}
              </p>
            </div>
          </div>

          {messages.length > 1 && (
            <button
              onClick={() =>
                setMessages([
                  {
                    sender: 'ai',
                    text: `Hello! I am your Atmos Weather Advisor. Ask me anything about current conditions, forecasts, air quality, or outdoor recommendations for ${city.name}.`,
                  },
                ])
              }
              className="text-xs text-slate-400 hover:text-cyan-300 py-1 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors self-start sm:self-auto border border-white/5"
            >
              Reset Chat
            </button>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {quickPrompts.map((prompt, i) => {
            const Icon = prompt.icon;
            return (
              <button
                key={i}
                onClick={() => handleSend(prompt.label)}
                disabled={loading}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl weather-subcard text-[11px] sm:text-xs text-slate-200 transition-all active:scale-95 disabled:opacity-50"
              >
                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
                <span>{prompt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Messages Chat Log */}
        <div
          role="log"
          aria-live="polite"
          aria-label="Weather AI conversation history"
          className="h-[280px] sm:h-[320px] md:h-[360px] overflow-y-auto space-y-3 p-3 sm:p-4 rounded-2xl weather-subcard scrollbar-thin"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`${
                  msg.sender === 'user'
                    ? 'chat-bubble-user text-xs md:text-sm leading-relaxed max-w-[90%] sm:max-w-[85%]'
                    : 'chat-bubble-ai text-xs md:text-sm leading-relaxed max-w-[90%] sm:max-w-[85%]'
                }`}
              >
                {msg.sender === 'ai' ? (
                  <FormattedAIMessage text={msg.text} />
                ) : (
                  <div className="whitespace-pre-line">{msg.text}</div>
                )}
                {msg.sender === 'ai' && (
                  <div className="text-[10px] text-slate-400 mt-2 pt-1 border-t border-black/10 dark:border-white/10 flex items-center gap-1 font-mono">
                    {msg.isGroq ? '⚡ Groq Cloud AI' : '⚙️ Atmos Rule Reasoner'}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 bg-cyan-500/10 text-cyan-400 rounded-bl-none border border-cyan-400/20 flex items-center gap-2 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
                <span>Atmos AI is analyzing live weather models...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 mt-3 sm:mt-4 pt-1 sm:pt-2"
      >
        <input
          type="text"
          id="assistant-chat-input"
          aria-label={`Ask AI about weather in ${city.name}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about weather, clothing, or planning for ${city.name}...`}
          disabled={loading}
          className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl glass-panel text-xs md:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-slate-300 dark:border-white/10 disabled:opacity-50 min-w-0"
        />
        <button
          type="submit"
          aria-label="Send message to Weather Assistant"
          disabled={loading || !input.trim()}
          className="p-2.5 sm:p-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20 active:scale-95 disabled:opacity-50 shrink-0"
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
